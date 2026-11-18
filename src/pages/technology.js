// Technology: plain-language capabilities of the AI and data analysis (no mascots, no decoration).
import { html, React } from '../render/html.js';
import { Frame } from '../render/frame.js';
import { imageProps } from '../render/image.js';

export const key = 'technology';

export function render(ctx) {
  const { ds, lang, common, structure } = ctx;
  const c = ctx.content('technology');
  const slot = (name) => structure.imageSlots[name];

  const capabilities = c.capabilities.map((cap, i) => ({ ...cap, icon: structure.technologyIcons[i] }));

  const body = html`<${React.Fragment}>
    <${ds.PageHero}
      eyebrow=${c.header.eyebrow}
      title=${c.header.title}
      titleAccent=${c.header.titleAccent}
      lede=${c.header.lede}
      media=${imageProps(lang, slot('technology.1'), { sizes: '(min-width: 900px) 50vw, 100vw', icon: 'radar' })} />
    <${ds.Section} tone="card">
      <div className="itl-stack">
        <${ds.SectionHeader} title=${c.capabilitiesTitle} />
        <${ds.Steps} items=${capabilities} />
      </div>
    <//>
    <${ds.Section} tone="card">
      <div className="itl-duo">
        <div className="itl-stack">
          <${ds.SectionHeader} title=${c.how.title} />
          <${ds.Steps} items=${c.how.steps} />
        </div>
        <${ds.ImageTile} ...${imageProps(lang, slot('technology.2'), { sizes: '(min-width: 900px) 40vw, 100vw', ratio: '4 / 3', icon: 'database' })} />
      </div>
    <//>
    <${ds.CtaBand}
      eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
      titleAccent=${common.ctaBand.titleAccent}
      body=${common.ctaBand.body}
      cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact', '?topic=ai-analytics') }} />
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
