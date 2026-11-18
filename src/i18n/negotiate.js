// Language choice for unprefixed URLs: saved cookie, then the browser's Accept-Language, then Spanish.
import { LANGUAGES, DEFAULT_LANGUAGE, isLanguage } from './locales.js';

export const LANGUAGE_COOKIE = 'itl_lang';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

export function savedLanguage(req) {
  const value = readCookie(req, LANGUAGE_COOKIE);
  return isLanguage(value) ? value : null;
}

// English only when it is the best supported match; Spanish when best, missing, or only unsupported languages.
export function browserLanguage(req) {
  const best = req.acceptsLanguages(...LANGUAGES);
  return isLanguage(best) ? best : DEFAULT_LANGUAGE;
}

export function chooseLanguage(req) {
  return savedLanguage(req) ?? browserLanguage(req);
}

export function setLanguageCookie(res, lang, config) {
  res.cookie(LANGUAGE_COOKIE, lang, {
    maxAge: ONE_YEAR_MS,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: Boolean(config?.isProduction),
  });
}
