// Language-prefixed page routes: complete server-rendered HTML in the language named by the URL.
import crypto from 'node:crypto';
import express from 'express';
import { pages } from '../pages/index.js';
import { LANGUAGES, PAGES, pathFor } from '../i18n/locales.js';
import { setLanguageCookie } from '../i18n/negotiate.js';
import { makeContext } from '../render/context.js';
import { renderDocument } from '../render/html.js';

export function renderPage(config, key, lang, req) {
  const def = pages.get(key);
  const ctx = makeContext(config, lang, key, req);
  const result = def.render(ctx);
  return renderDocument({ config, lang, pageKey: key, result });
}

export function pagesRouter(config) {
  const router = express.Router({ strict: true });
  const cache = new Map(); // `${lang}:${key}` -> { html, etag }

  // /es and /en -> /es/ and /en/
  router.get(/^\/(es|en)$/, (req, res) => {
    res.redirect(301, `/${req.params[0]}/${queryOf(req)}`);
  });
  // Trailing slash on inner pages -> canonical URL without it.
  router.get(/^\/(es|en)\/(.+)\/$/, (req, res) => {
    res.redirect(301, `/${req.params[0]}/${req.params[1]}${queryOf(req)}`);
  });

  for (const [key, def] of pages) {
    if (!PAGES[key]) continue;
    for (const lang of LANGUAGES) {
      router.get(pathFor(key, lang), (req, res) => {
        // The language toggle's links carry the flag; a URL without it never changes the saved choice.
        if (req.query.setlang === '1') setLanguageCookie(res, lang, config);
        res.set('Content-Language', lang);

        if (def.cache === false) {
          res.set('Cache-Control', 'no-store').type('html').send(renderPage(config, key, lang, req));
          return;
        }
        const id = `${lang}:${key}`;
        let entry = cache.get(id);
        if (!entry) {
          const body = renderPage(config, key, lang, req);
          entry = { html: body, etag: `"${crypto.createHash('sha1').update(body).digest('base64url')}"` };
          cache.set(id, entry);
        }
        res.set({ 'Cache-Control': 'no-cache', ETag: entry.etag });
        if (req.fresh) { res.status(304).end(); return; }
        res.type('html').send(entry.html);
      });
    }
  }
  return router;
}

function queryOf(req) {
  const i = req.originalUrl.indexOf('?');
  return i < 0 ? '' : req.originalUrl.slice(i);
}
