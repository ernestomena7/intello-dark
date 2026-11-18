// Home: hero with a photograph, the overlapping white panel (about + four service cards) and the closing call to action.
import { html, React } from '../render/html.js';
import { Frame } from '../render/frame.js';
import { imageProps, cardImage } from '../render/image.js';

export const key = 'home';

export function render(ctx) {
  const { ds, lang, common, structure } = ctx;
  const c = ctx.content('home');
  const services = ctx.content('services').items;
  const slot = (name) => structure.imageSlots[name];

  const heroImage = imageProps(lang, slot('home.hero'), { priority: true, sizes: '100vw', ratio: 'auto', height: '100%', icon: 'route' });
  const features = c.hero.features.map((f, i) => ({ icon: structure.homeFeatureIcons[i], title: f.title, text: f.text }));
  const hero = html`<${ds.Hero}
    variant="immersive"
    eyebrow=${c.hero.eyebrow}
    title=${c.hero.title}
    titleAccent=${c.hero.titleAccent}
    lede=${c.hero.lede}
    cta=${{ label: c.hero.cta.label, href: ctx.url('contact') }}
    features=${features}
    media=${html`<${ds.ImageTile} ...${heroImage} />`}
    tracking=${{ ...c.tracking, label: c.tracking.heading, steps: c.tracking.steps.map((s) => ({ label: s.text, time: s.time, state: s.state })) }}
    stat=${{ ...c.stat, badges: ['radar', 'bot', 'chart-line'] }} />`;

  const cards = structure.services.map((s) => {
    const text = services.find((x) => x.id === s.id);
    return html`<${ds.ServiceCard}
      key=${s.id}
      variant="overlay"
      title=${text.title}
      bullets=${text.bullets}
      icon=${s.icon}
      image=${cardImage(lang, s.cardImage)}
      href=${`${ctx.url('services')}#${s.anchor}`} />`;
  });

  const panel = html`<${ds.Section} tone="card" overlap=${true}>
    <${ds.AboutBlock}
      eyebrow=${c.about.eyebrow}
      title=${c.about.title}
      titleAccent=${c.about.titleAccent}
      body=${c.about.body}
      note=${c.about.note}
      noteIcon="globe"
      imageA=${imageProps(lang, slot('home.aboutA'), { sizes: '(min-width: 900px) 25vw, 50vw', icon: 'warehouse' })}
      imageB=${imageProps(lang, slot('home.aboutB'), { sizes: '(min-width: 900px) 25vw, 50vw', icon: 'chart-line' })}
      cta=${{ label: c.about.cta.label, href: ctx.url('about') }} />
    <hr className="itl-section-divider" />
    <${ds.SectionHeader}
      eyebrow=${c.services.eyebrow}
      title=${c.services.title}
      action=${{ label: c.services.action.label, href: ctx.url('services') }} />
    <div className="itl-services">${cards}</div>
  <//>`;

  const band = html`<${ds.CtaBand}
    eyebrow=${common.ctaBand.eyebrow}
      title=${common.ctaBand.title}
    titleAccent=${common.ctaBand.titleAccent}
    body=${common.ctaBand.body}
    cta=${{ label: common.ctaBand.cta.label, href: ctx.url('contact') }} />`;

  return { meta: c.meta, body: Frame(ctx, html`<${React.Fragment}>${hero}${panel}${band}<//>`, { overlayNav: true }) };
}
