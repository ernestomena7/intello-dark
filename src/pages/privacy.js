import { html, React } from '../render/html.js';
import { Frame } from '../render/frame.js';
import { formatDate } from '../i18n/format.js';

export const key = 'privacy';

export function render(ctx) {
  const { ds, lang, common } = ctx;
  const c = ctx.content('privacy');
  const sections = c.sections.map((s, i) => html`<${React.Fragment} key=${i}>
    <h2>${s.heading}</h2>
    ${s.body.map((p, j) => html`<p key=${j}>${p}</p>`)}
  <//>`);

  const body = html`<${React.Fragment}>
    <${ds.PageHero} eyebrow=${c.header.eyebrow} title=${c.header.title} titleAccent=${c.header.titleAccent} lede=${c.header.lede} />
    <${ds.Section} tone="card">
      <${ds.Prose}>
        <p><strong>${c.updatedLabel}:</strong> <time dateTime=${c.updated}>${formatDate(lang, c.updated)}</time></p>
        ${sections}
      <//>
    <//>
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
