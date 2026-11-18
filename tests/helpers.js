// Starts the real app on an ephemeral port for integration tests.
import http from 'node:http';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';

export function testConfig(overrides = {}) {
  return loadConfig({ NODE_ENV: 'test', SITE_URL: 'http://localhost', ...overrides });
}

export async function startServer({ env = {}, extra, config, mailTransport, now } = {}) {
  const app = createApp(config ?? testConfig(env), { extra, mailTransport, now });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base,
    close: () => new Promise((resolve) => server.close(resolve)),
    get: (path, headers = {}) => fetch(base + path, { headers, redirect: 'manual' }),
    post: (path, fields, headers = {}) => fetch(base + path, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
      body: typeof fields === 'string' ? fields : new URLSearchParams(fields).toString(),
    }),
  };
}

// Keeps JSON log lines out of the test output but lets a test inspect them.
export const logLines = [];
const realWrite = process.stdout.write.bind(process.stdout);
export function quietLogs() {
  process.stdout.write = (chunk, ...rest) => {
    const text = String(chunk);
    if (text.startsWith('{"time"')) { logLines.push(text); return true; }
    return realWrite(chunk, ...rest);
  };
}

// A plain http request with exactly the headers given (fetch adds Cache-Control: no-cache when If-None-Match is set).
export function rawGet(base, path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get(base + path, { headers }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers }));
    }).on('error', reject);
  });
}
