// Locale-aware formatting (spec FR-030). Phone numbers are stored in content/site.json already written in the
// convention the client uses; the dial link strips everything but digits and +.
const INTL_LOCALE = { es: 'es', en: 'en' };

export function formatDate(lang, isoDate) {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang] ?? 'es', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${isoDate}T00:00:00Z`));
}
