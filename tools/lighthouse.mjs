// Lighthouse (mobile profile) against the local site. Targets (constitution IV): Performance >= 90,
// Accessibility >= 95, LCP <= 2.5 s, CLS <= 0.1 on the home page.
// Usage: node lighthouse.mjs [url-path ...] [--base https://live-domain]
import path from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { startSite } from './lib/site-server.mjs';

const args = process.argv.slice(2);
const baseArg = args.indexOf('--base') >= 0 ? args[args.indexOf('--base') + 1] : null;
const paths = args.filter((a, i) => a.startsWith('/') && args[i - 1] !== '--base');
const list = paths.length ? paths : ['/es/', '/en/'];

const site = baseArg ? null : await startSite();
const base = baseArg ?? site.base;
const browser = await chromium.launch({ args: ['--remote-debugging-port=9333'] });
let failed = 0;

for (const p of list) {
  const result = await lighthouse(base + p, { port: 9333, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  const lhr = result.lhr;
  const score = (k) => Math.round((lhr.categories[k].score ?? 0) * 100);
  const lcp = lhr.audits['largest-contentful-paint'].numericValue / 1000;
  const cls = lhr.audits['cumulative-layout-shift'].numericValue;
  const tbt = lhr.audits['total-blocking-time'].numericValue;
  const isHome = /^\/(es|en)\/$/.test(p);
  const pass = score('performance') >= 90 && score('accessibility') >= 95 && lcp <= 2.5 && cls <= 0.1;
  console.log(`${pass || !isHome ? 'ok  ' : 'FAIL'} ${p}  performance ${score('performance')}  accessibility ${score('accessibility')}  best-practices ${score('best-practices')}  seo ${score('seo')}  LCP ${lcp.toFixed(2)} s  CLS ${cls.toFixed(3)}  TBT ${Math.round(tbt)} ms`);
  if (isHome && !pass) failed += 1;
}
await browser.close();
site?.close();
if (failed) { console.error(`\n${failed} page(s) below the targets.`); process.exit(1); }
