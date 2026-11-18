Intello provides cargo monitoring and AI-supported business intelligence for logistics companies, plus technology services and back office support. It is a technology and data provider, not a logistics or transport company. The website should feel like the clarity it sells — calm, precise, light, with everything in its place. Colours, type and logo come from the *Manual de Identidad Corporativa 2024*; the page structure, mood and components follow a clean, premium logistics-site reference: a soft grey page, oversized two-tone headlines, white rounded panels, pill buttons with arrows and quiet line icons.

## Content fundamentals

- **Language.** The site is bilingual: Spanish (Latin America) by default, English via the `LanguageToggle` in the nav. Spanish uses *tú* for the reader ("Impulsamos **tu** logística") and *nosotros* for Intello; English uses *you* / *we* ("We power your logistics *with intelligence*"). Translate meaning, not words, and keep each label as short as the Spanish one so layouts hold in both.
- **Tone.** Confident and operational, never hype. Say what gets done: "Conciliación de guías", "Alertas al cliente final". No exclamation marks, no emoji.
- **Casing.** Sentence case everywhere — headlines, buttons, nav. Eyebrows are written in sentence case and uppercased by CSS.
- **Headlines** are short and split in two tones: the claim in `ink`, the qualifier in `ink-subtle`, optionally in Light Italic (`display-accent`): "Impulsamos tu logística *con inteligencia*", "Operación logística completa *para tu empresa*".
- **Buttons** start with a verb and are two or three words: "Solicitar demo", "Rastrear envío", "Conoce más de nosotros". Every button and section link carries the arrow.
- **AI** is a capability, not a mascot: name what it does ("alertas por IA", "pronósticos de demanda"). Never robots, brains or sparkles as decoration.
- **Numbers** only when they are real and sourced. Never invent client counts or percentages for layout; use a capability ("24/7") instead.

## Visual foundations

### Colour

- The three brand colours are fixed: `yellow` #f6e71a, `navy` #2d2d45, `blue` #4d72a6. (The manual prints the blue's RGB as 166, 114, 77 — that is the hex reversed; #4d72a6 = 77, 114, 166 is correct.)
- The site is **light and mostly neutral**: `surface-page` ground, `surface-card` panels, `surface-paper` wells. Brand colour is spent on purpose: `navy` for the primary action and dark panels, `yellow` for one accent per view (secondary CTA, highlight dot, the live point on a route), `blue` for status and links.
- Text is navy, never black: `ink` for titles and body, `ink-muted` for ledes, captions and nav, `ink-subtle` only for the muted half of a headline 24px+. Links use `link`.
- Yellow is never text or a thin icon on light surfaces (it fails contrast). Text on yellow is `on-yellow`; on navy `on-navy`; on blue `on-blue`.
- Dark theme: `surface-*` go navy, `action` turns yellow with navy text, and the logo switches to the manual's "on navy" version.
- Status always pairs colour with a word and an icon (`StatusBadge`): blue *En tránsito*, `success` *Entregado*, yellow *Demorado*, `danger` *Incidencia*.

### Type

- Corporate typeface: **Gotham** — Bold for headlines and labels, Light Italic for accent words, Book for running text. Gotham is a licensed Hoefler&Co font: add the licensed web files to `fonts/` and list them in `tokens.json` `type.fonts`. Until then the `sans` stack falls back to **Montserrat** (Google Fonts, loaded by `components/bundle.css`), the face the manual itself uses for body copy.
- Scale: `display-xl` 76/76 for the hero (−0.03em tracking, max four short lines), `h1` 40 for section titles, `h2` 30, `h3` 20 for cards, `lede` 18, `body` 16, `body-sm` 14, `caption` 12, `eyebrow` 12 bold uppercase +0.08em, `button` 14 bold.
- Headlines are tight (line-height ≈ 1.0–1.15) and balanced; body copy is roomy (1.6) and capped at ~34em.

### Space and layout

- Content sits in a `container-max` (1400px) column with `space-6` side padding; nav is `nav-height` 80px.
- **Page rhythm (homepage):**
  1. `NavBar` — logo left, links centred with a dot under the active one, the ES/EN `LanguageToggle`, phone + hours and the primary CTA right.
  2. `Hero` on the bare page ground — eyebrow, two-tone display headline, lede, primary pill + round play button, then a row of four `FeatureItem`s. The right half carries the visual: a navy panel with a dotted route, a floating `TrackingCard` and a `StatChip`.
  3. One big white `Section` (`radius-xl`) that **overlaps the hero bottom** by `space-9` and holds the rest: `AboutBlock`, a hairline, `SectionHeader` + four `ServiceCard`s.
