// Builds the Express app. Middleware order matters: log, security headers, static files, routes, 404, errors.
import crypto from 'node:crypto';
import express from 'express';
import compression from 'compression';
import { PUBLIC_DIR } from './paths.js';
import { setLogLevel, log } from './log.js';
import { securityHeaders } from './security/headers.js';
import { dsAssets } from './ds/assets.js';
import { loadContent } from './i18n/content.js';
import { loadDesignSystem } from './ds/load.js';
import { entryRouter } from './routes/entry.js';
import { seoRouter } from './routes/seo.js';
import { pagesRouter } from './routes/pages.js';
import { notFoundHandler, errorHandler } from './routes/errors.js';
import { extraRoutes } from './routes/extra.js';

// opts.extra(app): lets tests add routes before the 404 and error handlers.
export function createApp(config, opts = {}) {
  setLogLevel(config.logLevel);
  // Fail at start-up, not on the first request, if content or the design system is broken.
  loadContent();
  loadDesignSystem();

  const app = express();
  app.disable('x-powered-by');
  app.set('etag', false); // page ETags are computed by the page router; the contact page must have none
  app.set('strict routing', true);
  app.set('trust proxy', config.trustProxy);

  // Request id and one JSON line per request (path only: query strings can carry personal data).
  app.use((req, res, next) => {
    req.id = crypto.randomUUID().slice(0, 8);
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      log('request', { requestId: req.id, method: req.method, path: req.path, status: res.statusCode, ms: Math.round(Number(process.hrtime.bigint() - start) / 1e6) });
    });
    next();
  });

  app.use(compression()); // gzip/deflate for HTML, CSS and SVG; the host may or may not compress (hosting spike S6)
  app.use(securityHeaders(config));

  // Files under public/: hashed (?v=) URLs are cached for a year, everything else for a day.
  app.use((req, res, next) => {
    res.set('Cache-Control', req.query.v ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
    next();
  });
  app.use(express.static(PUBLIC_DIR, { index: false, dotfiles: 'ignore' }));
  app.use((req, res, next) => { res.removeHeader('Cache-Control'); next(); });

  app.use('/ds', dsAssets());
  app.use(seoRouter(config));
  app.use(entryRouter());
  extraRoutes(app, config, opts);
  app.use(pagesRouter(config));
  if (opts.extra) opts.extra(app);

  app.use(notFoundHandler(config));
  app.use(errorHandler(config));
  return app;
}
