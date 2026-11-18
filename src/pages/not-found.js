import { html } from '../render/html.js';
import { Frame } from '../render/frame.js';

export const key = 'not-found';

export function render(ctx) {
  const { ds, lang } = ctx;
  const c = ctx.content('not-found');
  return {
    meta: c.meta,
    indexable: false,
    body: Frame(ctx, html`
      <${ds.PageHero}
        title=${c.title}
        titleAccent=${c.titleAccent}
        lede=${c.body}
        cta=${{ label: c.home.label, href: `/${lang}/` }}
        secondary=${{ label: c.contact.label, href: ctx.url('contact') }} />`),
  };
}
