// Screenshots every route at 360, 768 and 1240 px into tools/out/ and fails on horizontal scroll or overlap.
// Usage: node visual.mjs [route ...] [--previews]   (no routes = all of routes.json; routes that 404 unexpectedly are reported)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startSite, blockExternal } from './lib/site-server.mjs';
import { startPreviewServer, listPreviews } from './lib/preview-server.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const WIDTHS = [360, 768, 1240, 1440];
const args = process.argv.slice(2);
const withPreviews = args.includes('--previews');
const routes = args.filter((a) => a.startsWith('/'));
const list = routes.length ? routes : JSON.parse(fs.readFileSync(path.join(HERE, 'routes.json'), 'utf8')).routes;
fs.mkdirSync(path.join(OUT, 'previews'), { recursive: true });

const slug = (r) => (r.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'root');
const site = await startSite();
const browser = await chromium.launch();
let failed = 0;

for (const route of list) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const external = await blockExternal(page, site.base);
    const res = await page.goto(site.base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
    // Elements that stick out of the viewport horizontally (excluding visually hidden ones).
    const sticking = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const closed = el.closest('details:not([open])') && !el.matches('summary, summary *');
      return r.width > 0 && s.position !== 'fixed' && !closed && !el.closest('.itl-hp') && r.right > window.innerWidth + 1;
    }).slice(0, 5).map((el) => el.className?.baseVal ?? el.className ?? el.tagName));
    const bad = overflow.scroll > overflow.inner || sticking.length;
    await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}.png`), fullPage: true });
    console.log(`${bad ? 'FAIL' : 'ok  '} ${String(res.status()).padEnd(3)} ${route} @${width}${bad ? `  scrollWidth ${overflow.scroll} > ${overflow.inner}; ${sticking.join(' | ')}` : ''}${external.length ? `  EXTERNAL: ${external.join(', ')}` : ''}`);
    if (bad || external.length) failed += 1;
    await context.close();
  }
}

if (withPreviews) {
  const previews = await startPreviewServer();
  for (const name of listPreviews()) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.route('**/*', (route) => (route.request().url().startsWith(previews.base) ? route.continue() : route.abort()));
      await page.goto(`${previews.base}/preview/${name}`);
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(OUT, 'previews', `${name}-${width}.png`), fullPage: true });
      await context.close();
    }
  }
  previews.close();
  console.log(`previews written to ${path.join(OUT, 'previews')}`);
}

await browser.close();
site.close();
if (failed) { console.error(`\n${failed} check(s) failed.`); process.exit(1); }
console.log(`\nscreenshots in ${OUT}`);
