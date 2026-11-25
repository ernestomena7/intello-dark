// Renders the hero map (land dots + route arcs + hubs, no text or cards) as one still frame on navy,
// used as the start/end frame of an AI-rendered loop. Output: out/hero-video/frame.png
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'route-map.json'), 'utf8'));
const land = fs.readFileSync(path.join(ROOT, 'public', 'img', 'route-map.svg'), 'utf8');
const W = 1980, H = Math.round(W * m.height / m.width);
const html = `<body style="margin:0;background:#2d2d45"><div style="position:relative;width:${W}px;height:${H}px">
${land.replace('<svg ', '<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.85" ')}
<svg viewBox="${m.viewBox}" style="position:absolute;inset:0;width:100%;height:100%">
${m.routes.map((r) => `<path d="${r.d}" fill="none" stroke="#9db8e0" stroke-opacity=".55" stroke-linecap="round" stroke-width="${(r.weight * 0.55).toFixed(2)}"/>`).join('')}
${m.hubs.map((h) => `<circle cx="${h.x}" cy="${h.y}" r="${h.kind === 'd' ? 3.6 : 4.6}" stroke="#2d2d45" stroke-width="1.5" fill="${h.kind === 'o' ? '#9db8e0' : h.kind === 'd' ? '#f6e71a' : '#ffffff'}"/>`).join('')}
</svg></div></body>`;
const out = path.join(HERE, 'out', 'hero-video');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.setContent(html);
await p.screenshot({ path: path.join(out, 'frame.png') });
await b.close();
console.log(path.join(out, 'frame.png'), W, H);
