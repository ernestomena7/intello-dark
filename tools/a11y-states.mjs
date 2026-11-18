// axe on the contact form's states: empty submit (validation errors) in both languages, and a successful send.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { startSite } from './lib/site-server.mjs';

const site = await startSite();
const browser = await chromium.launch();
let failed = 0;

async function check(page, label) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  console.log(`${bad.length ? 'FAIL' : 'ok  '} ${label}`);
  for (const v of bad) { console.log(`       ${v.impact} ${v.id}: ${v.help}`); for (const n of v.nodes.slice(0, 3)) console.log(`         ${n.target.join(' ')}`); }
  if (bad.length) failed += 1;
}

for (const [path, submit] of [['/es/contacto', 'Enviar mensaje'], ['/en/contact', 'Send message']]) {
  for (const width of [360, 1240]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(site.base + path);
    await page.waitForTimeout(2300); // minimum fill time
    await page.getByRole('button', { name: submit }).click();
    await page.waitForLoadState('networkidle');
    const summary = await page.locator('[role="alert"]').count();
    console.log(`     ${path} @${width}: error summary present = ${summary > 0}`);
    if (!summary) failed += 1;
    await check(page, `${path} @${width} validation errors`);
    await page.screenshot({ path: `out/contact-errors-${path.slice(1, 3)}-${width}.png`, fullPage: true });

    await page.fill('#name', 'Ana Pérez');
    await page.fill('#email', 'ana@example.com');
    await page.fill('#message', 'Quiero conocer el servicio de rastreo.');
    await page.waitForTimeout(2300);
    await page.getByRole('button', { name: submit }).click();
    await page.waitForLoadState('networkidle');
    await check(page, `${path} @${width} confirmation`);
    await context.close();
  }
}
await browser.close();
site.close();
if (failed) { console.error(`\n${failed} failure(s).`); process.exit(1); }
console.log('\ncontact states pass');
