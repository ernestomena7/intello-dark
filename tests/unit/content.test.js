// Enforces the content rules in specs/001-intello-marketing-website/contracts/content-schema.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR, PUBLIC_DIR, ROOT } from '../../src/paths.js';

const LANGS = ['es', 'en'];
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const files = (lang) => fs.readdirSync(path.join(CONTENT_DIR, lang)).filter((f) => f.endsWith('.json')).sort();
const doc = (lang, f) => readJson(path.join(CONTENT_DIR, lang, f));

// Flattens a JSON value to [path, value] leaves, e.g. ["items[0].question", "text"].
function leaves(value, prefix = '', out = []) {
  if (Array.isArray(value)) value.forEach((v, i) => leaves(v, `${prefix}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) leaves(v, prefix ? `${prefix}.${k}` : k, out);
  else out.push([prefix, value]);
  return out;
}

const allowed = fs.existsSync(path.join(ROOT, 'tests', 'allowed-figures.json'))
  ? readJson(path.join(ROOT, 'tests', 'allowed-figures.json')).allowed
  : [];

test('rule 1: both languages have the same files and the same key tree, with no empty strings', () => {
  assert.deepEqual(files('es'), files('en'), 'file lists differ between es and en');
  for (const f of files('es')) {
    const es = leaves(doc('es', f));
    const en = leaves(doc('en', f));
    assert.deepEqual(es.map(([p]) => p), en.map(([p]) => p), `${f}: key trees differ`);
    for (const lang of LANGS) {
      for (const [p, v] of lang === 'es' ? es : en) {
        assert.ok(typeof v !== 'string' || v.trim().length > 0, `${lang}/${f}: ${p} is empty`);
        assert.ok(v !== null && v !== undefined, `${lang}/${f}: ${p} is null`);
      }
    }
  }
});

test('rule 2: every English label is no longer than its Spanish label', () => {
  for (const f of files('es')) {
    const es = new Map(leaves(doc('es', f)));
    for (const [p, v] of leaves(doc('en', f))) {
      if (/(^|\.)label$/.test(p) || /\.label$/.test(p.replace(/\[\d+\]/g, ''))) {
        assert.ok(String(v).length <= String(es.get(p)).length, `${f}: ${p} "${v}" is longer than "${es.get(p)}"`);
      }
    }
  }
});

test('rule 3: meta title <= 60, description <= 160, unique within a language', () => {
  for (const lang of LANGS) {
    const titles = new Set(); const descriptions = new Set();
    for (const f of files(lang)) {
      const d = doc(lang, f);
      if (!d.meta) continue;
      assert.ok(d.meta.title.length <= 60, `${lang}/${f}: title is ${d.meta.title.length} characters`);
      assert.ok(d.meta.description.length <= 160, `${lang}/${f}: description is ${d.meta.description.length} characters`);
      assert.ok(!titles.has(d.meta.title), `${lang}/${f}: duplicate title`);
      assert.ok(!descriptions.has(d.meta.description), `${lang}/${f}: duplicate description`);
      titles.add(d.meta.title); descriptions.add(d.meta.description);
    }
  }
});

const VERBS = {
  es: ['Solicitar', 'Conoce', 'Conocer', 'Ver', 'Volver', 'Enviar', 'Hablar', 'Habla', 'Escríbenos', 'Contáctanos', 'Cuéntanos', 'Descubre', 'Explorar', 'Pregunta', 'Reservar', 'Agendar', 'Llámanos'],
  en: ['Request', 'Learn', 'View', 'See', 'Back', 'Send', 'Talk', 'Contact', 'Tell', 'Get', 'Explore', 'Discover', 'Ask', 'Book', 'Call', 'Go'],
};
const BUTTON_PATH = /(^|\.)(cta|secondary|submit|action|home|contact)\.label$/;

test('rule 4: voice (no exclamation marks, no emoji, no shouting, verb-first buttons of two or three words)', () => {
  for (const lang of LANGS) {
    for (const f of files(lang)) {
      for (const [p, v] of leaves(doc(lang, f))) {
        if (typeof v !== 'string') continue;
        const where = `${lang}/${f}: ${p}`;
        // The brand motto 'Better Now!' is the one allowed exclamation (client institutional document).
        assert.ok(!/[!¡]/.test(v.replace(/Better Now!/g, '')), `${where} has an exclamation mark`);
        assert.ok(!/\p{Extended_Pictographic}/u.test(v.replace(/[©®™]/g, '')), `${where} has an emoji`);
        assert.ok(!/\b[A-ZÁÉÍÓÚÑ]{5,}\b/.test(v), `${where} has an all-caps word`);
        if (BUTTON_PATH.test(p)) {
          const words = v.trim().split(/\s+/);
          assert.ok(words.length >= 2 && words.length <= 3, `${where} "${v}" must be two or three words`);
          assert.ok(VERBS[lang].includes(words[0]), `${where} "${v}" must start with a verb`);
        }
      }
    }
  }
});

test('rule 4a: no unsourced figures anywhere in the content', () => {
  const figure = /\b\d[\d.,]*\s?(\+|%|x\b)|\b\d{3,}\b/i;
  for (const lang of LANGS) {
    for (const f of files(lang)) {
      for (const [p, v] of leaves(doc(lang, f))) {
        if (typeof v !== 'string' || /(^|\.)updated$/.test(p)) continue;
        let text = v;
        for (const a of allowed) text = text.split(a).join('');
        assert.ok(!figure.test(text), `${lang}/${f}: ${p} contains a figure that is not in tests/allowed-figures.json: "${v}"`);
      }
    }
  }
});

// Positioning (owner, 2026-11-18): Intello is NOT a logistics, transport or warehousing company. It provides cargo
// monitoring and business intelligence (plus technology and back office services) FOR logistics companies.
const FORBIDDEN_POSITIONING = [
  /impulsamos tu log[ií]stica/i, /operaci[oó]n log[ií]stica completa/i, /nos encargamos de la operaci[oó]n/i, /operaci[oó]n que no se ve/i,
  /we power your logistics/i, /end-to-end logistics operations/i, /we run the operation/i, /operation nobody sees/i,
  /transportamos tu carga|almacenamos tu carga|entregamos tu carga|we transport your|we store your|we deliver your cargo/i,
  /mover la carga|moving cargo|de la gu[ií]a a la entrega|from waybill to delivery/i,
];
test('rule 8: the copy never presents Intello as a logistics or transport operator', () => {
  for (const lang of LANGS) {
    for (const f of files(lang)) {
      for (const [p, v] of leaves(doc(lang, f))) {
        if (typeof v !== 'string') continue;
        for (const re of FORBIDDEN_POSITIONING) assert.ok(!re.test(v), `${lang}/${f}: ${p} presents Intello as a logistics operator (${re}): "${v}"`);
      }
    }
  }
  // The About page and the FAQ must say it plainly.
  assert.match(JSON.stringify(doc('es', 'about.json')), /No somos una empresa de log[ií]stica/);
  assert.match(JSON.stringify(doc('en', 'about.json')), /We are not a logistics company/);
  assert.ok(doc('es', 'faq.json').items.some((i) => i.id === 'logistica'));
  assert.ok(doc('en', 'faq.json').items.some((i) => i.id === 'logistica'));
});

test('rule 5: no leftovers', () => {
  for (const lang of LANGS) {
    for (const f of files(lang)) {
      for (const [p, v] of leaves(doc(lang, f))) {
        if (typeof v === 'string') assert.ok(!/TODO|Lorem|XXX|\[\[/.test(v), `${lang}/${f}: ${p} has a leftover marker`);
      }
    }
  }
});

test('rule 6: every referenced image is registered with alt text, a brief, and its files when approved', () => {
  const images = readJson(path.join(CONTENT_DIR, 'images.json'));
  const structure = readJson(path.join(CONTENT_DIR, 'structure.json'));
  const ids = new Set([...Object.values(structure.imageSlots), ...structure.services.flatMap((s) => [s.cardImage, s.sectionImage]).filter(Boolean)]);
  for (const id of ids) assert.ok(images[id], `image "${id}" is not in images.json`);
  for (const [id, img] of Object.entries(images)) {
    assert.ok(img.alt?.es?.trim() && img.alt?.en?.trim(), `${id}: alt text is required in both languages`);
    assert.ok(img.brief?.trim(), `${id}: brief is required`);
    assert.ok(img.model, `${id}: model is required`);
    if (img.approved) {
      assert.ok(img.generatedOn, `${id}: generatedOn is required once approved`);
      for (const w of [480, 960, 1600]) assert.ok(fs.existsSync(path.join(PUBLIC_DIR, 'img', `${id}-${w}.webp`)), `${id}: public/img/${id}-${w}.webp is missing`);
    }
  }
});

test('structure, email and site files agree with each other', () => {
  const structure = readJson(path.join(CONTENT_DIR, 'structure.json'));
  const email = readJson(path.join(CONTENT_DIR, 'email.json'));
  const site = readJson(path.join(CONTENT_DIR, 'site.json'));
  assert.deepEqual(Object.keys(email.topics).sort(), [...structure.topics].sort());
  for (const lang of LANGS) assert.ok(site.hours[lang], `site.json hours.${lang} is missing`);
  const anchors = structure.services.map((s) => s.anchor);
  assert.equal(new Set(anchors).size, anchors.length, 'service anchors must be unique');
});

test('rule 7: placeholder details block a release check', (t) => {
  const site = readJson(path.join(CONTENT_DIR, 'site.json'));
  if (process.env.RELEASE_CHECK !== '1') {
    t.diagnostic(`site.json placeholder is ${site.placeholder} (enforced only when RELEASE_CHECK=1)`);
    return;
  }
  assert.equal(site.placeholder, false, 'content/site.json still has placeholder details');
});
