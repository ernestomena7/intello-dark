// Proves every design system component renders on the server with no browser (constitution: SSR).
// One row per component; additions to the design system add a row here (tasks T011-T030).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDesignSystem, renderToHtml, React, REQUIRED_COMPONENTS } from '../../src/ds/load.js';

const h = React.createElement;
const DS = loadDesignSystem();
const render = (name, props, ...children) => renderToHtml(h(DS[name], props, ...children));

const LANGS = [
  { code: 'es', label: 'ES', name: 'Español', href: '/es/', rel: 'nofollow' },
  { code: 'en', label: 'EN', name: 'English', href: '/en/', rel: 'nofollow' },
];
const IMG = { src: '/img/a-960.webp', alt: 'Almacén', ratio: '4 / 3', imageWidth: 960, imageHeight: 720 };

// name -> minimal valid props (and children where needed)
const MINIMAL = {
  Button: [{ href: '/x' }, 'Solicitar demo'],
  IconButton: [{ icon: 'arrow-right', label: 'Siguiente' }],
  TextLink: [{ href: '/x' }, 'Ver todos'],
  VideoLink: [{ href: '/x' }, 'Ver video'],
  Icon: [{ name: 'check' }],
  Logo: [{ layout: 'horizontal' }],
  Eyebrow: [{}, 'Servicios'],
  Headline: [{ accent: 'con inteligencia' }, 'Impulsamos tu logística'],
  NavBar: [{ links: [{ label: 'Inicio', href: '/es/', active: true }], language: { value: 'es', languages: LANGS }, menuLabel: 'Menú' }],
  LanguageToggle: [{ value: 'es', languages: LANGS }],
  Hero: [{ title: 'Título', lede: 'Texto' }],
  FeatureItem: [{ icon: 'check' }, 'Dato'],
  StatChip: [{ value: '24/7', label: 'monitoreo' }],
  Section: [{}, 'contenido'],
  SectionHeader: [{ title: 'Servicios' }],
  ImageTile: [IMG],
  ServiceCard: [{ title: 'Rastreo', bullets: ['a', 'b'], href: '/x' }],
  StatusBadge: [{ status: 'transit' }],
  TrackingCard: [{ id: 'ITL-1', from: 'A', to: 'B' }],
  AboutBlock: [{ title: 'Nosotros' }],
  SkipLink: [{}, 'Saltar al contenido'],
  Footer: [{ columns: [{ heading: 'Sitio', links: [{ label: 'Inicio', href: '/es/' }] }], contact: { heading: 'Contacto', phone: '+503 0000-0000' }, tagline: 'Tagline', language: { value: 'es', languages: LANGS }, legal: { text: '© Intello', links: [{ label: 'Privacidad', href: '/es/privacidad' }] } }],
  CtaBand: [{ title: 'Hablemos', titleAccent: 'hoy', body: 'Cuéntanos', cta: { label: 'Solicitar demo', href: '/es/contacto' } }],
  PageHero: [{ title: 'Servicios', lede: 'Texto', media: { alt: 'Foto' } }],
  ServiceSection: [{ id: 'rastreo', title: 'Rastreo', summary: 'Resumen', deliverables: ['a', 'b'], cta: { label: 'Hablar', href: '/x' }, image: { alt: 'Foto' } }],
  Steps: [{ items: [{ title: 'Uno', body: 'a' }, { title: 'Dos', body: 'b' }] }],
  Accordion: [{ items: [{ id: 'q1', question: '¿Qué?', answer: ['Uno', 'Dos'] }] }],
  Prose: [{}, h('p', null, 'texto')],
  Field: [{ id: 'name', label: 'Nombre' }, h(DS.TextInput, { name: 'name' })],
  TextInput: [{ id: 'n', name: 'n' }],
  Textarea: [{ id: 'm', name: 'm' }],
  Select: [{ id: 's', name: 's', options: [{ value: 'a', label: 'A' }] }],
  FormNotice: [{ variant: 'success', title: 'Enviado' }, 'Gracias'],
  FormErrorSummary: [{ title: 'Revisa', errors: [{ id: 'name', message: 'Falta' }] }],
  Honeypot: [{ name: 'website' }],
};

test('every required component has a render row', () => {
  assert.deepEqual(REQUIRED_COMPONENTS.filter((n) => !MINIMAL[n]), []);
});

for (const [name, [props, ...children]] of Object.entries(MINIMAL)) {
  test(`${name} renders on the server`, () => {
    const html = render(name, props, ...children);
    assert.ok(html.length > 0, 'empty output');
    assert.doesNotMatch(html, /style="[^"]*#[0-9a-f]{3,8}/i, 'inline style holds a hard-coded colour');
    assert.doesNotMatch(html, /<script/i);
  });
}

