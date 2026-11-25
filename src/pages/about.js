// About (BPO redesign): who Intello is, its purpose and motto, the S.H.O.W. values, the Success Team culture,
// who it works with and where it is growing. Source: Intello, "Cultura y capacidades" (Nov 2026), pages 02 to 05 and 11.
// No team photos, sizes or offices are shown (strategy guide, section 6.6).
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';

export const key = 'about';

export function render(ctx) {
  const { ds, common } = ctx;
  const c = ctx.content('about');

  const essence = html`<${ds.Section} tone="card" className="itl-about-block">
    <${ds.SectionHeader} eyebrow=${c.essence.eyebrow} title=${c.essence.title} accent=${c.essence.titleAccent} lede=${c.essence.lede} />
    <div className="itl-essence">
      <${ds.Statement} tone="blue" quoteLang="en" kicker=${c.essence.purpose.kicker} quote=${c.essence.purpose.quote} text=${c.essence.purpose.text} />
      <${ds.Statement} tone="yellow" quoteLang="en" kicker=${c.essence.motto.kicker} quote=${c.essence.motto.quote} text=${c.essence.motto.text} />
    </div>
    <div className="itl-essence-success">
      <h3 className="itl-subhead">${c.essence.successTitle}</h3>
      <${ds.TagList} items=${c.essence.success} />
    </div>
  <//>`;

  const values = html`<${ds.Section} tone="navy" className="itl-about-block">
    <${ds.SectionHeader} eyebrow=${c.values.eyebrow} title=${c.values.title} accent=${c.values.titleAccent} lede=${c.values.lede} />
    <${ds.LetterGrid} howLabel=${c.values.howLabel} items=${c.values.items} />
  <//>`;

  const culture = html`<${ds.Section} tone="card" className="itl-about-block">
    <${ds.SectionHeader} eyebrow=${c.culture.eyebrow} title=${c.culture.title} accent=${c.culture.titleAccent} lede=${c.culture.lede} />
    <${ds.InfoGrid} variant="card" columns=${3} items=${c.culture.items} />
    <${ds.InfoGrid} variant="card" columns=${1} className="itl-about-community" items=${[c.culture.community]} />
  <//>`;

  const direction = html`<${ds.Section} tone="card" className="itl-about-block">
    <${ds.SectionHeader} eyebrow=${c.clients.eyebrow} title=${c.clients.title} accent=${c.clients.titleAccent} />
    <${ds.TagList} tone="accent" className="itl-about-clients" items=${c.clients.items} />
    <hr className="itl-section-divider" />
    <${ds.SectionHeader} eyebrow=${c.direction.eyebrow} title=${c.direction.title} accent=${c.direction.titleAccent} lede=${c.direction.lede} />
    <${ds.InfoGrid} variant="rule" columns=${3}
      items=${c.direction.items.map((it, i) => (i === c.direction.items.length - 1 ? { ...it, badge: c.direction.badge } : it))} />
  <//>`;

  const body = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero} eyebrow=${c.header.eyebrow} title=${c.header.title} titleAccent=${c.header.titleAccent} lede=${c.header.lede} />`)}
    ${essence}${values}${culture}${direction}
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
