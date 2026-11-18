import { html } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'error';

// ctx.errorKind: 'tooLarge' for an oversized submission, anything else is a generic server error.
export function render(ctx) {
  const { ds, lang, site } = ctx;
  const c = ctx.content('error');
  const tooLarge = ctx.errorKind === 'tooLarge';
  const heading = tooLarge ? c.tooLarge.title : c.title;
  const body = tooLarge ? c.tooLarge.body : c.body;
  return {
    meta: c.meta,
    indexable: false,
    body: Frame(ctx, html`
      ${DarkBand(html`<${ds.PageHero}
        title=${heading}
        titleAccent=${tooLarge ? undefined : c.titleAccent}
        lede=${`${body} ${c.phoneNote} ${site.phone}.`}
        cta=${{ label: c.home.label, href: `/${lang}/` }}
        secondary=${{ label: c.contact.label, href: ctx.url('contact') }} />`)}`),
  };
}
