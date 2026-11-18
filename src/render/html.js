// htm bound to React, plus the document shell (head metadata, hreflang, canonical, Open Graph).
// The output never contains a <script> or <style> element (CSP: script-src 'none').
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import htm from 'htm';
import { renderToStaticMarkup } from 'react-dom/server';
import { PUBLIC_DIR } from '../paths.js';
import { stylesheetUrls } from '../assets.js';
import { LANGUAGES, DEFAULT_LANGUAGE, HTML_LOCALES, PAGES, pathFor } from '../i18n/locales.js';

export const html = htm.bind(React.createElement);
export { React };
export const renderMarkup = (element) => renderToStaticMarkup(element);

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function shareImageUrl(config) {
  return fs.existsSync(path.join(PUBLIC_DIR, 'img', 'og.jpg')) ? `${config.siteUrl}/img/og.jpg` : null;
}

// result: { meta: {title, description}, body: React element, indexable?: boolean }
export function renderDocument({ config, lang, pageKey, result }) {
  const { meta, body } = result;
  const indexable = result.indexable !== false;
  const isPage = Boolean(PAGES[pageKey]);
  const canonicalPath = isPage ? pathFor(pageKey, lang) : null;
  const canonical = canonicalPath ? `${config.siteUrl}${canonicalPath}` : null;
  const css = stylesheetUrls();
  const og = shareImageUrl(config);

  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    indexable ? '' : '<meta name="robots" content="noindex">',
    canonical ? `<link rel="canonical" href="${esc(canonical)}">` : '',
    ...(isPage ? [
      ...LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(config.siteUrl + pathFor(pageKey, l))}">`),
      `<link rel="alternate" hreflang="x-default" href="${esc(config.siteUrl + pathFor(pageKey, DEFAULT_LANGUAGE))}">`,
    ] : []),
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Intello">',
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}">` : '',
    `<meta property="og:locale" content="${HTML_LOCALES[lang]}">`,
    ...LANGUAGES.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${HTML_LOCALES[l]}">`),
    og ? `<meta property="og:image" content="${esc(og)}">` : '',
    `<meta name="twitter:card" content="${og ? 'summary_large_image' : 'summary'}">`,
    '<meta name="theme-color" content="#2d2d45">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    // The two weights used by headlines and body start downloading early (the headline is the LCP element).
    ...["400-normal", "700-normal"].map((w) => `<link rel="preload" as="font" type="font/woff2" href="/fonts/montserrat-latin-${w}.woff2" crossorigin>`),
    `<link rel="stylesheet" href="${esc(css.fonts)}">`,
    `<link rel="stylesheet" href="${esc(css.tokens)}">`,
    `<link rel="stylesheet" href="${esc(css.bundle)}">`,
  ].filter(Boolean).join('\n');

  return `<!doctype html>\n<html lang="${lang}" data-theme="light">\n<head>\n${head}\n</head>\n<body>\n${renderMarkup(body)}\n</body>\n</html>\n`;
}
