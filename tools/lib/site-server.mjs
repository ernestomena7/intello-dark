// Starts the real site on an ephemeral port, as the browser tools need (no external network, logs silenced).
import { createApp } from '../../src/app.js';
import { loadConfig } from '../../src/config.js';

export async function startSite(env = {}) {
  const realWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, ...rest) => (String(chunk).startsWith('{"time"') ? true : realWrite(chunk, ...rest));
  const app = createApp(loadConfig({ NODE_ENV: 'test', SITE_URL: 'http://localhost', ...env }));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

// Blocks every request that leaves the site (the site must never call another origin).
export function blockExternal(page, base) {
  const external = [];
  return page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith(base) || url.startsWith('data:')) return route.continue();
    external.push(url);
    return route.abort();
  }).then(() => external);
}
