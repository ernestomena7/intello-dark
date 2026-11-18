import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, TOPICS } from '../../src/contact/validate.js';

const ok = { name: 'Ana Pérez', company: 'Acme', email: 'ana@acme.com', phone: '+503 2222-3333', topic: 'tracking', message: 'Quiero saber más sobre el rastreo.' };
const errorsOf = (over) => validate({ ...ok, ...over }).errors;

test('a valid enquiry has no errors and keeps its values', () => {
  const { values, errors } = validate(ok);
  assert.deepEqual(errors, {});
  assert.equal(values.topic, 'tracking');
});

test('name: trimmed; 2-100 characters; control characters removed', () => {
  assert.equal(errorsOf({ name: '' }).name, 'required');
  assert.equal(errorsOf({ name: '   ' }).name, 'required');
  assert.equal(errorsOf({ name: 'A' }).name, 'tooShort');
  assert.equal(errorsOf({ name: 'Al' }).name, undefined);
  assert.equal(errorsOf({ name: 'x'.repeat(100) }).name, undefined);
  assert.equal(errorsOf({ name: 'x'.repeat(101) }).name, 'tooLong');
  assert.equal(validate({ ...ok, name: '  Ana\u0000\u0007  ' }).values.name, 'Ana');
  assert.equal(validate({ ...ok, name: 'Ana\r\nBcc: evil@x.com' }).values.name, 'Ana Bcc: evil@x.com');
});

test('company: at most 150 characters', () => {
  assert.equal(errorsOf({ company: '' }).company, undefined);
  assert.equal(errorsOf({ company: 'c'.repeat(150) }).company, undefined);
  assert.equal(errorsOf({ company: 'c'.repeat(151) }).company, 'tooLong');
});

test('email: at most 254 characters; one @ with text and a dot-separated domain; no whitespace or line breaks', () => {
  assert.equal(errorsOf({ email: '' }).email, 'required');
  for (const bad of ['plain', 'a@b', '@b.com', 'a@.com', 'a b@c.com', 'a@b.com\r\nBcc: x@y.com', 'a@@b.com']) {
    assert.equal(errorsOf({ email: bad }).email, 'invalid', bad);
  }
  assert.equal(errorsOf({ email: 'a.b+c@sub.example.co' }).email, undefined);
  assert.equal(errorsOf({ email: 'a'.repeat(250) + '@b.co' }).email, 'tooLong');
});

test('phone: at most 30 characters; digits, spaces and + - ( ) . only; optional', () => {
  assert.equal(errorsOf({ phone: '' }).phone, undefined);
  assert.equal(errorsOf({ phone: '+1 (555) 123-4567.8' }).phone, undefined);
  assert.equal(errorsOf({ phone: '555-CALL' }).phone, 'invalid');
  assert.equal(errorsOf({ phone: '1'.repeat(31) }).phone, 'tooLong');
});

test('topic: one of the five ids, default other', () => {
  for (const t of TOPICS) assert.equal(validate({ ...ok, topic: t }).values.topic, t);
  assert.equal(validate({ ...ok, topic: 'nope' }).values.topic, 'other');
  assert.equal(validate({ ...ok, topic: undefined }).values.topic, 'other');
});

test('message: 10-4000 characters; line breaks normalised; control characters removed', () => {
  assert.equal(errorsOf({ message: '' }).message, 'required');
  assert.equal(errorsOf({ message: 'short' }).message, 'tooShort');
  assert.equal(errorsOf({ message: 'm'.repeat(10) }).message, undefined);
  assert.equal(errorsOf({ message: 'm'.repeat(4000) }).message, undefined);
  assert.equal(errorsOf({ message: 'm'.repeat(4001) }).message, 'tooLong');
  assert.equal(validate({ ...ok, message: 'línea uno\r\nlínea dos\rtres\u0000\u0007 fin' }).values.message, 'línea uno\nlínea dos\ntres fin');
});

test('error values are keys, never literal text', () => {
  const { errors } = validate({});
  assert.deepEqual(errors, { name: 'required', email: 'required', message: 'required' });
});

test('repeated fields use the first value', () => {
  assert.equal(validate({ ...ok, name: ['Ana', 'Beto'] }).values.name, 'Ana');
});
