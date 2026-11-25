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
  test(`${lang}: the Services page shows the three process families with their figures, detail and a call to action with the topic`, async () => {
    const res = await srv.get(url);
    assert.equal(res.status, 200);
    const html = await res.text();
    const c = read(lang, 'services');
    assert.equal(count(html, /<h1[\s>]/g), 1);
    assert.equal(structure.services.length, 3);
    for (const s of structure.services) {
      const t = c.items.find((x) => x.id === s.id);
      assert.ok(html.includes(`id="${s.anchor}"`), `section #${s.anchor}`);
      assert.ok(html.includes(`href="#${s.anchor}"`), `index links to #${s.anchor}`);
      assert.ok(html.includes(esc(t.title)), t.title);
      assert.ok(html.includes(esc(t.figure.label)), t.figure.label);
      assert.ok(html.includes(`href="${CONTACT[lang]}?topic=${s.id}"`), `CTA with topic ${s.id}`);
    }
    // Control Tower: the seven phases, each with what the client sees
    assert.equal(count(html, /class="itl-phase"/g), 7);
    assert.equal(count(html, /class="itl-phase-see"/g), 7);
    // Back office services, the ETL list, the method and how an engagement starts
    for (const b of c.items.find((x) => x.id === 'back-office').services) assert.ok(html.includes(esc(b.title)), b.title);
    assert.equal(count(html, /<ul class="itl-facts"/g), 1);
    assert.ok(html.includes('id="metodo"'));
    assert.match(html, /class="itl-steps"/);
    // the feature still in development is labelled as such
    assert.ok(html.includes(c.items.find((x) => x.id === 'ai-analytics').capabilities.find((x) => x.badge).badge));
    assert.doesNotMatch(html, /<script/i);
  });
}

for (const [lang, url] of [['es', '/es/tecnologia'], ['en', '/en/technology']]) {
  test(`${lang}: the Technology page says how technology is used and how client data is handled, in plain language`, async () => {
    const html = await (await srv.get(url)).text();
    const c = read(lang, 'technology');
    for (const it of [...c.usage.items, ...c.security.items]) {
      assert.ok(html.includes(esc(it.title)), it.title);
      assert.ok(html.includes(esc(it.text)), it.text);
    }
    assert.match(html, /class="itl-steps"/, 'process-intelligence steps');
    assert.ok(html.includes('id="seguridad"'), 'data security section');
    // the certification is a goal, never shown as held
    assert.ok(html.includes(`<span class="itl-info-badge">${esc(c.security.badge)}</span>`));
    assert.ok(html.includes(`href="${CONTACT[lang]}?topic=technology"`), 'CTA to contact with the technology topic');
    assert.doesNotMatch(html, /<img/i, 'no photographs');
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
