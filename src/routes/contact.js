// POST /es/contacto and POST /en/contact (contracts/http-routes.md "Contact submission", contracts/contact-form.md).
// Order of checks: rate limit -> body size -> honeypot -> token -> validation -> single-use token -> send.
import express from 'express';
import { LANGUAGES, pathFor } from '../i18n/locales.js';
import { pages } from '../pages/index.js';
import { makeContext } from '../render/context.js';
import { renderDocument } from '../render/html.js';
import { validate } from '../contact/validate.js';
import { createTokenService } from '../contact/token.js';
import { createMailer } from '../contact/mailer.js';
import { createContactLimiter } from '../security/limits.js';
import { log } from '../log.js';

export function contactRoutes(app, config, opts = {}) {
  const tokens = createTokenService({ secret: config.formTokenSecret, now: opts.now });
  const mailer = createMailer(config, { transport: opts.mailTransport });
  app.locals.tokens = tokens;
  app.locals.mailer = mailer;

  const urlencoded = express.urlencoded({ extended: false, limit: '16kb' });

  function renderContact(req, res, lang, status, form) {
    const ctx = Object.assign(makeContext(config, lang, 'contact', req), { form });
    const html = renderDocument({ config, lang, pageKey: 'contact', result: pages.get('contact').render(ctx) });
    res.status(status).set({ 'Content-Language': lang, 'Cache-Control': 'no-store' }).type('html').send(html);
  }

  for (const lang of LANGUAGES) {
    const route = pathFor('contact', lang);
    const outcome = (req, name, start) => log('contact', { requestId: req.id, route, language: lang, outcome: name, ms: Date.now() - start });

    const limiter = createContactLimiter({
      onLimit: (req, res) => {
        log('contact', { requestId: req.id, route, language: lang, outcome: 'rate-limited', ms: 0 });
        renderContact(req, res, lang, 429, { notice: 'rateLimited' });
      },
    });

    app.post(route, limiter, urlencoded, async (req, res, next) => {
      const start = Date.now();
      try {
        const body = req.body ?? {};

        // Honeypot: look like a success, send nothing.
        if (String(body.website ?? '') !== '') {
          outcome(req, 'honeypot', start);
          return res.redirect(303, `${route}?sent=1`);
        }

        const { values, errors } = validate(body);

        const status = tokens.inspect(body.ft);
        if (status !== 'ok') {
          outcome(req, 'token', start);
          const notice = status === 'used' ? 'used' : status === 'expired' ? 'expired' : 'token';
          return renderContact(req, res, lang, 422, { values, notice });
        }

        if (Object.keys(errors).length) {
          outcome(req, 'invalid', start);
          return renderContact(req, res, lang, 422, { values, errors });
        }

        if (tokens.consume(body.ft) !== 'ok') { // a simultaneous post won the race
          outcome(req, 'token', start);
          return renderContact(req, res, lang, 422, { values, notice: 'used' });
        }

        const enquiry = { ...values, language: lang, receivedAt: new Date().toISOString(), requestId: req.id };
        try {
          await mailer.sendEnquiry(enquiry);
        } catch (err) {
          // Log the failure without the message body or any visitor data.
          log('error', { requestId: req.id, kind: 'mail-failed', name: err?.name, code: err?.code, responseCode: err?.responseCode });
          outcome(req, 'mail-failed', start);
          return renderContact(req, res, lang, 503, { values, notice: 'failed' });
        }

        outcome(req, 'sent', start);
        return res.redirect(303, `${route}?sent=1`);
      } catch (err) {
        return next(err);
      }
    });
  }
}
