// User story 4: Services and Technology pages.
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

const structure = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'structure.json'), 'utf8'));
const read = (lang, f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, lang, `${f}.json`), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const count = (html, re) => (html.match(re) || []).length;
const CONTACT = { es: '/es/contacto', en: '/en/contact' };

for (const [lang, url] of [['es', '/es/servicios'], ['en', '/en/services']]) {
  test(`${lang}: the Services page has four sections with deliverables, an image and a call to action with the topic`, async () => {
    const res = await srv.get(url);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.equal(count(html, /class="itl-root itl-svcsec/g), 4);
    assert.equal(count(html, /<h1[\s>]/g), 1);
    const items = read(lang, 'services').items;
    for (const s of structure.services) {
      assert.ok(html.includes(`id="${s.anchor}"`), `section id ${s.anchor} (the anchor the home cards link to)`);
      const text = items.find((x) => x.id === s.id);
      assert.ok(html.includes(text.title.replace(/&/g, '&amp;')));
      for (const d of text.deliverables) assert.ok(html.includes(d), `deliverable "${d}"`);
      assert.ok(html.includes(`href="${CONTACT[lang]}?topic=${s.id}"`), `CTA with topic ${s.id}`);
    }
    assert.ok(count(html, /itl-tile-empty|<img/g) >= 4, 'an image or slot per section');
    assert.doesNotMatch(html, /<script/i);
  });
}

for (const [lang, url] of [['es', '/es/tecnologia'], ['en', '/en/technology']]) {
  test(`${lang}: the Technology page names concrete capabilities in plain language`, async () => {
    const html = await (await srv.get(url)).text();
    const c = read(lang, 'technology');
    assert.equal(c.capabilities.length, 4);
    for (const cap of c.capabilities) {
      assert.ok(html.includes(esc(cap.title)), cap.title);
      assert.ok(html.includes(esc(cap.body)), cap.body);
    }
    assert.match(html, /class="itl-steps"/, 'how-it-works steps');
    assert.ok(html.includes(`href="${CONTACT[lang]}?topic=ai-analytics"`), 'CTA to contact with the AI topic');
    // AI is never a mascot or decoration (design system content rules).
    assert.doesNotMatch(html, /sparkle|✨|🤖|robot/i);
    assert.equal(count(html, /<h1[\s>]/g), 1);
  });
}

// The numbers-first home (BPO redesign) lists processes instead of service cards; the Services page is rebuilt next.
test('the Services page keeps one section per service anchor', async () => {
  for (const [lang, url] of [['es', '/es/servicios'], ['en', '/en/services']]) {
    const page = await (await srv.get(url)).text();
    for (const s of structure.services) {
      assert.ok(page.includes(`id="${s.anchor}"`));
    }
  }
});

test('Services and Technology have their own unique meta in both languages', async () => {
  for (const url of ['/es/servicios', '/en/services', '/es/tecnologia', '/en/technology']) {
    const html = await (await srv.get(url)).text();
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]{20,}">/);
  }
});
