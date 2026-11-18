// Services: one section per service, each with deliverables and a call to action that pre-selects the topic.
import { html, React } from '../render/html.js';
import { Frame } from '../render/frame.js';
import { imageProps } from '../render/image.js';

export const key = 'services';

export function render(ctx) {
  const { ds, lang, common, structure } = ctx;
  const c = ctx.content('services');

  const sections = structure.services.flatMap((s, i) => {
    const text = c.items.find((x) => x.id === s.id);
    const section = html`<${ds.ServiceSection}
      key=${s.id}
      id=${s.anchor}
      title=${text.title}
      summary=${text.summary}
      deliverables=${text.deliverables}
      cta=${{ label: text.cta.label, href: ctx.url('contact', `?topic=${s.id}`) }}
      image=${imageProps(lang, s.sectionImage, { sizes: '(min-width: 900px) 45vw, 100vw', icon: s.icon })}
      reverse=${i % 2 === 1} />`;
    return i === 0 ? [section] : [html`<hr key=${`hr-${s.id}`} className="itl-section-divider" />`, section];
  });

  const body = html`<${React.Fragment}>
    <${ds.PageHero} eyebrow=${c.header.eyebrow} title=${c.header.title} titleAccent=${c.header.titleAccent} lede=${c.header.lede} />
    <${ds.Section} tone="card">${sections}<//>
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
