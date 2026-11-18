// Turns generated originals into the committed files (task T099).
//   input : tools/raw-images/<id>.webp  (or .png/.jpg), one per image id in content/images.json
//   output: public/img/<id>-480.webp, -960.webp, -1600.webp, public/img/og.jpg (from hero-main), and the
//           dimensions written back into content/images.json ("files"). It never sets "approved" (the owner does).
// Usage: node optimize-images.mjs [id ...] [--raw <dir>] [--out <dir>] [--images <registry.json>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 ? path.resolve(argv[i + 1]) : fallback; };
const RAW = opt('--raw', path.join(HERE, 'raw-images'));
const OUT = opt('--out', path.join(ROOT, 'public', 'img'));
const REGISTRY = opt('--images', path.join(ROOT, 'content', 'images.json'));
const only = argv.filter((a, i) => !a.startsWith('--') && !['--raw', '--out', '--images'].includes(argv[i - 1]));

const WIDTHS = [480, 960, 1600];
const EXTRA_WIDTHS = { 'hero-main': [2000] }; // the hero spans the full container width, so it also gets a 2000 px file
const HERO_MOBILE_BUDGET_KB = 150;
const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const find = (id) => ['.webp', '.png', '.jpg', '.jpeg'].map((e) => path.join(RAW, id + e)).find((p) => fs.existsSync(p));
let problems = 0;

for (const id of Object.keys(registry)) {
  if (only.length && !only.includes(id)) continue;
  const src = find(id);
  if (!src) { console.log(`skip  ${id} (no original in ${RAW})`); continue; }
  const meta = await sharp(src).metadata();
  const files = {};
  const widths = [...WIDTHS, ...(EXTRA_WIDTHS[id] ?? [])];
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const file = path.join(OUT, `${id}-${w}.webp`);
    const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(file);
    files[String(w)] = { width: info.width, height: info.height, bytes: info.size };
  }
  const kb = Math.round(files['480'].bytes / 1024);
  const overBudget = id === 'hero-main' && kb > HERO_MOBILE_BUDGET_KB;
  if (overBudget) problems += 1;
  console.log(`${overBudget ? 'WARN ' : 'ok   '} ${id}: ${widths.map((w) => `${files[w].width}x${files[w].height} (${Math.round(files[w].bytes / 1024)} KB)`).join(', ')}${overBudget ? `  hero 480 px file is over ${HERO_MOBILE_BUDGET_KB} KB` : ''}`);
  registry[id].files = Object.fromEntries(Object.entries(files).map(([w, f]) => [w, { width: f.width, height: f.height }]));
  registry[id].ratio = `${files['960'].width} / ${files['960'].height}`;

  if (id === 'hero-main') {
    const og = path.join(OUT, 'og.jpg');
    await sharp(src).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }).toFile(og);
    console.log(`ok    og.jpg 1200x630 (${Math.round(fs.statSync(og).size / 1024)} KB)`);
  }
}

fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
console.log('\nregistry updated; "approved" is unchanged: review each image against the constitution, then set it to true.');
if (problems) process.exit(1);
