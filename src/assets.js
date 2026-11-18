// Content-hashed URLs for CSS served from this site, and the sanitised design system stylesheet.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { PUBLIC_DIR, DS_DIR } from './paths.js';

const hashes = new Map();
export function fileHash(file) {
  if (hashes.has(file)) return hashes.get(file);
  const h = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  hashes.set(file, h);
  return h;
}

// The design system file stays untouched; the server drops its Google Fonts @import (Principles IV and V).
export function sanitizedBundleCss() {
  const raw = fs.readFileSync(path.join(DS_DIR, 'components', 'bundle.css'), 'utf8');
  // The URL itself contains semicolons, so remove the whole line rather than up to the first ";".
  return raw.replace(/^@import[^\r\n]*googleapis[^\r\n]*\r?\n?/gm, '');
}
let bundleCache = null;
export function bundleCss() {
  if (!bundleCache) {
    const css = sanitizedBundleCss();
    bundleCache = { css, hash: crypto.createHash('sha256').update(css).digest('hex').slice(0, 10) };
  }
  return bundleCache;
}

export function stylesheetUrls() {
  return {
    fonts: `/css/fonts.css?v=${fileHash(path.join(PUBLIC_DIR, 'css', 'fonts.css'))}`,
    tokens: `/ds/tokens.css?v=${fileHash(path.join(DS_DIR, 'tokens.css'))}`,
    bundle: `/ds/bundle.css?v=${bundleCss().hash}`,
  };
}

// Versioned URL for a file under public/ (for example /img/hero-main-960.webp).
export function publicUrl(urlPath) {
  const file = path.join(PUBLIC_DIR, urlPath);
  return fs.existsSync(file) ? `${urlPath}?v=${fileHash(file)}` : urlPath;
}
