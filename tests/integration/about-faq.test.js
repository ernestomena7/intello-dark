// User story 5: About and FAQ.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startServer, quietLogs } from '../helpers.js';
import { CONTENT_DIR } from '../../src/paths.js';

quietLogs();
let srv;
before(async () => { srv = await startServer(); });
after(() => srv.close());

const read = (lang, f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, lang, `${f}.json`), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const count = (html, re) => (html.match(re) || []).length;
const CONTACT = { es: '/es/contacto', en: '/en/contact' };

for (const [lang, url] of [['es', '/es/preguntas'], ['en', '/en/faq']]) {
  test(`${lang}: every FAQ item is a native details/summary with its answer already in the HTML`, async () => {
    const html = await (await srv.get(url)).text();
    const c = read(lang, 'faq');
    assert.equal(count(html, /<details[^>]*class="itl-acc-item"/g), c.items.length, 'one details per question (the mobile menu is a separate details)');
    assert.equal(count(html, /<summary class="itl-acc-q"/g), c.items.length);
    for (const item of c.items) {
      assert.match(html, new RegExp(`<details[^>]*id="${item.id}"`));
      for (const p of item.answer) assert.ok(html.includes(esc(p)), `answer text for ${item.id}`);
    }
    assert.ok(html.includes(`href="${CONTACT[lang]}"`), 'call to action to the contact page');
    assert.doesNotMatch(html, /<script/i);
    assert.equal(count(html, /<h1[\s>]/g), 1);
  });
}

for (const [lang, url] of [['es', '/es/nosotros'], ['en', '/en/about']]) {
  test(`${lang}: the About page states the operation, the engagement steps and the kinds of clients, with a call to action`, async () => {
    const html = await (await srv.get(url)).text();
    const c = read(lang, 'about');
    for (const p of c.story.body) assert.ok(html.includes(p));
    for (const s of c.approach.steps) assert.ok(html.includes(s.title));
    for (const item of c.clients.items) assert.ok(html.includes(item));
    assert.ok(html.includes(`href="${CONTACT[lang]}"`));
    assert.equal(count(html, /<h1[\s>]/g), 1);
  });
}

test('About and FAQ content has no unsourced figures (the site-wide check lives in content.test.js)', () => {
  const figure = /\b\d[\d.,]*\s?(\+|%|x\b)|\b\d{3,}\b/i;
  for (const lang of ['es', 'en']) {
    for (const f of ['about', 'faq']) {
      assert.ok(!figure.test(JSON.stringify(read(lang, f))), `${lang}/${f} has a figure`);
    }
  }
});
