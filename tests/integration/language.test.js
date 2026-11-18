// User story 3: language selection, remembered choice, equivalent URLs, hreflang and the sitemap.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startServer, quietLogs } from '../helpers.js';
import { pages } from '../../src/pages/index.js';
import { CONTENT_DIR } from '../../src/paths.js';

quietLogs();
let srv;
before(async () => { srv = await startServer(); });
after(() => srv.close());

test('GET / follows the saved cookie, then the browser, then Spanish (quickstart scenario 3)', async () => {
  const rows = [
    [{ 'accept-language': 'en-US,en;q=0.9' }, '/en/'],
    [{ 'accept-language': 'es-SV,es;q=0.9,en;q=0.5' }, '/es/'],
    [{ 'accept-language': 'pt-BR,pt;q=0.9' }, '/es/'],
    [{}, '/es/'],
    [{ 'accept-language': 'en', cookie: 'itl_lang=es' }, '/es/'],
    [{ 'accept-language': 'es', cookie: 'itl_lang=en' }, '/en/'],
  ];
  for (const [headers, location] of rows) {
    const res = await srv.get('/', headers);
    assert.equal(res.status, 302, JSON.stringify(headers));
    assert.equal(res.headers.get('location'), location, JSON.stringify(headers));
  }
});

test('the entry redirect is uncacheable and varies on Accept-Language and Cookie', async () => {
  const res = await srv.get('/', { 'accept-language': 'en' });
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const vary = res.headers.get('vary').split(',').map((s) => s.trim());
  assert.ok(vary.includes('Accept-Language') && vary.includes('Cookie'), vary.join());
});

test('a language-prefixed URL always serves that language, whatever the browser or cookie says', async () => {
  const res = await srv.get('/en/contact', { 'accept-language': 'es', cookie: 'itl_lang=es' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-language'), 'en');
  assert.match(await res.text(), /<html lang="en"/);
  const es = await srv.get('/es/contacto', { 'accept-language': 'en', cookie: 'itl_lang=en' });
  assert.match(await es.text(), /<html lang="es"/);
});

test('the toggle flag stores the choice; a URL without the flag never changes it', async () => {
  const withFlag = await srv.get('/es/privacidad?setlang=1');
  const cookie = withFlag.headers.get('set-cookie');
  assert.match(cookie, /^itl_lang=es;/);
  assert.match(cookie, /Max-Age=31536000/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /HttpOnly/);
  assert.doesNotMatch(cookie, /Secure/, 'Secure only in production');
  const english = await srv.get('/en/privacy?setlang=1');
  assert.match(english.headers.get('set-cookie'), /^itl_lang=en;/);
  assert.equal((await srv.get('/es/privacidad')).headers.get('set-cookie'), null);
  assert.equal((await srv.get('/en/')).headers.get('set-cookie'), null);
});

test('every page links to the equivalent page in the other language with the flag and rel=nofollow', async () => {
  const { PAGES, pathFor } = await import('../../src/i18n/locales.js');
  for (const key of pages.keys()) {
    if (!PAGES[key]) continue;
    for (const [lang, other] of [['es', 'en'], ['en', 'es']]) {
      const html = await (await srv.get(pathFor(key, lang))).text();
      const href = `${pathFor(key, other)}?setlang=1`;
      assert.ok(html.includes(`href="${href}"`), `${lang}/${key} links to ${href}`);
      assert.match(html, new RegExp(`href="${href.replace(/[?/]/g, '\\$&')}"[^>]*rel="nofollow"|rel="nofollow"[^>]*href="${href.replace(/[?/]/g, '\\$&')}"`));
      assert.match(html, /aria-label="Español, ES"/);
      assert.match(html, /aria-label="English, EN"/);
    }
  }
});

test('every page head has hreflang for es, en and x-default and a canonical without the query', async () => {
  const { PAGES, pathFor } = await import('../../src/i18n/locales.js');
  for (const key of pages.keys()) {
    if (!PAGES[key]) continue;
    for (const lang of ['es', 'en']) {
      const html = await (await srv.get(`${pathFor(key, lang)}?setlang=1`)).text();
      assert.ok(html.includes(`<link rel="canonical" href="http://localhost${pathFor(key, lang)}">`), `${lang}/${key} canonical`);
      assert.ok(html.includes(`hreflang="es" href="http://localhost${pathFor(key, 'es')}"`));
      assert.ok(html.includes(`hreflang="en" href="http://localhost${pathFor(key, 'en')}"`));
      assert.ok(html.includes(`hreflang="x-default" href="http://localhost${pathFor(key, 'es')}"`));
    }
  }
});

test('no page mixes languages: navigation and call-to-action text come from the page language only', async () => {
  const read = (lang) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, lang, 'common.json'), 'utf8'));
  const text = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
  for (const [lang, other, url] of [['es', 'en', '/es/'], ['en', 'es', '/en/']]) {
    const body = text(await (await srv.get(url)).text());
    const foreign = [...read(other).nav.links.map((l) => l.label), read(other).nav.cta.label, read(other).footer.privacyLabel]
      .filter((s) => !read(lang).nav.links.some((l) => l.label === s) && read(lang).nav.cta.label !== s && read(lang).footer.privacyLabel !== s);
    for (const word of foreign) assert.ok(!new RegExp(`(^|[^\\p{L}])${word}([^\\p{L}]|$)`, 'u').test(body), `${url} contains the other language's "${word}"`);
  }
});

test('sitemap.xml lists every registered page in both languages with alternates', async () => {
  const res = await srv.get('/sitemap.xml');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /xml/);
  const xml = await res.text();
  const { PAGES } = await import('../../src/i18n/locales.js');
  const expected = [...pages.keys()].filter((k) => PAGES[k]).length * 2;
  assert.equal((xml.match(/<loc>/g) || []).length, expected);
  assert.equal((xml.match(/hreflang="x-default"/g) || []).length, expected);
  assert.match(xml, /<loc>http:\/\/localhost\/es\/<\/loc>/);
  assert.match(xml, /xhtml:link rel="alternate" hreflang="en" href="http:\/\/localhost\/en\/"/);
});

test('sitemap.xml lists all 14 page URLs once every page exists', { skip: pages.size < 7 }, async () => {
  const xml = await (await srv.get('/sitemap.xml')).text();
  assert.equal((xml.match(/<loc>/g) || []).length, 14);
});

test('the language toggle works with no script on the page', async () => {
  const html = await (await srv.get('/es/')).text();
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<button[^>]*lang="(es|en)"/);
});
