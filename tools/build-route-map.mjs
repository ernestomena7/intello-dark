// Builds the stylised route map used by the home hero (dev-only, run once: `node build-route-map.mjs`).
// Output 1: public/img/route-map.svg   – the continents drawn as a dot grid (static, cacheable image).
// Output 2: content/route-map.json     – the same projection's hubs and route arcs, rendered inline by the
//                                         design system RouteMap component (moving dots, labels, no client script).
// Data: Intello, "Cultura y capacidades" (Nov 2026), page 08 – origins, destinations and highest-volume routes 2025.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = (await import('node:module')).createRequire(import.meta.url);
const land110 = require('world-atlas/land-110m.json');

const W = 1600;
// Pacific-centred, true geography: China on the left edge, the Pacific at its real width, the Americas on the right.
// The frame stops in the Atlantic, so Europe and Africa are left out.
const projection = geoNaturalEarth1().rotate([150, 0]).scale(W / 5.6).translate([W / 2, W / 4.2]);
const P = (lon, lat) => projection([lon, lat]).map((n) => Math.round(n * 10) / 10);
const STEP = 5, R = 1.25;

// Crop (same framing as the client's map, document page 08): from Indochina to the mid Atlantic,
// from northern Alaska to Patagonia. Europe and Africa stay out of frame.
const [x0] = P(93, 0), [x1] = P(-25, 0), [, y0] = P(-150, 72), [, y1] = P(-150, -44);
const vb = { x: Math.round(x0), y: Math.round(y0), w: Math.round(x1 - x0), h: Math.round(y1 - y0) };

const land = feature(land110, land110.objects.land);
const pathGen = geoPath(projection);
const round = (d) => d.replace(/(\d+\.\d)\d+/g, '$1');
const landD = round(pathGen(land));

// Countries Intello connects, highlighted like the client's map: origin, destination, or both (ISO 3166 numeric ids).
const countries110 = require('world-atlas/countries-110m.json');
const COUNTRY_KIND = {
  o: ['156', '484', '840', '076', '591', '170', '764', '704', '458', '410', '360'],
  d: ['222', '340', '558', '328', '084'],
  b: ['218', '188', '388', '320', '780'],
};
const countries = feature(countries110, countries110.objects.countries).features;
const kindPath = (kind) => round(pathGen({ type: 'FeatureCollection', features: countries.filter((c) => COUNTRY_KIND[kind].includes(c.id)) }));
const KIND_COLOUR = { o: '#9db8e0', d: '#f6e71a', b: '#f2f1ef' };

const landSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" width="${vb.w}" height="${vb.h}">
<defs><pattern id="d" width="${STEP}" height="${STEP}" patternUnits="userSpaceOnUse"><circle cx="${STEP / 2}" cy="${STEP / 2}" r="${R}" fill="#4d72a6" fill-opacity=".7"/></pattern>
${['o', 'd', 'b'].map((k) => `<pattern id="p${k}" width="${STEP}" height="${STEP}" patternUnits="userSpaceOnUse"><circle cx="${STEP / 2}" cy="${STEP / 2}" r="${R + 0.25}" fill="${KIND_COLOUR[k]}" fill-opacity="${k === 'd' ? 0.8 : 0.9}"/></pattern><clipPath id="c${k}"><path d="${kindPath(k)}"/></clipPath>`).join('\n')}
<clipPath id="c"><path d="${landD}"/></clipPath></defs>
<rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="url(#d)" clip-path="url(#c)"/>
${['o', 'd', 'b'].map((k) => `<rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="url(#p${k})" clip-path="url(#c${k})"/>`).join('\n')}
</svg>
`;
fs.writeFileSync(path.join(ROOT, 'public', 'img', 'route-map.svg'), landSvg);

// kind: o = origin, d = destination, b = both. share: % of origin volume (origins) – document page 08.
const HUBS = {
  china: { lon: 113.3, lat: 23.1, kind: 'o', es: 'China', en: 'China', share: '36.3%' },
  mexico: { lon: -99.1, lat: 19.4, kind: 'o', es: 'México', en: 'Mexico', share: '19.7%' },
  usa: { lon: -84, lat: 31, kind: 'o', es: 'Estados Unidos', en: 'United States', share: '17.4%' },
  brazil: { lon: -46.3, lat: -23.9, kind: 'o', es: 'Brasil', en: 'Brazil', share: '7.2%' },
  panama: { lon: -79.5, lat: 9, kind: 'o', es: 'Panamá', en: 'Panama', share: '5.7%' },
  colombia: { lon: -74.1, lat: 4.7, kind: 'o', es: 'Colombia', en: 'Colombia', share: '4.4%' },
  thailand: { lon: 100.5, lat: 13.7, kind: 'o', es: 'Tailandia', en: 'Thailand', share: '2.6%' },
  vietnam: { lon: 106.7, lat: 10.8, kind: 'o', es: 'Vietnam', en: 'Vietnam', share: '2.1%' },
  malaysia: { lon: 101.4, lat: 3, kind: 'o' },
  korea: { lon: 129, lat: 35.1, kind: 'o' },
  ecuador: { lon: -79.9, lat: -2.2, kind: 'b' },
  costarica: { lon: -84.1, lat: 9.9, kind: 'b', es: 'Costa Rica', en: 'Costa Rica' },
  jamaica: { lon: -76.8, lat: 18, kind: 'b' },
  guatemala: { lon: -90.5, lat: 14.6, kind: 'b' },
  trinidad: { lon: -61.5, lat: 10.6, kind: 'b' },
  elsalvador: { lon: -89.2, lat: 13.7, kind: 'd' },
  honduras: { lon: -87.2, lat: 14.6, kind: 'd' },
  nicaragua: { lon: -86.3, lat: 12.1, kind: 'd' },
  guyana: { lon: -58.2, lat: 6.8, kind: 'd' },
  belize: { lon: -88.5, lat: 17.3, kind: 'd' },
  stlucia: { lon: -61, lat: 13.9, kind: 'd' },
  barbados: { lon: -59.6, lat: 13.1, kind: 'd' },
  curacao: { lon: -69, lat: 12.1, kind: 'd' },
  antigua: { lon: -61.8, lat: 17.1, kind: 'd' },
};

// Highest-volume routes (subset of the document's map). moving: carries an animated shipment dot.
const ROUTES = [
  ['china', 'costarica', 3.2, true], ['china', 'nicaragua', 2.4], ['china', 'guatemala', 2.3, true], ['china', 'elsalvador', 2.2],
  ['china', 'honduras', 2.2], ['china', 'jamaica', 2], ['china', 'trinidad', 2, true], ['china', 'ecuador', 1.5],
  ['mexico', 'jamaica', 2.1, true], ['mexico', 'costarica', 2], ['mexico', 'trinidad', 1.9], ['mexico', 'honduras', 1.8],
  ['usa', 'costarica', 2.05, true], ['usa', 'trinidad', 2], ['usa', 'jamaica', 1.9], ['usa', 'guyana', 1.5],
  ['brazil', 'honduras', 1.75, true], ['brazil', 'guatemala', 1.6], ['colombia', 'guatemala', 1.45], ['panama', 'stlucia', 1.25],
  ['thailand', 'elsalvador', 1.35], ['vietnam', 'jamaica', 1.25, true],
];

const hubs = Object.entries(HUBS).map(([id, h]) => {
  const [x, y] = P(h.lon, h.lat);
  return { id, x, y, kind: h.kind, ...(h.es ? { label: { es: h.es, en: h.en } } : {}), ...(h.share ? { share: h.share } : {}) };
});
const at = Object.fromEntries(hubs.map((h) => [h.id, h]));

const routes = ROUTES.map(([a, b, weight, moving], i) => {
  const A = at[a], B = at[b];
  const dx = B.x - A.x, dy = B.y - A.y, dist = Math.hypot(dx, dy);
  // Control point: midpoint lifted perpendicular to the chord (always bowing north).
  let nx = dy / dist, ny = -dx / dist;
  if (ny > 0) { nx = -nx; ny = -ny; }
  // Gentle arcs, as on the client's map: lift grows with distance.
  const lift = Math.min(dist * 0.3, 240);
  const cx = (A.x + B.x) / 2 + nx * lift, cy = (A.y + B.y) / 2 + ny * lift;
  const f = (n) => Math.round(n * 10) / 10;
  return { from: a, to: b, weight, d: `M${A.x} ${A.y}Q${f(cx)} ${f(cy)} ${B.x} ${B.y}`, ...(moving ? { moving: true, duration: f(4 + dist / 160), delay: f((i % 5) * 1.3) } : {}) };
});

const out = { source: 'Intello, Cultura y capacidades (Nov 2026), p. 08', viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, width: vb.w, height: vb.h, // Versioned URL: the land image changes whenever the map is rebuilt, so browsers never pair an old image with new routes.
  land: '/img/route-map.svg?v=' + crypto.createHash('sha256').update(landSvg).digest('hex').slice(0, 10), hubs, routes };
fs.writeFileSync(path.join(ROOT, 'content', 'route-map.json'), JSON.stringify(out, null, 2) + '\n');
console.log('viewBox', out.viewBox, 'land bytes', Buffer.byteLength(landSvg), 'hubs', hubs.length, 'routes', routes.length);
