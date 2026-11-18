// Serves only what a browser needs from the design system: tokens.css, a sanitised bundle.css and the logos and icons.
// bundle.js, previews, READMEs and the JSON manifests are never served.
import path from 'node:path';
import express from 'express';
import { DS_DIR } from '../paths.js';
import { bundleCss } from '../assets.js';

const LONG = 'public, max-age=31536000, immutable';
const SHORT = 'public, max-age=86400';

export function dsAssets() {
  const router = express.Router();
  const cacheFor = (req) => (req.query.v ? LONG : SHORT);

  router.get('/tokens.css', (req, res) => {
    res.set('Cache-Control', cacheFor(req)).type('text/css').sendFile(path.join(DS_DIR, 'tokens.css'));
  });
  router.get('/bundle.css', (req, res) => {
    res.set('Cache-Control', cacheFor(req)).type('text/css').send(bundleCss().css);
  });
  router.get(/^\/assets\/(Logos|Icons)\/([\w.-]+\.svg)$/, (req, res, next) => {
    const folder = req.params[0];
    const file = req.params[1];
    res.set('Cache-Control', SHORT).type('image/svg+xml').sendFile(path.join(DS_DIR, 'assets', folder, file), (err) => (err ? next() : undefined));
  });
  return router;
}
