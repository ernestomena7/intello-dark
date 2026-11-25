// FAQ (BPO redesign): questions grouped by what buyers ask (strategy guide 4.2), with a topic index.
// Native details/summary, operable by keyboard with no script, every answer present in the HTML.
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'faq';

export function render(ctx) {
  const { ds, common } = ctx;
  const c = ctx.content('faq');
  const anchor = (g) => `faq-${g.id}`;

  const index = html`<nav className="itl-faq-index" aria-label=${c.header.eyebrow}>
    <ol role="list">
      ${c.groups.map((g, i) => html`<li key=${g.id}><a href=${`#${anchor(g)}`}><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${g.title}</a></li>`)}
    </ol>
  </nav>`;

  const groups = c.groups.map((g) => html`<section key=${g.id} id=${anchor(g)} className="itl-faq-group" aria-labelledby=${`${anchor(g)}-title`}>
    <h2 id=${`${anchor(g)}-title`} className="itl-faq-title">${g.title}</h2>
    <${ds.Accordion} items=${c.items.filter((it) => it.group === g.id)} />
  </section>`);

  const body = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero} eyebrow=${c.header.eyebrow} title=${c.header.title} titleAccent=${c.header.titleAccent} lede=${c.header.lede} />`)}
    <${ds.Section} tone="card">
      <div className="itl-faq">${index}<div className="itl-faq-groups">${groups}</div></div>
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
