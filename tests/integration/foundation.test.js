// Skeleton behaviour: headers, design system assets, 404/500/413 pages, redirects, health.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import helmet from 'helmet';
import { startServer, quietLogs } from '../helpers.js';
import { CSP_DIRECTIVES, securityHeaders } from '../../src/security/headers.js';

quietLogs();
let srv;
before(async () => {
  srv = await startServer({
    extra: (app) => {
      app.get('/boom', () => { throw new Error('secret internal detail'); });
      app.get('/es/boom', () => { throw new Error('secret internal detail'); });
      app.post('/es/limit', express.urlencoded({ extended: false, limit: '1kb' }), (req, res) => res.send('ok'));
      app.post('/en/limit', express.urlencoded({ extended: false, limit: '1kb' }), (req, res) => res.send('ok'));
    },
  });
});
after(() => srv.close());

const EXPECTED_CSP = "default-src 'self';script-src 'none';style-src 'self';style-src-attr 'unsafe-inline';img-src 'self' data:;font-src 'self';form-action 'self';base-uri 'none';frame-ancestors 'none'";

test('every response carries the exact CSP and the other security headers, and no X-Powered-By', async () => {
  for (const url of ['/healthz', '/es/xyz', '/en/xyz', '/ds/bundle.css', '/robots.txt']) {
    const res = await srv.get(url);
    assert.equal(res.headers.get('content-security-policy'), EXPECTED_CSP, url);
    assert.equal(res.headers.get('x-powered-by'), null, url);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff', url);
    assert.equal(res.headers.get('x-frame-options'), 'DENY', url);
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', url);
    assert.equal(res.headers.get('strict-transport-security'), null, `${url}: HSTS only in production`);
  }
});

test('HSTS is sent in production', async () => {
  const app = express();
  app.use(securityHeaders({ isProduction: true }));
  app.get('/', (req, res) => res.send('x'));
  const server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const res = await fetch(`http://127.0.0.1:${server.address().port}/`);
  assert.match(res.headers.get('strict-transport-security'), /max-age=31536000/);
  server.close();
});

test('the CSP never allows scripts or <style> elements', () => {
  assert.deepEqual(CSP_DIRECTIVES.scriptSrc, ["'none'"]);
  assert.deepEqual(CSP_DIRECTIVES.styleSrc, ["'self'"]);
  assert.ok(!JSON.stringify(CSP_DIRECTIVES).includes('unsafe-eval'));
  void helmet;
});

test('bundle.css is served without the Google Fonts import', async () => {
  const res = await srv.get('/ds/bundle.css');
  assert.equal(res.status, 200);
  const css = await res.text();
  assert.doesNotMatch(css, /googleapis/);
  assert.match(css, /\.itl-btn/);
  // Only the import line may differ from the design system file: no leftover fragments, rules still intact.
  assert.doesNotMatch(css, /wght@|display=swap/);
  assert.match(css, /^\s*\/\* Intello components/);
  assert.match(css, /\nbody \{ margin: 0;/);
  const original = (await import('node:fs')).readFileSync(new URL('../../Intello Design System/components/bundle.css', import.meta.url), 'utf8');
  assert.equal(css.split('\n').length, original.split('\n').length - 1, 'exactly the import line is removed');
});

test('tokens.css, fonts and logos are served; the design system sources are not', async () => {
  assert.equal((await srv.get('/ds/tokens.css')).status, 200);
  assert.equal((await srv.get('/css/fonts.css')).status, 200);
  assert.equal((await srv.get('/fonts/montserrat-latin-400-normal.woff2')).status, 200);
  const logo = await srv.get('/ds/assets/Logos/intello-logo-navy.svg');
  assert.equal(logo.status, 200);
  assert.match(logo.headers.get('content-type'), /image\/svg\+xml/);
  assert.equal((await srv.get('/ds/assets/Icons/check.svg')).status, 200);
  for (const blocked of ['/ds/bundle.js', '/ds/components/bundle.js', '/ds/README.md', '/ds/tokens.json', '/ds/design-system.json', '/ds/components/Button/preview.html', '/ds/assets/Logos/README.md', '/ds/assets/Logos/%2e%2e/tokens.css']) {
    assert.equal((await srv.get(blocked)).status, 404, blocked);
  }
});

test('hashed asset URLs are cached for a year; unhashed ones for a day', async () => {
  const hashed = await srv.get('/ds/tokens.css?v=abc');
  assert.match(hashed.headers.get('cache-control'), /max-age=31536000/);
  assert.match(hashed.headers.get('cache-control'), /immutable/);
  const plain = await srv.get('/ds/tokens.css');
  assert.match(plain.headers.get('cache-control'), /max-age=86400/);
});

test('/es and /en redirect permanently to the slash URL', async () => {
  for (const lang of ['es', 'en']) {
    const res = await srv.get(`/${lang}`);
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), `/${lang}/`);
  }
});

test('unknown URLs under a language prefix return 404 in that language', async () => {
  const es = await srv.get('/es/no-existe', { 'accept-language': 'en' });
  assert.equal(es.status, 404);
  assert.equal(es.headers.get('content-language'), 'es');
  const esHtml = await es.text();
  assert.match(esHtml, /<html lang="es"/);
  assert.match(esHtml, /No encontramos esta página/);
  const en = await srv.get('/en/missing', { 'accept-language': 'es' });
  assert.equal(en.status, 404);
  assert.equal(en.headers.get('content-language'), 'en');
  assert.match(await en.text(), /We could not find this page/);
});

test('unknown unprefixed URLs use the cookie, then the browser, then Spanish', async () => {
  assert.match(await (await srv.get('/nope', { 'accept-language': 'en-US,en;q=0.9' })).text(), /We could not find/);
  assert.match(await (await srv.get('/nope', { 'accept-language': 'en', cookie: 'itl_lang=es' })).text(), /No encontramos/);
  assert.match(await (await srv.get('/nope')).text(), /No encontramos/);
  assert.match(await (await srv.get('/nope', { 'accept-language': 'pt-BR,pt;q=0.9' })).text(), /No encontramos/);
});

test('error pages hold no script or style element, and 404 is not indexable', async () => {
  const html = await (await srv.get('/es/xyz')).text();
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<style/i);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<link rel="stylesheet" href="\/ds\/bundle\.css\?v=/);
});

test('a thrown error returns 500 with the error page in the route language and no technical detail', async () => {
  const res = await srv.get('/es/boom');
  assert.equal(res.status, 500);
  assert.equal(res.headers.get('content-language'), 'es');
  const html = await res.text();
  assert.match(html, /Algo salió mal/);
  assert.doesNotMatch(html, /secret internal detail|Error:|at \w+/);
  const en = await srv.get('/boom', { 'accept-language': 'en' });
  assert.equal(en.status, 500);
  assert.match(await en.text(), /Something went wrong/);
});

test('a body over the limit returns 413 with the "too large" text in the route language', async () => {
  const body = 'a=' + 'x'.repeat(20000);
  for (const [path, text] of [['/es/limit', /demasiado largo/], ['/en/limit', /too long/]]) {
    const res = await fetch(srv.base + path, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
    assert.equal(res.status, 413);
    assert.match(await res.text(), text);
  }
});

test('/healthz answers ok and is never cached', async () => {
  const res = await srv.get('/healthz');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
  assert.match(res.headers.get('cache-control'), /no-store/);
});

test('robots.txt allows crawling and names the sitemap', async () => {
  const text = await (await srv.get('/robots.txt')).text();
  assert.match(text, /Allow: \//);
  assert.match(text, /Sitemap: http:\/\/localhost\/sitemap\.xml/);
});
