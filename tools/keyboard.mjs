// Keyboard-only checks with JavaScript disabled: mobile menu, FAQ, contact form, and visible focus.
import { chromium } from 'playwright';
import { startSite } from './lib/site-server.mjs';

const site = await startSite();
const browser = await chromium.launch();
let failed = 0;
const ok = (cond, label) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${label}`); if (!cond) failed += 1; };

const focusVisible = (page) => page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return false;
  const s = getComputedStyle(el);
  return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
});

async function tabUntil(page, predicate, max = 40) {
  for (let i = 0; i < max; i += 1) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(predicate)) return true;
  }
  return false;
}

for (const lang of ['es', 'en']) {
  const labels = lang === 'es'
    ? { faq: '/es/preguntas', contact: '/es/contacto', submit: 'Enviar mensaje', sent: 'Mensaje enviado' }
    : { faq: '/en/faq', contact: '/en/contact', submit: 'Send message', sent: 'Message sent' };

  // Mobile menu at 360 px
  {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${site.base}/${lang}/`);
    const scripts = await page.locator('script').count();
    ok(scripts === 0, `${lang}: page has no script element`);
    const reached = await tabUntil(page, () => document.activeElement?.matches('summary.itl-nav-menu-btn'));
    ok(reached, `${lang}: the menu button is reachable by Tab`);
    ok(await focusVisible(page), `${lang}: the menu button shows a visible focus ring`);
    await page.keyboard.press('Enter');
    ok(await page.locator('details.itl-nav-menu[open]').count() === 1, `${lang}: Enter opens the menu`);
    const cta = page.locator('.itl-nav-menu-panel a.itl-btn');
    ok(await cta.isVisible(), `${lang}: the call to action is in the open menu`);
    ok(await page.locator('.itl-nav-menu-panel .itl-lang').isVisible(), `${lang}: the language toggle is in the open menu`);
    await page.keyboard.press('Enter');
    ok(await page.locator('details.itl-nav-menu[open]').count() === 0, `${lang}: Enter closes the menu`);
    await context.close();
  }

  // FAQ
  {
    const context = await browser.newContext({ viewport: { width: 1240, height: 900 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(site.base + labels.faq);
    const questions = page.locator('summary.itl-acc-q');
    const n = await questions.count();
    ok(n >= 5, `${lang}: FAQ has ${n} questions`);
    let allOk = true;
    for (let i = 0; i < n; i += 1) {
      await questions.nth(i).focus();
      if (!(await focusVisible(page))) allOk = false;
      await page.keyboard.press('Enter');
      const opened = await page.locator('details.itl-acc-item').nth(i).evaluate((d) => d.open);
      await page.keyboard.press('Space');
      const closed = await page.locator('details.itl-acc-item').nth(i).evaluate((d) => !d.open);
      if (!opened || !closed) allOk = false;
    }
    ok(allOk, `${lang}: every question opens with Enter, closes with Space, and shows a focus ring`);
    await context.close();
  }

  // Contact form, keyboard only
  {
    const context = await browser.newContext({ viewport: { width: 1240, height: 900 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(site.base + labels.contact);
    await page.waitForTimeout(2300);
    await page.locator('#name').focus();
    ok(await focusVisible(page), `${lang}: form fields show a focus ring`);
    await page.keyboard.type('Ana Pérez');
    await page.keyboard.press('Tab'); // company
    await page.keyboard.press('Tab'); // email
    await page.keyboard.type('ana@example.com');
    await page.keyboard.press('Tab'); // phone
    await page.keyboard.press('Tab'); // topic
    await page.keyboard.press('Tab'); // message
    await page.keyboard.type('Quiero conocer el servicio de rastreo.');
    const reachedSubmit = await tabUntil(page, () => document.activeElement?.matches('button[type="submit"]'), 6);
    ok(reachedSubmit, `${lang}: the honeypot is skipped and the submit button follows the message`);
    await page.keyboard.press('Enter');
    await page.waitForURL(/sent=1/, { timeout: 5000 }).catch(() => {});
    ok((await page.content()).includes(labels.sent), `${lang}: the form was sent by keyboard with scripts off`);
    await context.close();
  }
}

await browser.close();
site.close();
if (failed) { console.error(`\n${failed} check(s) failed.`); process.exit(1); }
console.log('\nkeyboard checks pass');
