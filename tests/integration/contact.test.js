// User story 2: the contact form (contracts/contact-form.md and http-routes.md), with a mocked mail transport.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, quietLogs, logLines } from '../helpers.js';

quietLogs();

const ES = '/es/contacto';
const EN = '/en/contact';
const VALID = { name: 'Ana Pérez', company: 'Acme Logística', email: 'ana@acme.com', phone: '+503 2222-3333', topic: 'tracking', message: 'Quiero conocer el servicio de rastreo.' };

async function setup(extraEnv = {}) {
  const sent = [];
  const state = { fail: false, now: 1_700_000_000_000 };
  const transport = {
    async sendMail(message) {
      if (state.fail) throw Object.assign(new Error('smtp-secret-internal-detail'), { code: 'ECONNECTION' });
      sent.push(message);
      return { accepted: message.to };
    },
  };
  const srv = await startServer({
    env: { CONTACT_FROM: 'web@intello.test', CONTACT_TO: 'ventas@intello.test, ops@intello.test', ...extraEnv },
    mailTransport: transport,
    now: () => state.now,
  });
  // GET the form, read its token, wait past the 2 second minimum.
  async function form(path = ES, query = '') {
    const html = await (await srv.get(path + query)).text();
    const token = /name="ft" value="([^"]+)"/.exec(html)?.[1];
    state.now += 3000;
    return { html, token };
  }
  async function submit(path, fields, { token, wait = true } = {}) {
    const t = token ?? (await form(path)).token;
    if (!wait) state.now -= 3000;
    return srv.post(path, { ft: t, website: '', ...fields });
  }
  return { srv, sent, state, form, submit };
}

test('a valid enquiry is emailed to every recipient with the visitor as Reply-To and the language stated', async () => {
  const { srv, sent, submit } = await setup();
  const res = await submit(ES, VALID);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), `${ES}?sent=1`);
  assert.equal(sent.length, 1);
  const m = sent[0];
  assert.deepEqual(m.to, ['ventas@intello.test', 'ops@intello.test']);
  assert.equal(m.from, 'web@intello.test');
  assert.deepEqual(m.replyTo, { name: 'Ana Pérez', address: 'ana@acme.com' });
  assert.match(m.subject, /^\[Intello web\] Monitoreo de carga — Ana Pérez$/);
  assert.match(m.text, /Idioma del visitante: Español \(es\)/);
  assert.match(m.text, /Quiero conocer el servicio de rastreo\./);
  for (const field of ['Nombre', 'Empresa', 'Correo', 'Teléfono', 'Tema', 'Recibido', 'ID de solicitud']) assert.match(m.text, new RegExp(field));
  const confirmation = await (await srv.get(`${ES}?sent=1`)).text();
  assert.match(confirmation, /Mensaje enviado/);
  assert.doesNotMatch(confirmation, /<form/);
  await srv.close();
});

test('the English route is English end to end and states the language in the email', async () => {
  const { srv, sent, form, submit } = await setup();
  const page = await form(EN);
  assert.match(page.html, /<html lang="en"/);
  assert.match(page.html, /Send message/);
  const res = await submit(EN, { ...VALID, message: 'I would like to learn about tracking.' }, { token: page.token });
  assert.equal(res.headers.get('location'), `${EN}?sent=1`);
  assert.match(sent[0].text, /Idioma del visitante: Inglés \(en\)/);
  assert.match(await (await srv.get(`${EN}?sent=1`)).text(), /Message sent/);
  await srv.close();
});

test('line breaks in names, emails and subjects cannot add headers or recipients', async () => {
  const { srv, sent, submit } = await setup();
  const res = await submit(ES, { ...VALID, name: 'Eve\r\nBcc: evil@x.com', company: 'Co\r\nTo: evil@x.com' });
  assert.equal(res.status, 303);
  const m = sent[0];
  assert.doesNotMatch(m.subject, /[\r\n]/);
  assert.doesNotMatch(m.replyTo.name, /[\r\n]/);
  assert.equal(m.bcc, undefined);
  assert.deepEqual(m.to, ['ventas@intello.test', 'ops@intello.test']);
  const bad = await submit(ES, { ...VALID, email: 'a@b.com\r\nBcc: evil@x.com' });
  assert.equal(bad.status, 422);
  assert.equal(sent.length, 1);
  await srv.close();
});

