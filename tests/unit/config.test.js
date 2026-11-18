import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, ConfigError } from '../../src/config.js';

const PROD = {
  NODE_ENV: 'production', SITE_URL: 'https://example.com', TRUST_PROXY: '1',
  SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_SECURE: 'true', SMTP_USER: 'web@example.com', SMTP_PASS: 'super-secret-password',
  CONTACT_FROM: 'web@example.com', CONTACT_TO: 'a@example.com, b@example.com',
  FORM_TOKEN_SECRET: 'x'.repeat(40),
};
const noPlaceholders = { readSiteFile: () => ({ placeholder: false }) };

function problems(env, opts = noPlaceholders) {
  try { loadConfig(env, opts); } catch (err) { assert.ok(err instanceof ConfigError); return err; }
  return null;
}

test('a complete production configuration loads', () => {
  const c = loadConfig(PROD, noPlaceholders);
  assert.equal(c.isProduction, true);
  assert.equal(c.mailMode, 'smtp');
  assert.deepEqual(c.contactTo, ['a@example.com', 'b@example.com']);
  assert.equal(c.trustProxy, 1);
});

test('missing variables are reported by name only, never by value', () => {
  const env = { ...PROD };
  delete env.SMTP_PASS; delete env.CONTACT_TO; delete env.SITE_URL;
  const err = problems(env);
  const text = err.message;
  assert.match(text, /SMTP_PASS/);
  assert.match(text, /CONTACT_TO/);
  assert.match(text, /SITE_URL/);
  assert.doesNotMatch(text, /super-secret-password/);
});

test('a short FORM_TOKEN_SECRET is rejected in production', () => {
  const err = problems({ ...PROD, FORM_TOKEN_SECRET: 'short' });
  assert.match(err.message, /FORM_TOKEN_SECRET must be at least 32 characters/);
  assert.doesNotMatch(err.message, /short/);
});

test('SMTP_SECURE must agree with SMTP_PORT', () => {
  assert.match(problems({ ...PROD, SMTP_PORT: '465', SMTP_SECURE: 'false' }).message, /disagrees/);
  assert.match(problems({ ...PROD, SMTP_PORT: '587', SMTP_SECURE: 'true' }).message, /disagrees/);
  assert.equal(problems({ ...PROD, SMTP_PORT: '587', SMTP_SECURE: 'false' }), null);
});

test('production refuses placeholder details unless ALLOW_PLACEHOLDERS=1', () => {
  const placeholder = { readSiteFile: () => ({ placeholder: true }) };
  assert.match(problems(PROD, placeholder).message, /placeholder/);
  assert.equal(problems({ ...PROD, ALLOW_PLACEHOLDERS: '1' }, placeholder), null);
});

test('production requires an https SITE_URL', () => {
  assert.match(problems({ ...PROD, SITE_URL: 'http://example.com' }).message, /https/);
});

test('PORT falls back to a local default only when absent', () => {
  const c = loadConfig({ NODE_ENV: 'development' });
  assert.equal(c.port, 3000);
  assert.equal(c.portFromEnv, false);
  const d = loadConfig({ NODE_ENV: 'development', PORT: '4100' });
  assert.equal(d.port, 4100);
  assert.equal(d.portFromEnv, true);
  assert.match(problems({ NODE_ENV: 'development', PORT: 'abc' }).message, /PORT/);
});

test('outside production the mail transport falls back to the log, and a dev secret is generated', () => {
  const c = loadConfig({ NODE_ENV: 'development' });
  assert.equal(c.mailMode, 'log');
  assert.ok(c.formTokenSecret.length >= 32);
});

test('the log mail fallback is not available in production', () => {
  const env = { ...PROD };
  delete env.SMTP_HOST;
  assert.match(problems(env).message, /SMTP_HOST is required in production/);
});

test('CONTACT_TO accepts several addresses and rejects malformed ones', () => {
  assert.match(problems({ ...PROD, CONTACT_TO: 'ok@example.com, not-an-email' }).message, /CONTACT_TO/);
});
