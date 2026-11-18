// Loads and exposes the versioned content: per-language JSON plus the language-neutral files.
// Nothing user-facing lives in code (constitution VII).
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR } from '../paths.js';
import { LANGUAGES } from './locales.js';

let cache = null;

function readJson(file) {
  const full = path.join(CONTENT_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (err) {
    throw new Error(`Content file ${file} is missing or is not valid JSON (${err.message})`);
  }
}

export function loadContent({ fresh = false } = {}) {
  if (cache && !fresh) return cache;
  const perLanguage = {};
  for (const lang of LANGUAGES) {
    perLanguage[lang] = {};
    const dir = path.join(CONTENT_DIR, lang);
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.json')) perLanguage[lang][file.slice(0, -5)] = readJson(`${lang}/${file}`);
    }
  }
  cache = {
    perLanguage,
    structure: readJson('structure.json'),
    site: readJson('site.json'),
    images: readJson('images.json'),
    email: readJson('email.json'),
  };
  return cache;
}

export function getContent(lang, file) {
  const doc = loadContent().perLanguage[lang]?.[file];
  if (!doc) throw new Error(`Missing content: ${lang}/${file}.json`);
  return doc;
}
export const structure = () => loadContent().structure;
export const site = () => loadContent().site;
export const imageRegistry = () => loadContent().images;
export const emailLabels = () => loadContent().email;
export const image = (id) => {
  const entry = loadContent().images[id];
  if (!entry) throw new Error(`Unknown image id "${id}"`);
  return entry;
};
