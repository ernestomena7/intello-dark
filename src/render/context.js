// Per-request rendering context handed to every page.
import { loadDesignSystem } from '../ds/load.js';
import { getContent, site, structure } from '../i18n/content.js';
import { pathFor } from '../i18n/locales.js';

export function makeContext(config, lang, pageKey, req = null) {
  return {
    config,
    lang,
    pageKey,
    req,
    ds: loadDesignSystem(),
    common: getContent(lang, 'common'),
    site: site(),
    structure: structure(),
    content: (file) => getContent(lang, file),
    url: (key, query = '') => pathFor(key, lang) + query,
    query: req?.query ?? {},
  };
}