test('NavBar renders a native details menu with an accessible summary and no script', () => {
  const html = render('NavBar', ...MINIMAL.NavBar);
  assert.match(html, /<details class="itl-nav-menu"/);
  assert.match(html, /<summary class="itl-nav-menu-btn">[\s\S]*?Menú/);
  assert.doesNotMatch(html, /<details[^>]*\sopen/);
});

test('ImageTile emits dimensions, lazy loading and responsive files; priority makes it eager', () => {
  const lazy = render('ImageTile', { ...IMG, srcSet: '/img/a-480.webp 480w, /img/a-960.webp 960w', sizes: '100vw' });
  assert.match(lazy, /width="960"/);
  assert.match(lazy, /height="720"/);
  assert.match(lazy, /loading="lazy"/);
  assert.match(lazy, /decoding="async"/);
  assert.match(lazy, /srcSet="[^"]*480w|srcset="[^"]*480w/i);
  const eager = render('ImageTile', { ...IMG, priority: true });
  assert.match(eager, /loading="eager"/);
  assert.match(eager, /fetchpriority="high"/);
  assert.doesNotMatch(eager, /decoding=/);
});

test('ImageTile without src still renders the art-direction slot', () => {
  const html = render('ImageTile', { alt: 'Foto: bodega' });
  assert.match(html, /itl-tile-empty/);
  assert.doesNotMatch(html, /<img/);
});

test('LanguageToggle link mode renders real links with hreflang and rel', () => {
  const html = render('LanguageToggle', { value: 'es', languages: LANGS });
  assert.match(html, /<a [^>]*href="\/en\/"[^>]*rel="nofollow"/);
  assert.match(html, /aria-current="true"/);
  assert.doesNotMatch(html, /<button/);
  // WCAG 2.5.3: the accessible name starts with the native name and contains the visible code as a word.
  assert.match(html, /aria-label="Español, ES"/);
  assert.match(html, /aria-label="English, EN"/);
});

test('Accordion uses native details and keeps answers in the HTML', () => {
  const html = render('Accordion', ...MINIMAL.Accordion);
  assert.match(html, /<details[^>]*id="q1"/);
  assert.match(html, /<summary/);
  assert.match(html, /Uno[\s\S]*Dos/);
});

test('Field wires the label, hint, error, aria-describedby and aria-invalid', () => {
  const html = renderToHtml(h(DS.Field, { id: 'email', label: 'Correo', hint: 'Ayuda', error: 'Falta', required: true }, h(DS.TextInput, { name: 'email', type: 'email' })));
  assert.match(html, /<label[^>]*for="email"/);
  assert.match(html, /id="email"/);
  assert.match(html, /aria-describedby="email-hint email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /required=""/);
  assert.match(html, /id="email-error"/);
});

test('Select renders the selected option and Textarea the initial value without a client script', () => {
  const sel = renderToHtml(h(DS.Select, { id: 's', name: 's', value: 'b', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }));
  assert.match(sel, /<option value="b" selected=""/);
  const area = renderToHtml(h(DS.Textarea, { id: 'm', name: 'm', value: 'hola' }));
  assert.match(area, /<textarea[^>]*>hola<\/textarea>/);
});

test('FormErrorSummary announces errors, links to fields and renders nothing when empty', () => {
  const html = render('FormErrorSummary', ...MINIMAL.FormErrorSummary);
  assert.match(html, /role="alert"/);
  assert.match(html, /href="#name"/);
  assert.equal(render('FormErrorSummary', { title: 'x', errors: [] }), '');
});

test('FormNotice pairs colour with an icon and a title, and picks a live-region role', () => {
  const ok = render('FormNotice', { variant: 'success', title: 'Enviado' }, 'Gracias');
  assert.match(ok, /role="status"/);
  assert.match(ok, /<svg/);
  assert.match(ok, /Enviado/);
  assert.match(render('FormNotice', { variant: 'error', title: 'Falló' }), /role="alert"/);
});

test('Honeypot is hidden from assistive technology and the keyboard but present in the DOM', () => {
  const html = render('Honeypot', { name: 'website' });
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /autoComplete="off"|autocomplete="off"/i);
  assert.match(html, /name="website"/);
});

test('Hero layers the shipment card and chip over a supplied photograph', () => {
  const html = render('Hero', {
    title: 'T', media: h(DS.ImageTile, { ...IMG, ratio: 'auto', height: '100%', priority: true }),
    tracking: { id: 'ITL-1', from: 'A', to: 'B' }, stat: { value: '24/7', label: 'monitoreo' },
  });
  assert.match(html, /itl-hero-image/);
  assert.match(html, /itl-track/);
  assert.match(html, /itl-statchip/);
});

test('ServiceSection uses its id as the anchor and labels itself', () => {
  const html = render('ServiceSection', ...MINIMAL.ServiceSection);
  assert.match(html, /<section[^>]*id="rastreo"/);
  assert.match(html, /aria-labelledby="rastreo-title"/);
  assert.match(html, /<h2[^>]*id="rastreo-title"/);
});
