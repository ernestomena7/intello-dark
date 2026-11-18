import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { chooseLanguage, browserLanguage, savedLanguage } from '../../src/i18n/negotiate.js';

let server; let base;
before(async () => {
  const app = express();
  app.get('/choose', (req, res) => res.send(chooseLanguage(req)));
  app.get('/browser', (req, res) => res.send(browserLanguage(req)));
  app.get('/saved', (req, res) => res.send(String(savedLanguage(req))));
  server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const ask = async (path, headers = {}) => (await fetch(base + path, { headers })).text();

test('browser language: English only when it is the best supported match', async () => {
  const cases = [
    ['en-US,en;q=0.9', 'en'],
    ['en', 'en'],
    ['EN-gb', 'en'],
    ['es-SV,es;q=0.9,en;q=0.5', 'es'],
    ['es', 'es'],
    ['fr,en;q=0.5', 'en'],
    ['en;q=0.5,es;q=0.9', 'es'],
    ['pt-BR,pt;q=0.9', 'es'],
    ['*', 'es'],
    ['de,fr;q=0.8', 'es'],
  ];
  for (const [header, expected] of cases) assert.equal(await ask('/browser', { 'accept-language': header }), expected, header);
});

test('a missing Accept-Language header means Spanish', async () => {
  assert.equal(await ask('/browser', { 'accept-language': '' }), 'es');
  assert.equal(await ask('/browser'), 'es');
});

test('a saved cookie wins over the browser', async () => {
  assert.equal(await ask('/choose', { 'accept-language': 'en', cookie: 'itl_lang=es' }), 'es');
  assert.equal(await ask('/choose', { 'accept-language': 'es', cookie: 'other=1; itl_lang=en' }), 'en');
});

test('invalid cookie values are ignored', async () => {
  for (const cookie of ['itl_lang=fr', 'itl_lang=', 'itl_lang=EN', 'itl_lang=%E0%A4%A']) {
    assert.equal(await ask('/saved', { cookie }), 'null', cookie);
    assert.equal(await ask('/choose', { 'accept-language': 'en', cookie }), 'en', cookie);
  }
});
