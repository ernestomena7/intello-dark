// Builds and sends the notification email with Nodemailer (contracts/contact-form.md "Notification email").
// Outside production with no SMTP_HOST the message is written to the console instead of being sent.
import nodemailer from 'nodemailer';
import { emailLabels } from '../i18n/content.js';

const header = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim(); // header-injection protection

export function buildMessage(config, enquiry) {
  const email = emailLabels();
  const topic = email.topics[enquiry.topic] ?? email.topics.other;
  const none = email.notProvided;
  const subject = header(`${email.subjectPrefix} ${topic} — ${enquiry.name}`).slice(0, 150);
  const L = email.labels;
  const text = [
    email.intro,
    '',
    `${L.language}: ${email.languages[enquiry.language]}`,
    `${L.topic}: ${topic}`,
    `${L.name}: ${header(enquiry.name)}`,
    `${L.company}: ${header(enquiry.company) || none}`,
    `${L.email}: ${header(enquiry.email)}`,
    `${L.phone}: ${header(enquiry.phone) || none}`,
    `${L.received}: ${enquiry.receivedAt}`,
    `${L.requestId}: ${enquiry.requestId}`,
    '',
    `${L.message}:`,
    enquiry.message,
    '',
  ].join('\n');

  return {
    from: config.contactFrom,
    to: config.contactTo,
    replyTo: { name: header(enquiry.name).replace(/[<>",]/g, ''), address: header(enquiry.email) },
    subject,
    text,
  };
}

export function createMailer(config, { transport } = {}) {
  const smtp = config.mailMode === 'smtp';
  const t = transport ?? (smtp
    ? nodemailer.createTransport({
      host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    })
    : nodemailer.createTransport({ jsonTransport: true }));

  return {
    async sendEnquiry(enquiry) {
      const message = buildMessage(config, enquiry);
      const info = await t.sendMail(message);
      if (!smtp && !transport && !config.isProduction) {
        // Development only: show what would have been sent. Never runs in production (config forbids log mode there).
        console.log(`[dev mail] To: ${message.to.join(', ')}\n${message.subject}\n${message.text}`);
      }
      return info;
    },
  };
}
