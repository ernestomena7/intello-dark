import test from 'node:test';
import assert from 'node:assert/strict';
import { createTokenService, MIN_AGE_MS, MAX_AGE_MS } from '../../src/contact/token.js';

function make() {
  let t = 1_700_000_000_000;
  const svc = createTokenService({ secret: 's'.repeat(40), now: () => t });
  return { svc, advance: (ms) => { t += ms; } };
}

test('a token younger than 2 seconds is automated', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  assert.equal(svc.inspect(token), 'too-fast');
  advance(MIN_AGE_MS - 1);
  assert.equal(svc.inspect(token), 'too-fast');
  advance(1);
  assert.equal(svc.inspect(token), 'ok');
});

test('a token older than 2 hours has expired', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  advance(MAX_AGE_MS);
  assert.equal(svc.inspect(token), 'ok');
  advance(1);
  assert.equal(svc.inspect(token), 'expired');
});

test('a token works once', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  advance(3000);
  assert.equal(svc.consume(token), 'ok');
  assert.equal(svc.consume(token), 'used');
  assert.equal(svc.inspect(token), 'used');
});

test('inspecting does not consume', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  advance(3000);
  assert.equal(svc.inspect(token), 'ok');
  assert.equal(svc.inspect(token), 'ok');
  assert.equal(svc.consume(token), 'ok');
});

test('tampered, foreign and malformed tokens are invalid; empty is missing', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  advance(3000);
  const [issuedAt, nonce, sig] = token.split('.');
  assert.equal(svc.inspect(`${Number(issuedAt) + 1}.${nonce}.${sig}`), 'invalid');
  assert.equal(svc.inspect(`${issuedAt}.${nonce}.${sig.slice(0, -2)}xx`), 'invalid');
  assert.equal(svc.inspect('not-a-token'), 'invalid');
  assert.equal(svc.inspect(''), 'missing');
  assert.equal(svc.inspect(undefined), 'missing');
  const other = createTokenService({ secret: 'z'.repeat(40), now: () => 1_700_000_003_000 });
  assert.equal(other.inspect(token), 'invalid');
});

test('used nonces are forgotten once they expire', () => {
  const { svc, advance } = make();
  const token = svc.issue();
  advance(3000);
  svc.consume(token);
  assert.equal(svc.usedCount(), 1);
  advance(MAX_AGE_MS + 1);
  svc.inspect(svc.issue());
  assert.equal(svc.usedCount(), 0);
});
