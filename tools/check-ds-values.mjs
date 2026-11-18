// Fails on hard-coded colours, font families and radii in design-system and site CSS (constitution Principle I).
// tokens.css is the source of values and is excluded. The allow-list records pre-existing exceptions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  path.join(ROOT, 'Intello Design System', 'components', 'bundle.css'),
  path.join(ROOT, 'public', 'css', 'fonts.css'),
  ...(fs.existsSync(path.join(ROOT, 'public', 'css')) ? fs.readdirSync(path.join(ROOT, 'public', 'css')).filter((f) => f.endsWith('.css') && f !== 'fonts.css').map((f) => path.join(ROOT, 'public', 'css', f)) : []),
].filter((f) => fs.existsSync(f));

// Pre-existing exceptions in the design system itself (recorded in the constitution quality gates).
const ALLOWED_COLOURS = new Set(['#4a4a68', '#c9c9d6']);
const problems = [];

for (const file of FILES) {
  const isFonts = file.endsWith('fonts.css');
  const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  css.split('\n').forEach((line, i) => {
    const where = `${path.relative(ROOT, file)}:${i + 1}`;
    if (/^\s*@import/.test(line)) { if (!isFonts && /googleapis/.test(line)) return; return; }
    if (/^\s*@font-face|^\s*src:|^\s*font-(family|weight|style|display):|^\s*unicode-range:/.test(line) && isFonts) return;
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      if (!ALLOWED_COLOURS.has(m[0].toLowerCase())) problems.push(`${where} hard-coded colour ${m[0]}`);
    }
    if (/\b(rgba?|hsla?)\(/.test(line)) problems.push(`${where} hard-coded colour function`);
    for (const m of line.matchAll(/font-family:\s*([^;}]+)/g)) {
      if (!/^\s*(var\(|inherit)/.test(m[1])) problems.push(`${where} hard-coded font-family ${m[1].trim()}`);
    }
    for (const m of line.matchAll(/border-radius:\s*([^;}]+)/g)) {
      if (!/^\s*(var\(|inherit|0\b|50%)/.test(m[1])) problems.push(`${where} hard-coded radius ${m[1].trim()}`);
    }
  });
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} hard-coded value(s) found.`);
  process.exit(1);
}
console.log(`check-ds-values: ${FILES.length} file(s) clean`);
