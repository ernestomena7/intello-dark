// 404 and 500 handling. Both render a branded page in the visitor's language; neither exposes technical detail.
import { notFound, error } from '../pages/index.js';
import { makeContext } from '../render/context.js';
import { renderDocument } from '../render/html.js';
import { languageOfPath } from '../i18n/locales.js';
import { chooseLanguage } from '../i18n/negotiate.js';
import { log } from '../log.js';

function languageFor(req) {
  return languageOfPath(req.path) ?? chooseLanguage(req);
}

export function renderErrorPage(config, req, module, status, extra = {}) {
  const lang = languageFor(req);
  const ctx = Object.assign(makeContext(config, lang, module.key, req), extra);
  return { lang, html: renderDocument({ config, lang, pageKey: module.key, result: module.render(ctx) }) };
}

export function notFoundHandler(config) {
  return (req, res) => {
    const { lang, html } = renderErrorPage(config, req, notFound, 404);
    res.status(404).set({ 'Content-Language': lang, 'Cache-Control': 'no-cache' }).type('html').send(html);
  };
}

export function errorHandler(config) {
  // Express recognises an error handler by its four parameters.
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    if (res.headersSent) return next(err);
    const tooLarge = err?.type === 'entity.too.large' || err?.status === 413;
    const status = tooLarge ? 413 : 500;
    log('error', { requestId: req.id, status, name: err?.name, code: err?.code, at: String(err?.stack || '').split('\n').slice(1, 5).map((s) => s.trim()) });
    try {
      const { lang, html } = renderErrorPage(config, req, error, status, { errorKind: tooLarge ? 'tooLarge' : 'server' });
      res.status(status).set({ 'Content-Language': lang, 'Cache-Control': 'no-store' }).type('html').send(html);
    } catch {
      res.status(status).type('text/plain').send(tooLarge ? 'Request too large' : 'Server error');
    }
  };
}
