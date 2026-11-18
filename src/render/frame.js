// Shared page frame, built only from design system components:
// skip link, navigation (with the link-mode language toggle), main landmark and footer.
import { html, React } from './html.js';
import { LANGUAGES, LANGUAGE_CODES, LANGUAGE_NAMES, PAGES, pathFor } from '../i18n/locales.js';

const F = React.Fragment;

export function telHref(phone) {
  return 'tel:' + String(phone).replace(/[^+\d]/g, '');
}

// Language toggle: real links to the equivalent page in each language. The flag asks the server to remember the choice.
export function languageProps(ctx) {
  const { lang, pageKey, common } = ctx;
  return {
    value: lang,
    label: common.language.ariaLabel,
    languages: LANGUAGES.map((code) => ({
      code,
      label: LANGUAGE_CODES[code],
      name: LANGUAGE_NAMES[code],
      href: (PAGES[pageKey] ? pathFor(pageKey, code) : `/${code}/`) + '?setlang=1',
      rel: 'nofollow',
    })),
  };
}

export function Frame(ctx, children) {
  const { ds, lang, pageKey, common, site } = ctx;
  const link = (key) => common.nav.links.find((l) => l.key === key);
  const navLinks = common.nav.links.map((l) => ({ label: l.label, href: pathFor(l.key, lang), active: l.key === pageKey }));
  const language = languageProps(ctx);
  const footerLink = (key) => ({ label: link(key).label, href: pathFor(key, lang) });
  const footer = common.footer;

  return html`<${F}>
    <${ds.SkipLink} href="#main">${common.skipLink}<//>
    <${ds.NavBar}
      links=${navLinks}
      homeHref=${pathFor('home', lang)}
      ariaLabel=${common.nav.ariaLabel}
      menuLabel=${common.nav.menuLabel}
      phone=${site.phone}
      hours=${site.hours[lang]}
      cta=${{ label: common.nav.cta.label, href: pathFor('contact', lang) }}
      language=${language} />
    <main id="main" className="itl-main" tabIndex=${-1}>${children}</main>
    <${ds.Footer}
      homeHref=${pathFor('home', lang)}
      tagline=${footer.tagline}
      language=${language}
      columns=${[
        { heading: footer.columnHeadings.site, links: ['home', 'services', 'about'].map(footerLink) },
        { heading: footer.columnHeadings.more, links: ['technology', 'faq', 'contact'].map(footerLink) },
      ]}
      contact=${{ heading: footer.contactHeading, phone: site.phone, phoneHref: telHref(site.phone), hours: site.hours[lang], address: site.address?.[lang] }}
      legal=${{ text: footer.legal, links: [{ label: footer.privacyLabel, href: pathFor('privacy', lang) }] }} />
  <//>`;
}
