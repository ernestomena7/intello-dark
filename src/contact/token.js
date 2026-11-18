// Signed, single-use form token (data-model.md "Form token").
// Valid from 2 seconds (a faster post is automated) to 2 hours (older has expired) after it was issued.
// Used nonces are held in memory until they expire; a restart can allow one replay of an unexpired token.
import crypto from 'node:crypto';

export const MIN_AGE_MS = 2000;
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function createTokenService({ secret, now = () => Date.now() }) {
  const used = new Map(); // nonce -> expiry time

  const sign = (payload) => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

  function prune() {
    const t = now();
    for (const [nonce, expires] of used) if (expires <= t) used.delete(nonce);
  }

  function issue() {
    const payload = `${now()}.${crypto.randomBytes(12).toString('base64url')}`;
    return `${payload}.${sign(payload)}`;
  }

  // Non-consuming check: 'ok' | 'missing' | 'invalid' | 'too-fast' | 'expired' | 'used'
  function inspect(token) {
    prune();
    if (typeof token !== 'string' || token === '') return { status: 'missing' };
    const parts = token.split('.');
    if (parts.length !== 3) return { status: 'invalid' };
    const [issuedAt, nonce, signature] = parts;
    const expected = sign(`${issuedAt}.${nonce}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { status: 'invalid' };
    const age = now() - Number(issuedAt);
    if (!Number.isFinite(age) || age < 0) return { status: 'invalid' };
    if (age < MIN_AGE_MS) return { status: 'too-fast' };
    if (age > MAX_AGE_MS) return { status: 'expired' };
    if (used.has(nonce)) return { status: 'used' };
    return { status: 'ok', nonce, expires: Number(issuedAt) + MAX_AGE_MS };
  }

  // Checks again and marks the nonce used in the same step, so two simultaneous posts cannot both pass.
  function consume(token) {
    const result = inspect(token);
    if (result.status === 'ok') used.set(result.nonce, result.expires);
    return result.status;
  }

  return { issue, inspect: (t) => inspect(t).status, consume, usedCount: () => used.size };
}
