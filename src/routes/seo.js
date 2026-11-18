// /healthz, /robots.txt and /sitemap.xml.
import express from 'express';
import { pages } from '../pages/index.js';
import { LANGUAGES, DEFAULT_LANGUAGE, PAGES, pathFor } from '../i18n/locales.js';

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function seoRouter(config) {
  const router = express.Router();

  router.get('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-store').json({ status: 'ok' });
  });

  router.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
  });

  router.get('/sitemap.xml', (req, res) => {
    const urls = [];
    for (const key of pages.keys()) {
      if (!PAGES[key]) continue;
      for (const lang of LANGUAGES) {
        const alternates = [
          ...LANGUAGES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xml(config.siteUrl + pathFor(key, l))}"/>`),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(config.siteUrl + pathFor(key, DEFAULT_LANGUAGE))}"/>`,
        ].join('\n');
        urls.push(`  <url>\n    <loc>${xml(config.siteUrl + pathFor(key, lang))}</loc>\n${alternates}\n  </url>`);
      }
    }
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
  });

  return router;
}
