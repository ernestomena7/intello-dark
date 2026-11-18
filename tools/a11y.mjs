// axe-core (WCAG 2.1 A and AA) over site routes. Fails on any serious or critical violation.
// Usage: node a11y.mjs [route ...]   (no routes = all of routes.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { startSite, blockExternal } from './lib/site-server.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2).filter((a) => a.startsWith('/'));
const list = args.length ? args : JSON.parse(fs.readFileSync(path.join(HERE, 'routes.json'), 'utf8')).routes;

const site = await startSite();
const browser = await chromium.launch();
let failed = 0;
for (const route of list) {
  for (const width of [360, 1240, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await blockExternal(page, site.base);
    const res = await page.goto(site.base + route, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    console.log(`${bad.length ? 'FAIL' : 'ok  '} ${String(res.status()).padEnd(3)} ${route} @${width}`);
    for (const v of bad) {
      console.log(`       ${v.impact} ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`         ${n.target.join(' ')}`);
    }
    if (bad.length) failed += 1;
    await context.close();
  }
}
await browser.close();
site.close();
if (failed) { console.error(`\n${failed} page(s) with serious or critical issues.`); process.exit(1); }
console.log('\nno serious or critical accessibility issues');
