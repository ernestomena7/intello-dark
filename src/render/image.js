// Turns an image id from content/images.json into design system props.
// Until an image is approved the page shows the ImageTile art-direction slot (constitution I).
import { image } from '../i18n/content.js';
import { publicUrl } from '../assets.js';


function files(id, entry) {
  // The widths come from the registry, so one image (the wide hero) can have an extra size.
  const WIDTHS = Object.keys(entry.files ?? {}).map(Number).sort((a, b) => a - b);
  const src = (w) => publicUrl(`/img/${id}-${w}.webp`);
  const mid = entry.files?.['960'];
  return {
    src: src(960),
    srcSet: WIDTHS.map((w) => `${src(w)} ${w}w`).join(', '),
    imageWidth: mid?.width,
    imageHeight: mid?.height,
  };
}

// ImageTile props. Optional ratio/height are only included when given, so a parent's defaults still apply.
export function imageProps(lang, id, { priority = false, sizes = '100vw', ratio, height, icon } = {}) {
  const entry = image(id);
  const props = { alt: entry.alt[lang] };
  if (ratio !== undefined) props.ratio = ratio; else if (entry.approved) props.ratio = entry.ratio;
  if (height !== undefined) props.height = height;
  if (!entry.approved) {
    if (icon) props.icon = icon;
    return props;
  }
  // Approved photographs are in the muted brand palette, so the tile keeps their colour.
  return { ...props, ...files(id, entry), sizes, priority, color: true };
}

// ServiceCard image: undefined (the card shows its icon) until approved.
export function cardImage(lang, id, sizes = '(min-width: 900px) 25vw, 50vw') {
  const entry = image(id);
  if (!entry.approved) return undefined;
  const f = files(id, entry);
  return { src: f.src, srcSet: f.srcSet, sizes, imageWidth: f.imageWidth, imageHeight: f.imageHeight, alt: entry.alt[lang] };
}
