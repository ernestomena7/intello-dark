// Records the animated home hero as a video (draft reference for a higher-quality render) and stills per card.
// Usage: node record-hero.mjs [route] [width] [height] [seconds]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startSite } from './lib/site-server.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'hero-video');
const [route = '/es/', w = '1440', hgt = '900', secs = '17'] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const site = await startSite();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: +w, height: +hgt }, recordVideo: { dir: OUT, size: { width: +w, height: +hgt } } });
const page = await context.newPage();
await page.goto(site.base + route, { waitUntil: 'networkidle' });
for (const t of [1.5, 5.5, 9.5, 13.5]) {
  await page.waitForTimeout(t === 1.5 ? 1500 : 4000);
  await page.screenshot({ path: path.join(OUT, `still-${String(t).replace('.', '_')}s.png`) });
}
await page.waitForTimeout(Math.max(0, (+secs - 13.5) * 1000));
const video = page.video();
await context.close();
const target = path.join(OUT, `hero-${route.replace(/\//g, '') || 'root'}-${w}x${hgt}.webm`);
fs.renameSync(await video.path(), target);
await browser.close();
console.log(target);
process.exit(0);
