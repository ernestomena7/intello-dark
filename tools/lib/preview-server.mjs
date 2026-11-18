// Serves design-system component previews with tokens, bundle and React injected (the design system host normally does this).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DS = path.join(ROOT, 'Intello Design System');
const REACT = path.join(ROOT, 'node_modules', 'react', 'umd', 'react.development.js');
const REACT_DOM = path.join(ROOT, 'node_modules', 'react-dom', 'umd', 'react-dom.development.js');

export function listPreviews() {
  return fs.readdirSync(path.join(DS, 'components'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(DS, 'components', d.name, 'preview.html')))
    .map((d) => d.name);
}

export async function startPreviewServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const send = (file, type) => { res.writeHead(200, { 'content-type': type }); res.end(fs.readFileSync(file)); };
    if (url.pathname.startsWith('/preview/')) {
      const name = url.pathname.slice('/preview/'.length);
      let html = fs.readFileSync(path.join(DS, 'components', name, 'preview.html'), 'utf8');
      const head = '<link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/bundle.css">' +
        '<script src="/react.js"></script><script src="/react-dom.js"></script><script src="/bundle.js"></script>';
      html = html.replace(/<html([^>]*)>/i, (m, a) => '<html' + (/\blang=/.test(a) ? a : a + ' lang="es"') + ' data-theme="light">').replace(/<head>/i, '<head>' + head);
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
    } else if (url.pathname === '/tokens.css') send(path.join(DS, 'tokens.css'), 'text/css');
    else if (url.pathname === '/bundle.css') send(path.join(DS, 'components', 'bundle.css'), 'text/css');
    else if (url.pathname === '/bundle.js') send(path.join(DS, 'components', 'bundle.js'), 'text/javascript');
    else if (url.pathname === '/react.js') send(REACT, 'text/javascript');
    else if (url.pathname === '/react-dom.js') send(REACT_DOM, 'text/javascript');
    else { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
