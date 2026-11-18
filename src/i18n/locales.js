// Supported languages, page map and localised URLs (contracts/http-routes.md).
export const LANGUAGES = ['es', 'en'];
export const DEFAULT_LANGUAGE = 'es';
export const LANGUAGE_NAMES = { es: 'Español', en: 'English' };
export const LANGUAGE_CODES = { es: 'ES', en: 'EN' };
export const HTML_LOCALES = { es: 'es_LA', en: 'en_US' };

// key -> slug per language. The home page has the empty slug.
export const PAGES = {
  home: { es: '', en: '' },
  services: { es: 'servicios', en: 'services' },
  about: { es: 'nosotros', en: 'about' },
  technology: { es: 'tecnologia', en: 'technology' },
  faq: { es: 'preguntas', en: 'faq' },
  contact: { es: 'contacto', en: 'contact' },
  privacy: { es: 'privacidad', en: 'privacy' },
};
export const PAGE_KEYS = Object.keys(PAGES);

export function isLanguage(value) {
  return LANGUAGES.includes(value);
}

export function pathFor(key, lang) {
  const slug = PAGES[key]?.[lang];
  if (slug === undefined) throw new Error(`Unknown page "${key}" or language "${lang}"`);
  return slug === '' ? `/${lang}/` : `/${lang}/${slug}`;
}

// The same page in the other language (used by the language toggle, hreflang and the sitemap).
export function equivalentPath(key, lang) {
  return pathFor(key, lang);
}

// '/es/servicios' -> { lang: 'es', key: 'services' }; unknown paths -> null.
export function pageForPath(pathname) {
  const m = /^\/(es|en)(?:\/([^/]*))?\/?$/.exec(pathname);
  if (!m) return null;
  const lang = m[1];
  const slug = m[2] ?? '';
  const key = PAGE_KEYS.find((k) => PAGES[k][lang] === slug);
  return key ? { lang, key } : null;
}

// '/es/xyz' -> 'es'; '/x' -> null.
export function languageOfPath(pathname) {
  const m = /^\/(es|en)(?:\/|$)/.exec(pathname);
  return m ? m[1] : null;
}
