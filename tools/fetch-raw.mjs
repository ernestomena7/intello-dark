// Downloads generated originals into tools/raw-images/ and builds a contact sheet for review (tools/out/contact-sheet.png).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, 'raw-images');
const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ar1DbTwuaQ8Eok85APYW7CZXmG/';
// image id -> file name returned by Higgsfield (2026-11-18 colour batch)
const FILES = {
  'hero-main': 'hf_20261118_001904_cdecac18-b95b-491c-9940-1cfd7498cddb.webp',
  'home-about-a': 'hf_20261118_001906_e082e058-a8f6-4b83-83d4-888072f989e8.webp',
  'home-about-b': 'hf_20261118_001907_746aa83f-efb1-4ea7-a40f-67fe73bf3a26.webp',
  'service-back-office-card': 'hf_20261118_001907_4fbeeaac-7321-4440-abc7-015537e4c45a.webp',
  'service-tracking-card': 'hf_20261118_001906_ff608689-f9b8-4b76-9866-903db132ffcc.webp',
  'service-technology-card': 'hf_20261118_001906_ca43e151-091e-44d0-a39f-b228ee9d2c6a.webp',
  'service-ai-analytics-card': 'hf_20261118_001907_17f8028a-b8ba-4896-b950-ccd2ab80fc4c.webp',
  'service-back-office': 'hf_20261118_001907_1a40c57d-59d0-43c0-a16b-af825c712529.webp',
  'service-tracking': 'hf_20261118_001906_7a2d76f7-f1c3-479b-8e44-004e0594a214.webp',
  'service-technology': 'hf_20261118_001906_53721f02-ab6b-4d91-bc34-d362cc214aa8.webp',
  'service-ai-analytics': 'hf_20261118_001907_3efb7311-084a-435c-af39-0205433b47ad.webp',
  'technology-1': 'hf_20261118_001908_7f7ba3c0-3fc4-4820-b278-2a06a8730a3c.webp',
  'technology-2': 'hf_20261118_002029_bcbb7958-f385-4ec0-9c38-bad78f74055e.webp',
  'about-1': 'hf_20261118_001915_05840c17-ce98-437c-b781-016283f53c3c.webp',
  'about-2': 'hf_20261118_001915_23c544f2-ee3f-4008-8293-065aa25605de.webp',
  'contact-hero': 'hf_20261118_001916_d5e024e0-3b32-4c5b-8226-bf47a157eba5.webp'
};
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });

for (const [id, name] of Object.entries(FILES)) {
  const dest = path.join(RAW, `${id}.webp`);
  if (!fs.existsSync(dest)) {
    const res = await fetch(BASE + name);
    if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
}

// Contact sheets of 4 images each (3 columns x ... ) so each can be inspected at a readable size.
const ids = Object.keys(FILES);
const CELL = 600;
const per = 6;
for (let s = 0; s * per < ids.length; s += 1) {
  const group = ids.slice(s * per, s * per + per);
  const tiles = await Promise.all(group.map(async (id) => ({
    input: await sharp(path.join(RAW, `${id}.webp`)).resize(CELL, CELL, { fit: 'cover' }).png().toBuffer(),
  })));
  const composite = tiles.map((t, i) => ({ ...t, left: (i % 3) * CELL, top: Math.floor(i / 3) * CELL }));
  await sharp({ create: { width: CELL * 3, height: CELL * 2, channels: 3, background: '#ffffff' } })
    .composite(composite).png().toFile(path.join(HERE, 'out', `contact-sheet-${s + 1}.png`));
  console.log(`contact-sheet-${s + 1}.png: ${group.join(', ')}`);
}
