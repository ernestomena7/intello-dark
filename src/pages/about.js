// About: only facts the client has confirmed (what Intello does, how an engagement works, who it serves).
import { html, React } from '../render/html.js';
import { DarkBand, Frame } from '../render/frame.js';
import { imageProps } from '../render/image.js';

export const key = 'about';

export function render(ctx) {
  const { ds, lang, common, structure } = ctx;
  const c = ctx.content('about');
  const slot = (name) => structure.imageSlots[name];

  const body = html`<${React.Fragment}>
    ${DarkBand(html`<${ds.PageHero}
      eyebrow=${c.header.eyebrow}
      title=${c.header.title}
      titleAccent=${c.header.titleAccent}
      lede=${c.header.lede}
      media=${imageProps(lang, slot('about.1'), { sizes: '(min-width: 900px) 50vw, 100vw', icon: 'warehouse' })} />`)}
    <${ds.Section} tone="card">
      <div className="itl-duo">
        <div className="itl-stack">
          <${ds.SectionHeader} title=${c.story.title} />
          ${c.story.body.map((p, i) => html`<p key=${i} className="itl-body">${p}</p>`)}
          <h3 className="itl-service-title">${c.clients.title}</h3>
          <ul className="itl-checklist">
            ${c.clients.items.map((item, i) => html`<li key=${i}><${ds.Icon} name="check" size=${18} strokeWidth=${2} /><span>${item}</span></li>`)}
          </ul>
        </div>
        <${ds.ImageTile} ...${imageProps(lang, slot('about.2'), { sizes: '(min-width: 900px) 40vw, 100vw', ratio: '4 / 3', icon: 'plane' })} />
      </div>
    <//>
    <${ds.Section} tone="card">
      <div className="itl-stack">
        <${ds.SectionHeader} title=${c.approach.title} />
        <${ds.Steps} items=${c.approach.steps} />
      </div>
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
