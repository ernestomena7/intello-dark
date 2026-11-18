// Contact page: the one form. Server-rendered and fully usable without JavaScript.
// ctx.form (set by the POST route) carries { values, errors, notice } for re-rendering after a failure.
import { html, React } from '../render/html.js';
import { Frame, telHref } from '../render/frame.js';
import { imageProps } from '../render/image.js';
import { TOPICS } from '../contact/validate.js';

export const key = 'contact';
export const cache = false; // every response carries its own single-use form token

export function render(ctx) {
  const { ds, lang, site, structure } = ctx;
  const c = ctx.content('contact');
  const form = ctx.form ?? {};
  const errors = form.errors ?? {};
  const queryTopic = typeof ctx.query.topic === 'string' && TOPICS.includes(ctx.query.topic) ? ctx.query.topic : 'other';
  const values = { name: '', company: '', email: '', phone: '', topic: queryTopic, message: '', ...(form.values ?? {}) };
  const notice = form.notice ?? (ctx.query.sent === '1' ? 'sent' : null);
  const phone = site.phone;

  const errorList = Object.entries(errors).map(([field, rule]) => ({ id: field, message: c.form.errors[field][rule] }));
  const err = (field) => (errors[field] ? c.form.errors[field][errors[field]] : undefined);

  const details = html`<p className="itl-body">
    ${c.details.phoneLabel}: <a href=${telHref(phone)}>${phone}</a>${' · '}${c.details.hoursLabel}: ${site.hours[lang]}
  </p>`;

  const noticeBlock = (() => {
    switch (notice) {
      case 'failed':
        return html`<${ds.FormNotice} variant="error" title=${c.failed.title}><p>${c.failed.body} <a href=${telHref(phone)}>${phone}</a>.</p><//>`;
      case 'rateLimited':
        return html`<${ds.FormNotice} variant="error" title=${c.rateLimited.title}><p>${c.rateLimited.body} <a href=${telHref(phone)}>${phone}</a>.</p><//>`;
      case 'token':
      case 'expired':
      case 'used':
        return html`<${ds.FormNotice} variant="info" title=${c.form.notices[notice].title}><p>${c.form.notices[notice].body}</p><//>`;
      default:
        return null;
    }
  })();

  let panel;
  if (notice === 'sent') {
    panel = html`<div className="itl-stack">
      <${ds.FormNotice} variant="success" title=${c.sent.title}><p>${c.sent.body}</p><//>
      <div><${ds.Button} variant="outline" href=${`/${lang}/`}>${c.sent.home.label}<//></div>
    </div>`;
  } else {
    const token = ctx.req?.app?.locals?.tokens?.issue() ?? '';
    const labels = c.form.labels;
    const topicOptions = structure.topics.map((id) => ({ value: id, label: c.form.topics[id] }));
    panel = html`<form method="post" action=${ctx.url('contact')} className="itl-form" noValidate=${true}>
      ${errorList.length ? html`<${ds.FormErrorSummary} id="form-errors" title=${c.form.summaryTitle} errors=${errorList} />` : null}
      ${noticeBlock}
      <p className="itl-hint">${c.form.requiredNote}</p>
      <div className="itl-form-row">
        <${ds.Field} id="name" label=${labels.name} required=${true} error=${err('name')}>
          <${ds.TextInput} name="name" autoComplete="name" maxLength=${100} value=${values.name} />
        <//>
        <${ds.Field} id="company" label=${labels.company} error=${err('company')}>
          <${ds.TextInput} name="company" autoComplete="organization" maxLength=${150} value=${values.company} />
        <//>
      </div>
      <div className="itl-form-row">
        <${ds.Field} id="email" label=${labels.email} required=${true} error=${err('email')}>
          <${ds.TextInput} name="email" type="email" autoComplete="email" maxLength=${254} value=${values.email} />
        <//>
        <${ds.Field} id="phone" label=${labels.phone} hint=${c.form.hints.phone} error=${err('phone')}>
          <${ds.TextInput} name="phone" type="tel" autoComplete="tel" maxLength=${30} value=${values.phone} />
        <//>
      </div>
      <${ds.Field} id="topic" label=${labels.topic}>
        <${ds.Select} name="topic" options=${topicOptions} value=${values.topic} />
      <//>
      <${ds.Field} id="message" label=${labels.message} hint=${c.form.hints.message} required=${true} error=${err('message')}>
        <${ds.Textarea} name="message" rows=${6} maxLength=${4000} value=${values.message} />
      <//>
      <${ds.Honeypot} name="website" />
      <input type="hidden" name="ft" value=${token} />
      <p className="itl-hint">${c.form.privacy.before}<a href=${ctx.url('privacy')}>${c.form.privacy.linkText}</a>${c.form.privacy.after}</p>
      <div><${ds.Button} type="submit">${c.form.submit.label}<//></div>
    </form>`;
  }

  const body = html`<${React.Fragment}>
    <${ds.PageHero}
      eyebrow=${c.header.eyebrow}
      title=${c.header.title}
      titleAccent=${c.header.titleAccent}
      lede=${c.header.lede}
      media=${imageProps(lang, structure.imageSlots['contact.hero'], { sizes: '(min-width: 900px) 50vw, 100vw', icon: 'headset' })} />
    <${ds.Section} tone="card">
      <div className="itl-stack">${details}${panel}</div>
    <//>
  <//>`;
  return { meta: c.meta, body: Frame(ctx, body) };
}
