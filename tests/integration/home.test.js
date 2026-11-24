// User story 1: the homepage in both languages (spec FR-006 to FR-013, SC-011).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startServer, quietLogs, rawGet } from '../helpers.js';
import { CONTENT_DIR } from '../../src/paths.js';

quietLogs();
let srv;
before(async () => { srv = await startServer(); });
after(() => srv.close());

const read = (lang, file) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, lang, `${file}.json`), 'utf8'));
const structure = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'structure.json'), 'utf8'));
const count = (html, re) => (html.match(re) || []).length;
const SERVICES = { es: '/es/servicios', en: '/en/services' };

for (const lang of ['es', 'en']) {
  test(`${lang}: the homepage has the reference structure`, async () => {
    const res = await srv.get(`/${lang}/`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-language'), lang);
    const html = await res.text();
    const home = read(lang, 'home');
    const common = read(lang, 'common');
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.equal(count(html, /<h1[\s>]/g), 1, 'exactly one h1');
    assert.match(html, /itl-title-display/, 'display headline');
    assert.match(html, /itl-title-accent/, 'two-tone headline accent');
    assert.ok(html.includes(esc(home.hero.eyebrow)), 'eyebrow');
    assert.ok(html.includes(esc(home.hero.lede)), 'lede');
    assert.match(html, /href="\/(es|en)\/(contacto|contact)" class="itl-btn itl-btn-accent itl-btn-lg"/, 'primary CTA to contact');
    // numbers-first hero: headline figures and the illustrated route map (no photograph)
    assert.match(html, /class="itl-root itl-maphero"/);
    assert.equal(count(html, /class="itl-stat"/g) >= 3, true, 'headline figures');
    assert.ok(html.includes('+17'), 'monthly data cells figure');
    assert.match(html, /src="\/img\/route-map\.svg\?v=[0-9a-f]{10}"/, 'illustrated route map with a versioned URL');
    const trails = count(html, /class="itl-map-trail"/g);
    assert.ok(trails > 0 && trails <= 10, 'a few light trails on the busiest routes');
    assert.equal(count(html, /class="itl-hud /g), home.map.cards.length, 'one HUD card per port');
    assert.ok(html.includes(esc(home.hero.badge)), 'the simulation is labelled as illustrative');
    // sections: processes, control tower, reach, intelligence, promises, culture
    for (const id of ['procesos', 'torre-de-control', 'alcance', 'inteligencia', 'promesas', 'cultura']) assert.ok(html.includes(`id="${id}"`), `section #${id}`);
    assert.equal(count(html, /class="itl-prow"/g), home.processes.items.length);
    assert.equal(count(html, /class="itl-phase"/g), 7, 'seven Control Tower phases');
    assert.equal(count(html, /class="itl-bar"/g), home.reach.origins.length);
    assert.ok(html.includes(`href="/${lang}/${lang === 'es' ? 'nosotros' : 'about'}"`), 'about link');

    // closing call to action, footer, language toggle
    assert.ok(html.includes(esc(common.ctaBand.title)), 'closing call to action band');
    assert.match(html, /<footer/);
    assert.equal(count(html, /<footer/g), 1);

    // no fabricated figures and no video link (FR-013)
    assert.doesNotMatch(html, /5000|itl-videolink/);
  });

  test(`${lang}: every image slot or image carries text in the page language, and no script or style element`, async () => {
    const html = await (await srv.get(`/${lang}/`)).text();
    assert.doesNotMatch(html, /<script/i);
    assert.doesNotMatch(html, /<style/i);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/itl-map-land/.test(m[0])) assert.match(m[0], /alt="[^"]+"/, 'img needs non-empty alt');
      assert.match(m[0], /width="\d+"/);
      assert.match(m[0], /height="\d+"/);
    }
    // slots expose their art-direction text as the figure label
    assert.match(html, /<svg class="itl-map-svg"[^>]*role="img"/, 'the map has a text alternative');
  });
}

test('the language toggle links to the equivalent page in the other language', async () => {
  const es = await (await srv.get('/es/')).text();
  assert.match(es, /href="\/en\/\?setlang=1"[^>]*rel="nofollow"|rel="nofollow"[^>]*href="\/en\/\?setlang=1"/);
  const en = await (await srv.get('/en/')).text();
  assert.match(en, /href="\/es\/\?setlang=1"/);
});

test('pages have hreflang alternates, a canonical URL without the query, and Open Graph tags', async () => {
  const html = await (await srv.get('/es/?setlang=1')).text();
  assert.match(html, /<link rel="canonical" href="http:\/\/localhost\/es\/">/);
  assert.match(html, /hreflang="es" href="http:\/\/localhost\/es\/"/);
  assert.match(html, /hreflang="en" href="http:\/\/localhost\/en\/"/);
  assert.match(html, /hreflang="x-default" href="http:\/\/localhost\/es\/"/);
  assert.match(html, /property="og:title"/);
});

test('cache headers: revalidation with ETag', async () => {
  const first = await srv.get('/es/');
  assert.equal(first.headers.get('cache-control'), 'no-cache');
  const etag = first.headers.get('etag');
  assert.ok(etag);
  const second = await rawGet(srv.base, '/es/', { 'if-none-match': etag });
  assert.equal(second.status, 304);
});