- Spacing steps: `space-3` icon-to-text, `space-4` between buttons/cards, `space-5` card padding and gutters, `space-7` section-container padding, `space-8`/`space-9` between bands.

### Shape, borders and elevation

- Buttons and icon buttons are **always pills or circles** (`radius-pill`); nothing interactive is square.
- Cards `radius-lg` (20px), inner wells and images `radius-md`, the overlap container `radius-xl` (32px), small badges `radius-sm`.
- Cards on white are separated by a `line` hairline; cards that float over imagery use `shadow-float`. No coloured left borders, no gradients.

### Imagery

- Photography is **colour in a muted palette** close to the brand (updated 2026-11-18; it was monochrome before): high-key, soft daylight, slightly desaturated deep navy, steel blue and warm light greys and off-whites, at most a small soft yellow accent. No bright, saturated or neon colours. Subjects: warehouses, ports, container ships, trucks, operations floors, people at dashboards. `ImageTile` still applies grayscale unless you pass `color`, so the website passes `color` for its photographs; keep the grayscale default for any picture that is not in the brand palette.
- The brand colours still lead: a yellow point or a navy card floating over a picture reads as the accent, so keep the photograph itself quiet.
- Until real photos exist, `ImageTile` renders an art-direction slot (paper well, line icon, a caption saying what the photo should show). Never ship with stock 3D globes.

### Motion and states

- Hover: primary darkens/brightens slightly, outline borders go to `ink`, arrows nudge 3px right, cards lift to `shadow-float`. 150ms ease.
- Focus: a 2px solid `focus-ring` outline with 2px offset on every interactive element.

## Logo

- Use the files in `assets/Logos`. The manual's master lockup is **stacked** (bulb-with-growth-arrow mark above the INTELLO wordmark), built on a 7x × 9x grid with a **2x clear space** all round. Minimum width: **200px on screen**, 5cm in print.
- Approved colour versions: on navy → yellow mark + blue wordmark (`intello-logo-on-navy.svg`); on blue → yellow mark + navy wordmark (`intello-logo-on-blue.svg`); on yellow or light → all navy (`intello-logo-navy.svg`) or all blue on light (`intello-logo-blue.svg`); black and white versions when colour isn't possible.
- Don't: recolour outside these versions, distort, change the wordmark typeface, or resize the mark relative to the wordmark.
- **Horizontal lockup (brand-approved):** the nav needs a short logo, so `Logo layout="horizontal"` places the real mark beside the real wordmark (wordmark at 0.42 × mark height). The manual does not define it; the client approved it for the website and brand use. `layout="mark"` is the symbol alone (favicons, app icons, avatars).

## Iconography

- Line icons from **Lucide** (ISC licence), 24px grid, stroke 1.5 (2 in buttons), round caps — they match the reference's thin outline icons. The brand manual defines no icon set. Files in `assets/Icons`; in React use `Icon name="…"`, which inherits `currentColor`.
- Icons are `ink` on light, `on-navy` on navy; inside feature rows 28px, in buttons 18px, as service-card illustrations 56px at stroke 1.1.

## Using the components

`components/bundle.js` exposes `window.Intello` (React 18). Load `tokens.css`, `components/bundle.css`, React, ReactDOM, then the bundle; wrap pages in an element with `data-theme="light"` or `"dark"`. All classes are prefixed `itl-`. See each component's guidelines, and **HomePage** for the full reference layout assembled from them.

### Website additions

Components added so a full marketing website can be built from the design system alone (each has a folder with a README and a preview in Spanish and English): `SkipLink`, `Footer`, `CtaBand`, `PageHero`, `ServiceSection`, `Steps`, `Accordion`, `Prose`, and the form set `Field`, `TextInput`, `Textarea`, `Select`, `FormNotice`, `FormErrorSummary`, `Honeypot`. Existing components gained: `NavBar` mobile menu (`menuLabel`), `ImageTile` and `ServiceCard` responsive images, `Hero` photograph layering, and `LanguageToggle` link `rel`. Utilities: `.itl-visually-hidden`, `.itl-main` (page column that spaces sections and hosts the overlapping panel), `.itl-form`, `.itl-form-row`, `.itl-duo` (two columns, one below 900px). Icons: `chevron-down`, `mail`.
