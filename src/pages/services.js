// Services (numbers-first BPO redesign): the three process families Intello runs, each with its figure, how it works
// and a call to action that pre-selects the contact topic; then the method and how an engagement starts.
// Content source: Intello, "Cultura y capacidades" (Nov 2026), pages 06, 07, 09 and 10.
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'services';

export function render(ctx) {
  const { ds, common, structure } = ctx;
  const c = ctx.content('services');
  const item = (id) => c.items.find((x) => x.id === id);
  const contact = (id) => ctx.url('contact', `?topic=${id}`);

  const index = html`<${ds.Section} tone="card" className="itl-svc-block">
    <${ds.SectionHeader} eyebrow=${c.index.eyebrow} title=${c.index.title} accent=${c.index.titleAccent} />
    <${ds.StatGrid} variant="rule" className="itl-svc-index" items=${structure.services.map((s) => {
      const t = item(s.id);
      return { title: t.title, href: `#${s.anchor}`, value: t.figure.value, unit: t.figure.unit, label: t.figure.label, text: t.indexText };
    })} />
  <//>`;

  // One section per process family; the body differs by family.
  const body = {
    tracking: (t) => html`<${ds.PhaseTrack} variant="grid" seeLabel=${t.seeLabel} items=${t.phases} />`,
    'back-office': (t) => html`<${ds.InfoGrid} variant="card" columns=${2} items=${t.services} />`,
    'ai-analytics': (t) => html`<div className="itl-svc-data">
      <div><h3 className="itl-subhead">${t.etlTitle}</h3><${ds.FactList} items=${t.etl} /></div>
      <${ds.InfoGrid} variant="rule" columns=${2} items=${t.capabilities} />
    </div>`,
  };

  const sections = structure.services.map((s) => {
    const t = item(s.id);
    const navy = s.id === 'ai-analytics';
    return html`<${ds.Section} key=${s.id} id=${s.anchor} tone=${navy ? 'navy' : 'card'} className="itl-svc-block itl-svc-family">
      <div className="itl-svc-head">
        <${ds.SectionHeader} eyebrow=${t.kicker} title=${t.title} accent=${t.titleAccent} lede=${t.summary} />
        <${ds.StatGrid} variant="rule" columns=${1} className="itl-svc-figure" items=${[t.figure]} />
      </div>
      ${body[s.id](t)}
      <div className="itl-svc-actions">
        <${ds.Button} variant=${navy ? 'accent' : 'primary'} href=${contact(s.id)}>${t.cta.label}<//>
      </div>
    <//>`;
  });

  const method = html`<${ds.Section} tone="card" id="metodo" className="itl-svc-block">
    <${ds.SectionHeader} eyebrow=${c.method.eyebrow} title=${c.method.title} accent=${c.method.titleAccent} />
    <${ds.InfoGrid} variant="rule" columns=${3} items=${c.method.items} />
  <//>`;

  const start = html`<${ds.Section} tone="card" className="itl-svc-block">
    <${ds.SectionHeader} eyebrow=${c.start.eyebrow} title=${c.start.title} accent=${c.start.titleAccent} />
    <${ds.Steps} items=${c.start.steps} />
  <//>`;

  const page = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero}
      eyebrow=${c.header.eyebrow}
      title=${c.header.title}
      titleAccent=${c.header.titleAccent}
      lede=${c.header.lede}
      cta=${{ label: c.header.cta.label, href: ctx.url('contact') }}
      secondary=${{ label: c.header.secondary.label, href: '#metodo' }} />`)}
    ${index}${sections}${method}${start}
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, page) };
}
