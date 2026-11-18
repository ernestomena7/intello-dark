The homepage hero: copy left, visual right, on the bare page ground.

- Props: `eyebrow`, `title`, `titleAccent` (Light Italic, muted), `titleMuted`, `lede`, `cta` {label, href}, `video` {label, href}, `features` [{icon, text}] (exactly four), and for the visual either `media` (your own node, e.g. a monochrome photo) or `tracking` (TrackingCard props) + `stat` (StatChip props) over the navy route panel.
- Follow it with a `Section overlap` so the white container rides up over the hero bottom.

**With a photograph (`media`).** The picture spans the whole hero (full container width, rounded `radius-xl`); the copy sits on its pale side and the tracking card and chip float over the picture at the right. Choose a picture with an empty, bright area on the left for the copy. Below 900px the copy comes first and the picture follows as its own rounded block.

**Immersive variant (`variant="immersive"`, needs `media`).** Full-bleed photograph under the navigation (use with a transparent dark top bar), copy in white with the accent in yellow on the dark side of the picture, a yellow call to action, and the `features` (each `{icon, title, text}`) shown as a dark glass panel across the bottom. The shipment card and chip float on the right at 900px and above and are hidden on small screens. Choose a dusk or night photograph with a dark, quiet left side.
