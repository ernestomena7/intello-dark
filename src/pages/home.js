// Home (numbers-first BPO redesign): map hero with headline figures, the processes Intello runs, the Control Tower
// phases, reach in figures, process intelligence, brand promises, the team's values and the closing call to action.
// Every figure comes from the client's institutional document (Intello, "Cultura y capacidades", Nov 2026).
import fs from 'node:fs';
import path from 'node:path';
import { html, React } from '../render/html.js';
import { Frame } from '../render/frame.js';
import { CONTENT_DIR } from '../paths.js';

export const key = 'home';

const ROUTE_MAP = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'route-map.json'), 'utf8'));

export function render(ctx) {
  const { ds, common } = ctx;
  const c = ctx.content('home');

  const map = html`<${ds.RouteMap}
    id="itl-route-map"
    priority=${true}
    land=${ROUTE_MAP.land}
    viewBox=${ROUTE_MAP.viewBox}
    width=${ROUTE_MAP.width}
    height=${ROUTE_MAP.height}
    hubs=${ROUTE_MAP.hubs}
    routes=${ROUTE_MAP.routes}
    labels=${c.map.labels}
    cards=${c.map.cards}
    cardSeconds=${4}
    title=${c.map.title} />`;

  const hero = html`<${ds.MapHero}
    eyebrow=${c.hero.eyebrow}
    title=${c.hero.title}
    titleAccent=${c.hero.titleAccent}
    lede=${c.hero.lede}
    cta=${{ label: c.hero.cta.label, href: ctx.url('contact') }}
    secondary=${{ label: c.hero.secondary.label, href: '#procesos' }}
    stats=${c.hero.stats}
    legend=${['o', 'd', 'b'].map((kind) => ({ kind, label: c.map.legend[kind] }))}
    note=${c.map.caption}
    badge=${c.hero.badge}
    map=${map} />`;

  const processes = html`<${ds.Section} tone="card" id="procesos" className="itl-home-block">
    <${ds.SectionHeader} eyebrow=${c.processes.eyebrow} title=${c.processes.title} accent=${c.processes.titleAccent} lede=${c.processes.lede} />
    <${ds.ProcessList} items=${c.processes.items} />
  <//>`;

  const tower = html`<${ds.Section} tone="navy" id="torre-de-control" className="itl-home-block itl-home-tower">
    <${ds.SectionHeader} eyebrow=${c.tower.eyebrow} title=${c.tower.title} accent=${c.tower.titleAccent} lede=${c.tower.lede} />
    <${ds.PhaseTrack} items=${c.tower.phases} />
    <ul className="itl-method" role="list">
      ${c.tower.method.map((m) => html`<li key=${m.title} className="itl-method-item"><h3 className="itl-method-title">${m.title}</h3><p className="itl-body">${m.text}</p></li>`)}
    </ul>
  <//>`;

  const reach = html`<${ds.Section} tone="card" id="alcance" className="itl-home-block">
    <${ds.SectionHeader} eyebrow=${c.reach.eyebrow} title=${c.reach.title} accent=${c.reach.titleAccent} lede=${c.reach.lede} />
    <${ds.StatGrid} items=${c.reach.stats} variant="rule" />
    <div className="itl-reach-lists">
      <div>
        <h3 className="itl-subhead">${c.reach.originsTitle}</h3>
        <${ds.BarList} items=${c.reach.origins.map((o) => ({ ...o, display: `${o.value}%` }))} />
      </div>
      <div>
        <h3 className="itl-subhead">${c.reach.destinationsTitle}</h3>
        <${ds.TagList} items=${c.reach.destinations} tone="accent" />
      </div>
    </div>
    <p className="itl-source-note">${c.reach.note}</p>
  <//>`;

  const intelligence = html`<${ds.Section} tone="card" id="inteligencia" className="itl-home-block">
    <${ds.SectionHeader} eyebrow=${c.intelligence.eyebrow} title=${c.intelligence.title} accent=${c.intelligence.titleAccent} lede=${c.intelligence.lede} />
    <div className="itl-intel">
      <${ds.StatGrid} items=${[c.intelligence.figure]} variant="feature" columns=${1} />
      <${ds.Steps} items=${c.intelligence.steps} />
    </div>
  <//>`;

  const promises = html`<${ds.Section} tone="card" id="promesas" className="itl-home-block">
    <${ds.SectionHeader} eyebrow=${c.promises.eyebrow} title=${c.promises.title} accent=${c.promises.titleAccent} />
    <${ds.StatGrid} items=${c.promises.items} variant="card" />
  <//>`;

  const culture = html`<${ds.Section} tone="navy" id="cultura" className="itl-home-block itl-home-culture">
    <${ds.SectionHeader} eyebrow=${c.culture.eyebrow} title=${c.culture.title} accent=${c.culture.titleAccent} lede=${c.culture.lede}
      action=${{ label: c.culture.action.label, href: ctx.url('about') }} />
    <${ds.LetterGrid} items=${c.culture.values} />
  <//>`;

  const band = html`<${ds.CtaBand}
    eyebrow=${common.ctaBand.eyebrow}
    title=${common.ctaBand.title}
    titleAccent=${common.ctaBand.titleAccent}
    body=${common.ctaBand.body}
    cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />`;

  return {
    meta: c.meta,
    body: Frame(ctx, html`<${React.Fragment}>${hero}${processes}${tower}${reach}${intelligence}${promises}${culture}${band}<//>`, { overlayNav: true }),
  };
}
