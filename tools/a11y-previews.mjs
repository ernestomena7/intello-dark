// Opens each design-system preview in a real browser and runs axe-core (WCAG 2.1 A and AA).
// Fails on any serious or critical violation. Usage: node a11y-previews.mjs [ComponentName ...]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DS = path.join(ROOT, 'Intello Design System');

const REACT = path.join(ROOT, 'node_modules', 'react', 'umd', 'react.development.js');
const REACT_DOM = path.join(ROOT, 'node_modules', 'react-dom', 'umd', 'react-dom.development.js');

const ALL = fs.readdirSync(path.join(DS, 'components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(DS, 'components', d.name, 'preview.html')))
  .map((d) => d.name);
// Components added or changed for the website; the original ones are reported but do not fail the run.
const CHANGED = new Set(['NavBar', 'ImageTile', 'LanguageToggle', 'SkipLink', 'Footer', 'CtaBand', 'PageHero', 'ServiceSection', 'Steps', 'Accordion', 'Prose', 'Field', 'TextInput', 'Textarea', 'Select', 'FormNotice', 'FormErrorSummary', 'Honeypot']);
const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : ALL;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (file, type) => { res.writeHead(200, { 'content-type': type }); res.end(fs.readFileSync(file)); };
  if (url.pathname.startsWith('/preview/')) {
    const name = url.pathname.slice('/preview/'.length);
    let html = fs.readFileSync(path.join(DS, 'components', name, 'preview.html'), 'utf8');
    const head = '<link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/bundle.css">' +
      '<script src="/react.js"></script><script src="/react-dom.js"></script><script src="/bundle.js"></script>';
    html = html.replace(/<html([^>]*)>/i, (m, a) => '<html' + (/\blang=/.test(a) ? a : a + ' lang="es"') + ' data-theme="light">').replace(/<head>/i, '<head>' + head);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
  } else if (url.pathname === '/tokens.css') send(path.join(DS, 'tokens.css'), 'text/css');
  else if (url.pathname === '/bundle.css') send(path.join(DS, 'components', 'bundle.css'), 'text/css');
  else if (url.pathname === '/bundle.js') send(path.join(DS, 'components', 'bundle.js'), 'text/javascript');
  else if (url.pathname === '/react.js') send(REACT, 'text/javascript');
  else if (url.pathname === '/react-dom.js') send(REACT_DOM, 'text/javascript');
  else { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let failed = 0;
for (const name of names) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()));
  await page.goto(`${base}/preview/${name}`);
  await page.waitForSelector('#root > *', { timeout: 5000 }).catch(() => errors.push('nothing rendered'));
  await page.waitForTimeout(100);
  // Page-level rules do not apply to a component preview.
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(['region', 'landmark-one-main', 'page-has-heading-one'])
    .analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const gated = CHANGED.has(name);
  const status = errors.length || bad.length ? (gated ? 'FAIL' : 'note') : 'ok';
  console.log(`${status.padEnd(4)} ${name}${gated ? '' : ' (existing)'}`);
  for (const e of errors) console.log(`       error: ${e}`);
  for (const v of bad) {
    console.log(`       ${v.impact} ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`         ${n.target.join(' ')}  ${(n.failureSummary || '').split('\n')[1] || ''}`);
  }
  if (gated && (errors.length || bad.length)) failed += 1;
  await context.close();
}
await browser.close();
server.close();
if (failed) { console.error(`\n${failed} gated preview(s) failed.`); process.exit(1); }
console.log('\nall gated previews pass');
