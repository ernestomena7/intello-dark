// Environment parsing with fail-fast checks (contracts/environment.md).
// Messages name variables, never values. Nothing here reads a secret into a log line.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, CONTENT_DIR } from './paths.js';

export class ConfigError extends Error {
  constructor(problems) {
    super(`Invalid configuration:\n- ${problems.join('\n- ')}`);
    this.name = 'ConfigError';
    this.problems = problems;
  }
}

// Local development only: Node 24 reads KEY=value pairs from .env without overriding real variables.
export function loadDotEnv(env = process.env) {
  if (env.NODE_ENV === 'production') return false;
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return false;
  process.loadEnvFile(file);
  return true;
}

const LOCAL_DEFAULT_PORT = 3000; // used only when PORT is absent (constitution v1.3.1)

function readSite() {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf8'));
}

export function loadConfig(env = process.env, { readSiteFile = readSite } = {}) {
  const problems = [];
  const isProduction = env.NODE_ENV === 'production';
  const need = (name) => {
    const v = (env[name] ?? '').trim();
    if (!v && isProduction) problems.push(`${name} is required in production`);
    return v;
  };

  const portRaw = (env.PORT ?? '').trim();
  const port = portRaw === '' ? LOCAL_DEFAULT_PORT : Number(portRaw);
  if (!Number.isInteger(port) || port < 0 || port > 65535) problems.push('PORT must be a whole number from 0 to 65535');

  const siteUrlRaw = need('SITE_URL') || `http://localhost:${port}`;
  let siteUrl = siteUrlRaw.replace(/\/+$/, '');
  try { new URL(siteUrl); } catch { problems.push('SITE_URL must be a full URL such as https://example.com'); siteUrl = `http://localhost:${port}`; }
  if (isProduction && !/^https:\/\//.test(siteUrl)) problems.push('SITE_URL must start with https:// in production');

  const trustRaw = isProduction ? need('TRUST_PROXY') : (env.TRUST_PROXY ?? '0').trim();
  const trustProxy = trustRaw === '' ? 0 : Number(trustRaw);
  if (!Number.isInteger(trustProxy) || trustProxy < 0) problems.push('TRUST_PROXY must be a whole number of proxy hops (0 or more)');

  const smtpHost = need('SMTP_HOST');
  const smtpPortRaw = need('SMTP_PORT') || '465';
  const smtpPort = Number(smtpPortRaw);
  const smtpSecureRaw = need('SMTP_SECURE') || (smtpPort === 465 ? 'true' : 'false');
  if (!['true', 'false'].includes(smtpSecureRaw)) problems.push('SMTP_SECURE must be true or false');
  const smtpSecure = smtpSecureRaw === 'true';
  if (!Number.isInteger(smtpPort)) problems.push('SMTP_PORT must be a whole number');
  else if ((smtpPort === 465 && !smtpSecure) || (smtpPort === 587 && smtpSecure)) problems.push('SMTP_SECURE disagrees with SMTP_PORT (use true for 465 and false for 587)');
  const smtpUser = need('SMTP_USER');
  const smtpPass = need('SMTP_PASS');
  const contactFrom = need('CONTACT_FROM');
  const contactTo = need('CONTACT_TO').split(',').map((s) => s.trim()).filter(Boolean);
  const looksLikeEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  if (contactFrom && !looksLikeEmail(contactFrom)) problems.push('CONTACT_FROM must be an email address');
  if (contactTo.some((a) => !looksLikeEmail(a))) problems.push('CONTACT_TO must be a comma-separated list of email addresses');

  let formTokenSecret = (env.FORM_TOKEN_SECRET ?? '').trim();
  if (isProduction) {
    if (!formTokenSecret) problems.push('FORM_TOKEN_SECRET is required in production');
    else if (formTokenSecret.length < 32) problems.push('FORM_TOKEN_SECRET must be at least 32 characters');
  } else if (formTokenSecret.length < 32) {
    formTokenSecret = crypto.randomBytes(32).toString('hex'); // development: tokens reset on restart
  }

  const allowPlaceholders = (env.ALLOW_PLACEHOLDERS ?? '').trim() === '1';
  if (isProduction && !allowPlaceholders) {
    let site = null;
    try { site = readSiteFile(); } catch { problems.push('content/site.json could not be read'); }
    if (site && site.placeholder) problems.push('content/site.json still has placeholder contact details (set ALLOW_PLACEHOLDERS=1 only for a staging deploy)');
  }

  if (problems.length) throw new ConfigError(problems);

  return Object.freeze({
    nodeEnv: env.NODE_ENV || 'development',
    isProduction,
    port,
    portFromEnv: portRaw !== '',
    siteUrl,
    trustProxy,
    // 'smtp' sends through the configured server; 'log' (never in production) writes the message to the log.
    mailMode: smtpHost ? 'smtp' : 'log',
    smtp: Object.freeze({ host: smtpHost, port: smtpPort, secure: smtpSecure, user: smtpUser, pass: smtpPass }),
    contactFrom: contactFrom || 'web@localhost.invalid',
    contactTo: contactTo.length ? contactTo : ['team@localhost.invalid'],
    formTokenSecret,
    allowPlaceholders,
    logLevel: env.LOG_LEVEL === 'debug' ? 'debug' : 'info',
  });
}
