// Hosting spike: answers the unverified Hostinger questions (plan S1-S8). Not part of the product.
// Deploy on a TEMPORARY domain only: the endpoints below are public. Delete after recording results.
import http from 'node:http';
import nodemailer from 'nodemailer';

const startedAt = new Date();
const port = Number(process.env.PORT) || 3000;
const BIG = 'Intello spike line for the compression test. '.repeat(5000); // ~230 KB of repetitive text

function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body, null, 2));
}

async function smtpCheck(secure, portNumber) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) return { skipped: 'SMTP_HOST is not set' };
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: portNumber, secure,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 10000,
  });
  const t0 = Date.now();
  try {
    await transporter.verify();
    return { port: portNumber, secure, ok: true, ms: Date.now() - t0 };
  } catch (err) {
    return { port: portNumber, secure, ok: false, ms: Date.now() - t0, code: err.code || null, responseCode: err.responseCode || null };
  } finally {
    transporter.close();
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://spike.local');
  switch (url.pathname) {
    case '/healthz':
      return json(res, 200, { status: 'ok' });
    case '/spike/env': // S1, S4, S7
      return json(res, 200, {
        node: process.version,
        portEnvIsSet: process.env.PORT !== undefined,
        portEnvValueKind: process.env.PORT === undefined ? 'absent' : /^\d+$/.test(process.env.PORT) ? 'number' : 'other (pipe or socket?)',
        listeningOn: port,
        nodeEnv: process.env.NODE_ENV || null,
        startedAt: startedAt.toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        smtpHostIsSet: Boolean(process.env.SMTP_HOST),
      });
    case '/spike/headers': // S3, S8
      return json(res, 200, {
        socketIsEncrypted: Boolean(req.socket.encrypted),
        remoteAddress: req.socket.remoteAddress,
        host: req.headers.host || null,
        xForwardedFor: req.headers['x-forwarded-for'] || null,
        xForwardedProto: req.headers['x-forwarded-proto'] || null,
        xForwardedHost: req.headers['x-forwarded-host'] || null,
        forwarded: req.headers.forwarded || null,
        acceptLanguage: req.headers['accept-language'] || null,
        cookieHeaderPresent: Boolean(req.headers.cookie),
        acceptEncoding: req.headers['accept-encoding'] || null,
        allHeaderNames: Object.keys(req.headers).sort(),
      });
    case '/spike/redirect': { // S5: does a proxy or CDN cache this? Run with different Accept-Language values.
      const wantsEnglish = /^\s*en\b/i.test(req.headers['accept-language'] || '');
      res.writeHead(302, { location: wantsEnglish ? '/spike/en' : '/spike/es', 'cache-control': 'no-store', vary: 'Accept-Language, Cookie', 'x-spike-generated': new Date().toISOString() });
      return res.end();
    }
    case '/spike/es':
    case '/spike/en':
      return json(res, 200, { language: url.pathname.slice(-2) });
    case '/spike/big': // S6: run curl with and without Accept-Encoding and compare sizes / content-encoding
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end(BIG);
    case '/spike/smtp': // S2
      return json(res, 200, { checks: [await smtpCheck(true, 465), await smtpCheck(false, 587)] });
    default:
      return json(res, 404, { error: 'not found' });
  }
});

server.listen(port, () => console.log(JSON.stringify({ event: 'spike-start', port, node: process.version, at: startedAt.toISOString() })));