test('a filled honeypot looks like a success but sends nothing', async () => {
  const { srv, sent, state, form } = await setup();
  const { token } = await form();
  const res = await srv.post(ES, { ...VALID, ft: token, website: 'http://spam.example' });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), `${ES}?sent=1`);
  assert.equal(sent.length, 0);
  assert.ok(logLines.some((l) => l.includes('"outcome":"honeypot"')));
  void state;
  await srv.close();
});

test('a repeated token sends once and the second post sees the already-sent notice', async () => {
  const { srv, sent, form } = await setup();
  const { token } = await form();
  const first = await srv.post(ES, { ...VALID, ft: token, website: '' });
  const second = await srv.post(ES, { ...VALID, ft: token, website: '' });
  assert.equal(first.status, 303);
  assert.equal(second.status, 422);
  assert.match(await second.text(), /Este mensaje ya se envió/);
  assert.equal(sent.length, 1);
  await srv.close();
});

test('two simultaneous posts of the same token send only one email', async () => {
  const { srv, sent, form } = await setup();
  const { token } = await form();
  const [a, b] = await Promise.all([srv.post(ES, { ...VALID, ft: token, website: '' }), srv.post(ES, { ...VALID, ft: token, website: '' })]);
  assert.deepEqual([a.status, b.status].sort(), [303, 422]);
  assert.equal(sent.length, 1);
  await srv.close();
});

test('a post less than 2 seconds after the form was issued is rejected as automated', async () => {
  const { srv, sent, submit } = await setup();
  const res = await submit(ES, VALID, { wait: false });
  assert.equal(res.status, 422);
  assert.match(await res.text(), /Actualizamos el formulario/);
  assert.equal(sent.length, 0);
  await srv.close();
});

test('a missing, tampered or expired token sends nothing and shows a fresh form', async () => {
  const { srv, sent, state, form } = await setup();
  const none = await srv.post(ES, { ...VALID, website: '' });
  assert.equal(none.status, 422);
  const html = await none.text();
  assert.match(html, /name="ft" value="[^"]+"/, 'a fresh token is issued');
  const bad = await srv.post(ES, { ...VALID, ft: 'x.y.z', website: '' });
  assert.equal(bad.status, 422);
  const { token } = await form();
  state.now += 3 * 60 * 60 * 1000;
  const old = await srv.post(ES, { ...VALID, ft: token, website: '' });
  assert.equal(old.status, 422);
  assert.match(await old.text(), /El formulario caducó/);
  assert.equal(sent.length, 0);
  await srv.close();
});

test('invalid input returns 422 with a summary, errors beside the fields, and the entries kept', async () => {
  const { srv, sent, submit } = await setup();
  const res = await submit(ES, { name: 'Ana', company: 'Acme', email: '', phone: 'abc', topic: 'tracking', message: 'corto' });
  assert.equal(res.status, 422);
  const html = await res.text();
  assert.match(html, /role="alert"/);
  assert.match(html, /Revisa estos campos/);
  for (const [id, text] of [['email', 'Escribe tu correo electrónico.'], ['phone', 'Usa solo números'], ['message', 'mínimo 10 caracteres']]) {
    assert.match(html, new RegExp(`href="#${id}"`), `summary links to ${id}`);
    assert.match(html, new RegExp(`id="${id}-error"[^>]*>[\\s\\S]*?${text}`), `${id} error beside the field`);
    assert.match(html, new RegExp(`id="${id}"[^>]*aria-describedby="[^"]*${id}-error`), `${id} is described by its error`);
  }
  assert.match(html, /value="Ana"/);
  assert.match(html, /value="Acme"/);
  assert.match(html, /<option value="tracking" selected/);
  assert.equal(sent.length, 0);
  await srv.close();
});

