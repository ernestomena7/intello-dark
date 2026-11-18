# Contract: Design System Additions

**Plan**: [../plan.md](../plan.md) | **Constitution**: Principle I ("a pattern with no matching component MUST be added to the design system first") and Development Workflow ("update the component, its README and its preview together")

The audit on 2026-11-17 found these gaps between what the spec needs and what `Intello Design System/` provides. Each addition is made in the design system folder, in the same style as the existing components: a component folder with `README.md` and `preview.html`, an entry in `components/bundle.js` and `components/bundle.css`, a type in `components/index.d.ts`, and a mention in `design-system.json`. All visual values use existing tokens; nothing may hard-code colours, sizes or radii.

**Common rules**
- Must render on the server with no browser (proven by the render test) and must not require JavaScript to work.
- Must be keyboard-operable with the 2 px `focus-ring`, and meet WCAG 2.1 AA in the light theme.
- Interactive elements keep the pill or circle shape rule; cards use `line` hairlines or `shadow-float`; no gradients.
- Previews show Spanish and English text so label length can be checked.

## Changes to existing components

| Component | Change | Reason |
|-----------|--------|--------|
| `NavBar` | Below 900 px, render a native `<details>` disclosure (summary button with an accessible name from a new `menuLabel` prop) containing the links, language toggle, phone, hours and call to action. Above 900 px, unchanged. | Constitution IV requires an accessible menu toggle that works without scripts; the current component collapses with no way to reopen. |
| `ImageTile` | Add `srcSet`, `sizes`, `imageWidth`, `imageHeight` and `priority` (the existing `height` prop is already the tile's CSS height, so pixel dimensions use the `image` prefix). `priority` renders `loading="eager"` and `fetchpriority="high"`; otherwise `loading="lazy"` and `decoding="async"`. Dimensions are always emitted when given. `ServiceCard` accepts the same fields in an `image` object, and `Hero` layers its tracking card and chip over a supplied `media` photograph. | Responsive images, no layout shift, fast hero (constitution IV, spec SC-008). |
| `LanguageToggle` | Done on 2026-11-17: link mode via `href` per language. | FR-028. |
| Icon set | Add `chevron-down` (accordion) and `mail` (contact), same Lucide style and stroke rules; add to `assets/Icons`, the bundle and `IconName`. | New components need them. |
| Utilities | Add `.itl-visually-hidden` (screen-reader-only text). | Skip link, honeypot, form announcements. |

## New components

| Component | Props (summary) | Notes |
|-----------|-----------------|-------|
| `SkipLink` | `href` (default `#main`), `children` | First focusable element; visible on focus only. |
| `Footer` | `columns[]` of `{heading, links[]}`, `contact` `{heading, phone, phoneHref, hours}`, `tagline`, `language` (LanguageToggle props), `legal` `{text, links[]}`, `logoTone` | Navy band; uses the approved on-navy logo; includes the language toggle (FR-004). |
| `CtaBand` | `title`, `titleAccent`, `body`, `cta`, `secondary?` | Closing call to action on navy (FR-012). Single yellow accent per view. |
| `PageHero` | `eyebrow`, `title`, `titleAccent`, `titleMuted`, `lede`, `cta?`, `media?` (ImageTile props) | Lighter hero for inner pages: no tracking card or capability row. |
| `ServiceSection` | `id`, `eyebrow`, `title`, `summary`, `deliverables[]`, `cta`, `image` (ImageTile props), `reverse?` | Services page sections (FR-014). Uses line icons for deliverables. |
| `Steps` | `items[]` of `{title, body}` | Numbered how-it-works list (About, Technology). |
| `Accordion` | `items[]` of `{id, question, answer}` where `answer` is a string or array of paragraphs | Native `<details>`/`<summary>`; works by keyboard without scripts (FR-017). |
| `Prose` | `children` | Readable measure and spacing for the privacy page; uses existing type tokens. |
| `Field` | `id`, `label`, `hint?`, `error?`, `required?`, `children` | Wraps a control with a visible label, hint and error; wires `aria-describedby` and `aria-invalid`. |
| `TextInput` | `id`, `name`, `type`, `value?`, `autoComplete?`, `required?`, `maxLength?`, `invalid?` | Pill-shaped per the shape rule; 2 px focus ring. |
| `Textarea` | same as `TextInput` plus `rows` | `radius-md` (a multi-line control is not a pill). |
| `Select` | `id`, `name`, `options[]` of `{value, label}`, `value?`, `invalid?` | Native `<select>`, styled. |
| `FormNotice` | `variant` (`success`, `error`, `info`), `title`, `children`, `role?` | Colour paired with a word and an icon; never colour alone. |
| `FormErrorSummary` | `title`, `errors[]` of `{id, message}` | `role="alert"`; each item links to its field. |
| `Honeypot` | `name` | Visually hidden, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`. |

## Acceptance for each addition

1. A `README.md` stating purpose, props and do/don't, and a `preview.html` with both languages.
2. Renders under `renderToStaticMarkup` with no browser, covered by an automated smoke test.
3. Passes the CSS lint and the "no hard-coded values" check.
4. Passes an axe check in its preview, with zero serious or critical violations.
5. Typed in `index.d.ts` and listed in `design-system.json`.
6. Referenced from the design system README's component list.

## Also required before release

- Self-hosted Montserrat files and `@font-face` rules (site-level, `public/css/fonts.css`), and removal of the `@import` of Google Fonts from what the site serves (the design system file itself stays unchanged, the server strips the line; a later design system change should remove it at source).
- Update the design system README's Imagery section when real photography replaces generated images.
