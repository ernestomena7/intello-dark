// Technology (BPO redesign): how Intello uses technology to run processes better, the process-intelligence loop,
// and how client data is handled. Sources: Intello, "Cultura y capacidades" (Nov 2026), pages 04 to 06, 09 and 10,
// and the client's draft site (trust section). SOC 2 Type II is shown as a goal, never as held.
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'technology';

export function render(ctx) {
  const { ds, common } = ctx;
  const c = ctx.content('technology');
  const topic = ctx.url('contact', '?topic=technology');

  const usage = html`<${ds.Section} tone="card" className="itl-tech-block">
    <${ds.SectionHeader} eyebrow=${c.usage.eyebrow} title=${c.usage.title} accent=${c.usage.titleAccent} lede=${c.usage.lede} />
    <${ds.InfoGrid} variant="rule" columns=${3} items=${c.usage.items} />
  <//>`;

  const pipeline = html`<${ds.Section} tone="card" className="itl-tech-block">
    <${ds.SectionHeader} eyebrow=${c.pipeline.eyebrow} title=${c.pipeline.title} accent=${c.pipeline.titleAccent} />
    <div className="itl-tech-pipeline"><${ds.Steps} items=${c.pipeline.steps} /></div>
  <//>`;

  const security = html`<${ds.Section} tone="navy" id="seguridad" className="itl-tech-block">
    <${ds.SectionHeader} eyebrow=${c.security.eyebrow} title=${c.security.title} accent=${c.security.titleAccent} lede=${c.security.lede} />
    <${ds.InfoGrid} variant="rule" columns=${3}
      items=${c.security.items.map((it, i) => (i === c.security.items.length - 1 ? { ...it, badge: c.security.badge } : it))} />
  <//>`;

  const body = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero}
      eyebrow=${c.header.eyebrow}
      title=${c.header.title}
      titleAccent=${c.header.titleAccent}
      lede=${c.header.lede}
      cta=${{ label: c.header.cta.label, href: topic }}
      secondary=${{ label: c.header.secondary.label, href: '#seguridad' }} />`)}
    ${usage}${pipeline}${security}
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: topic }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
