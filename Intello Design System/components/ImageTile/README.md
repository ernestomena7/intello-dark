Rounded photo tile. Grayscale by default; pass `color` for photographs in the muted brand palette (the website does).

- Props: `src`, `alt`, `ratio` (CSS aspect-ratio, default `4 / 5`), `height`, `color` (keep the picture's colour: muted-palette photographs and UI screenshots).
- Without `src` it renders an art-direction slot: paper well, a line `icon`, and the `alt` text as a caption describing the photo to shoot or source.

**Responsive images (added for the website).** Props `srcSet` and `sizes` give the browser several files; `imageWidth` and `imageHeight` are the picture's pixel size and are always emitted, so the page never shifts while loading (`height` remains the CSS height of the tile). `priority` marks the one above-the-fold image: it loads eagerly with high fetch priority; every other image loads lazily and decodes asynchronously. `ServiceCard` accepts the same image fields in an object (`image: { src, srcSet, sizes, imageWidth, imageHeight, alt }`), and `Hero` places a supplied `media` photograph behind the tracking card and chip.
