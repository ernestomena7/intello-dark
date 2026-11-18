// FAQ: native details/summary, operable by keyboard with no script, all answers present in the HTML.
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'faq';

export function render(ctx) {
  const { ds, common } = ctx;
  const c = ctx.content('faq');

  const body = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero} eyebrow=${c.header.eyebrow} title=${c.header.title} titleAccent=${c.header.titleAccent} lede=${c.header.lede} />`)}
    <${ds.Section} tone="card"><${ds.Accordion} items=${c.items} /><//>
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