test('the sixth post within the window returns 429 with Retry-After', async () => {
  const { srv, submit } = await setup();
  for (let i = 0; i < 5; i += 1) assert.equal((await submit(ES, { ...VALID, message: 'corto' })).status, 422);
  const sixth = await srv.post(ES, { ...VALID, website: '' });
  assert.equal(sixth.status, 429);
  assert.ok(Number(sixth.headers.get('retry-after')) > 0);
  assert.match(await sixth.text(), /Demasiados intentos/);
  await srv.close();
});

test('a transport error returns 503 with the phone number, the entries, and no technical detail', async () => {
  const { srv, state, submit } = await setup();
  state.fail = true;
  const res = await submit(ES, VALID);
  assert.equal(res.status, 503);
  const html = await res.text();
  assert.match(html, /No pudimos enviar tu mensaje/);
  assert.match(html, /\+503 0000-0000/);
  assert.match(html, /value="Ana Pérez"/);
  assert.doesNotMatch(html, /smtp-secret-internal-detail|ECONNECTION|Error:|at \w+ \(/);
  assert.ok(logLines.some((l) => l.includes('"kind":"mail-failed"') && l.includes('ECONNECTION')));
  assert.ok(!logLines.some((l) => l.includes('smtp-secret-internal-detail')), 'the error message is not logged');
  await srv.close();
});

test('a body over 16 KB returns 413 with the too-large text', async () => {
  const { srv, form } = await setup();
  const { token } = await form();
  const res = await srv.post(ES, `name=a&message=${'x'.repeat(20000)}&ft=${token}`);
  assert.equal(res.status, 413);
  assert.match(await res.text(), /demasiado largo/);
  await srv.close();
});

test('the contact page is never cached and every response has its own token', async () => {
  const { srv } = await setup();
  const a = await srv.get(ES);
  const b = await srv.get(ES);
  assert.equal(a.headers.get('cache-control'), 'no-store');
  assert.equal(a.headers.get('etag'), null);
  const tokenA = /name="ft" value="([^"]+)"/.exec(await a.text())[1];
  const tokenB = /name="ft" value="([^"]+)"/.exec(await b.text())[1];
  assert.notEqual(tokenA, tokenB);
  await srv.close();
});

test('a service link pre-selects the topic', async () => {
  const { srv } = await setup();
  const html = await (await srv.get(`${EN}?topic=ai-analytics`)).text();
  assert.match(html, /<option value="ai-analytics" selected/);
  const bogus = await (await srv.get(`${EN}?topic=nope`)).text();
  assert.match(bogus, /<option value="other" selected/);
  await srv.close();
});

test('the form works without scripts: a normal post form with labelled controls, honeypot and privacy statement', async () => {
  const { srv } = await setup();
  const html = await (await srv.get(ES)).text();
  assert.doesNotMatch(html, /<script/i);
  assert.match(html, /<form method="post" action="\/es\/contacto"/);
  for (const id of ['name', 'company', 'email', 'phone', 'topic', 'message']) assert.match(html, new RegExp(`<label[^>]*for="${id}"`), `label for ${id}`);
  assert.match(html, /name="website"[^>]*>/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /href="\/es\/privacidad">aviso de privacidad<\/a>/);
  await srv.close();
});

test('the navigation call to action reaches the contact page from every page', async () => {
  const { srv } = await setup();
  for (const [path, contact] of [['/es/', ES], ['/en/', EN], [ES, ES], [EN, EN], ['/es/privacidad', ES], ['/en/privacy', EN]]) {
    const html = await (await srv.get(path)).text();
    assert.ok(html.includes(`href="${contact}" class="itl-btn itl-btn-primary itl-btn-sm"`), `${path} has the call to action`);
  }
  await srv.close();
});

test('logs never contain the visitor data', async () => {
  const { srv, submit } = await setup();
  logLines.length = 0;
  await submit(ES, { ...VALID, name: 'Zorro Secreto', email: 'zorro.secreto@example.org', message: 'texto muy privado del visitante' });
  const text = logLines.join('');
  assert.ok(text.includes('"outcome":"sent"'));
  for (const secret of ['Zorro', 'zorro.secreto', 'texto muy privado', 'Acme']) assert.ok(!text.includes(secret), `log leaks ${secret}`);
  await srv.close();
});
