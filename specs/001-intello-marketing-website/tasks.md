# Tasks: Intello Bilingual Marketing Website

**Input**: Design documents in `specs/001-intello-marketing-website/`
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md); governed by `.specify/memory/constitution.md` v1.3.1

**Tests**: Included. The constitution's quality gates and the contracts require automated tests (content parity, language negotiation, routing, headers, form behaviour with a mocked mail transport, design system rendering, accessibility). Tests use Node's built-in `node:test` in the root package; browser-level checks live in the dev-only `tools/` package.

**Organization**: Setup, then Foundational (design system additions and application skeleton), then one phase per user story in priority order, then imagery and release.

## Format: `- [ ] T### [P?] [Story?] Description with file path`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[US#]**: the user story from [spec.md](spec.md) the task serves
- Paths are relative to the repository root `d:\Intello\Website\Intello`. The design system folder is `Intello Design System/` (with spaces; quote it in commands).
- Every task that touches the design system updates its component folder `README.md` and `preview.html` (Spanish and English text), `components/bundle.js`, `components/bundle.css` and `components/index.d.ts` together (constitution: Development Workflow).
- Because `bundle.js`, `bundle.css` and `index.d.ts` are single shared files, design system tasks are **not** marked [P] with each other.

## Standing rules for every task (from the constitution)

- Never hard-code a colour, size, radius or font in site code; use tokens. Never fork the design system's components; add to it.
- All user-facing text lives in `content/{es,en}/*.json`; no literal copy in pages or components. Sentence case, no exclamation marks or emoji, verb-first buttons.
- Never log or render secrets, visitor names, emails, phones, companies or message text.
- No client-side JavaScript and no third-party requests anywhere in v1.
- Do not run Higgsfield generation without the owner's approval of the batch (Phase 8).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository skeleton, tooling and the hosting spike that settles the unverified Hostinger facts.

- [X] T001 Create the folder skeleton from [plan.md](plan.md) "Source Code": `src/{i18n,ds,render,pages,routes,contact,security}/`, `content/{es,en}/`, `public/{css,fonts,img}/`, `tests/{unit,integration}/`, `tools/` (add a `.gitkeep` in each empty folder).
- [X] T002 Create root `package.json` (`"type": "module"`, `"engines": {"node": ">=24 <25"}`, scripts `"start": "node server.js"` and `"test": "node --test \"tests/**/*.test.js\""` (a quoted glob, because Node 21 and later treat positional arguments as globs and a bare directory may not be found; confirm on Node 24 by running it once with a placeholder test)) with exactly these 7 production dependencies and no dev dependencies, pinned to the versions verified in research.md: `express@5.3.0`, `react@18.3.1`, `react-dom@18.3.1`, `htm@3.1.1`, `nodemailer@10.6.0`, `helmet@8.3.0`, `express-rate-limit@8.7.4`; run `npm install` and commit `package-lock.json`.
- [X] T003 [P] Create `.gitignore` containing `node_modules/`, `.env`, `tools/node_modules/`, `tools/out/`, `tools/raw-images/` and OS/editor files.
- [X] T004 [P] Create `.env.example` listing every variable in [contracts/environment.md](contracts/environment.md) (`NODE_ENV`, `PORT`, `SITE_URL`, `TRUST_PROXY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FROM`, `CONTACT_TO`, `FORM_TOKEN_SECRET`, `ALLOW_PLACEHOLDERS`, `LOG_LEVEL`) with a one-line comment each and no real values.
- [X] T005 [P] Create the dev-only tooling package `tools/package.json` (own dependencies: `playwright`, `@axe-core/playwright`, `stylelint`, `sharp`, `lighthouse`, `@fontsource/montserrat`) and `tools/stylelint.config.mjs` forbidding hard-coded colours, font families, px radii and `!important` in site CSS and design system additions (allow only `var(--…)` token references); run `npm install` inside `tools/` and `npx playwright install chromium`.
- [X] T006 Create the throwaway spike app in `spike/server.js` + `spike/package.json` (not part of the product; delete after T008): listens on `process.env.PORT`, and exposes `/healthz`, `/spike/env` (Node version, whether `PORT` is set, never secret values), `/spike/headers` (echoes `X-Forwarded-*`, `Host`, `Accept-Language`, `Cookie` presence, request protocol), `/spike/redirect` (302 with `Cache-Control: no-store` and `Vary: Accept-Language, Cookie`, redirecting by `Accept-Language`), `/spike/smtp` (Nodemailer `transporter.verify()` against `SMTP_HOST` on 465 secure and 587 STARTTLS, reporting only success or the error code), `/spike/big` (a 200 KB text body, to see `Content-Encoding`), and logs a start-up timestamp.
- [ ] T007 **Owner action (deferred)**: deploy `spike/` to the Hostinger Web App on a **temporary domain only, never the production domain** (the spike endpoints are public; Node 24, entry file `server.js`, set `SMTP_*` as hPanel variables) and send the results of S1–S8 from [plan.md](plan.md) Phase 0: S1 port provided, S2 outbound SMTP on 465/587, S3 proxy headers and `TRUST_PROXY` hop count, S4 cold-start time after an idle stop, S5 redirect caching vs `Accept-Language`/cookie, S6 compression, S7 Node 24 selectable and `npm install` time, S8 HTTPS certificate and the app seeing HTTPS. Blocks T035–T052 (application skeleton), not the design system work. **Deferred by the owner on 2026-11-17: build and test locally first; run this spike at the first Hostinger deploy, before T110.** Until then the app reads port, proxy hops and SMTP only from environment variables and assumes nothing about the host.
- [ ] T008 (deferred with T007) Record the spike results in a new "Spike results (2026-…)" section of `specs/001-intello-marketing-website/research.md`, replacing every `UNVERIFIED` marker with the measured fact or a recorded fallback decision (for example SMTP blocked → alternative mail path), set the confirmed `TRUST_PROXY` value in `.env.example` comments; (decided early: `compression` 1.8.2 was added during implementation for the LCP target, so S6 now only confirms there is no double compression problem) if S6 shows responses are not compressed, decide whether to add the `compression` package (an 8th production dependency that needs a Principle VI justification in `plan.md`) or accept uncompressed responses against the Lighthouse targets, and record the decision; then delete `spike/`.

**Checkpoint**: Hosting facts known; skeleton can begin. Design system additions (Phase 2A) may start earlier, in parallel with T007.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Everything every user story needs: a design system that can express the site, and an app that serves it in both languages.

**⚠️ CRITICAL**: No user story work starts until this phase is complete.

### 2A. Design system additions ([contracts/design-system-additions.md](contracts/design-system-additions.md))

- [X] T009 Create `src/ds/load.js`: read `Intello Design System/components/bundle.js`, evaluate it in a `node:vm` context exposing only `window = { React }`, return `window.Intello` (the component map), and export `renderToHtml(element)` using `react-dom/server` `renderToStaticMarkup`; throw a clear error if any expected component is missing. Must load in well under 100 ms.
- [X] T010 Create `tests/unit/ds-render.test.js`: for every component name exported by `src/ds/load.js`, render it with minimal valid props under `renderToStaticMarkup` and assert non-empty output and no throw; also assert no output contains `style=` values with literal hex colours. Add a table entry per component as T011–T029 land, so each addition is proven to render with no browser.
- [X] T011 Update `NavBar` in `Intello Design System/components/bundle.js`/`bundle.css`/`index.d.ts` and `components/NavBar/{README.md,preview.html}`: below 900 px render a native `<details>` disclosure whose `<summary>` is a button named by a new `menuLabel` prop, containing the links, language toggle, phone, hours and call to action; at 900 px and above the layout is unchanged. No script required. Add a render test row in T010.
- [X] T012 Update `ImageTile` (same files plus `components/ImageTile/{README.md,preview.html}`): add `srcSet`, `sizes`, `width`, `height` and `priority`; `priority` renders `loading="eager"` and `fetchPriority="high"`, otherwise `loading="lazy"` and `decoding="async"`; `width` and `height` are always emitted when given; the existing art-direction slot (no `src`) keeps working unchanged. Add a render test row in T010.
- [X] T013 Add icons `chevron-down` and `mail` to `Intello Design System/assets/Icons/` (Lucide, same stroke width and 24 px grid as the existing icons), register them in the icon map in `components/bundle.js`, the `IconName` union in `components/index.d.ts`, and `assets/Icons/README.md`.
- [X] T014 Add the utility class `.itl-visually-hidden` (screen-reader-only text, token-free layout rules only) to `Intello Design System/components/bundle.css` and document it in the design system `README.md` utilities section.
- [X] T015 Add component `SkipLink` (`href` default `#main`, `children`; first focusable element, visible only on focus with the 2 px focus ring) with `components/SkipLink/{README.md,preview.html}`, bundle entries and types; render test row in T010.
- [X] T016 Add component `Footer` (`columns[]` of `{heading, links[]}`, `contact` `{heading, phone, phoneHref, hours}`, `tagline`, `language` (LanguageToggle props, link mode), `legal` `{text, links[]}`, `logoTone`): navy band using the approved on-navy logo from `assets/Logos/`, includes the language toggle and the privacy link; with README, preview (es/en) and render test row.
- [X] T017 Add component `CtaBand` (`title`, `titleAccent`, `body`, `cta`, `secondary?`): closing call to action on navy, a single yellow accent per view, no gradient; with README, preview (es/en) and render test row.
- [X] T018 Add component `PageHero` (`eyebrow`, `title`, `titleAccent`, `titleMuted`, `lede`, `cta?`, `media?` as ImageTile props): lighter inner-page hero, no tracking card or capability row; with README, preview (es/en) and render test row.
- [X] T019 Add component `ServiceSection` (`id`, `eyebrow`, `title`, `summary`, `deliverables[]`, `cta`, `image` as ImageTile props, `reverse?`): Services page section with line-icon deliverables; `id` becomes the element id used by anchors; with README, preview (es/en) and render test row.
- [X] T020 Add component `Steps` (`items[]` of `{title, body}`): numbered how-it-works list; with README, preview and render test row.
- [X] T021 Add component `Accordion` (`items[]` of `{id, question, answer}` where `answer` is a string or an array of paragraphs): native `<details>`/`<summary>`, keyboard-operable without scripts, `chevron-down` icon that rotates by CSS only; with README, preview (es/en) and render test row.
- [X] T022 Add component `Prose` (`children`): readable measure and spacing for legal text using existing type tokens only; with README, preview and render test row.
- [X] T023 Add component `Field` (`id`, `label`, `hint?`, `error?`, `required?`, `children`): visible label, hint and error, wiring `aria-describedby` and `aria-invalid` onto the control; with README, preview (es/en) and render test row.
- [X] T024 Add component `TextInput` (`id`, `name`, `type`, `value?`, `autoComplete?`, `required?`, `maxLength?`, `invalid?`): pill-shaped per the shape rule, 2 px focus ring; with README, preview and render test row.
- [X] T025 Add component `Textarea` (`TextInput` props plus `rows`): `radius-md` (a multi-line control is not a pill); with README, preview and render test row.
- [X] T026 Add component `Select` (`id`, `name`, `options[]` of `{value, label}`, `value?`, `invalid?`): native `<select>` styled with tokens; with README, preview and render test row.
- [X] T027 Add component `FormNotice` (`variant` of `success|error|info`, `title`, `children`, `role?`): colour always paired with a word and an icon, never colour alone; with README, preview (es/en) and render test row.
- [X] T028 Add component `FormErrorSummary` (`title`, `errors[]` of `{id, message}`): `role="alert"`, each item an in-page link to its field id; with README, preview and render test row.
- [X] T029 Add component `Honeypot` (`name`): a text input hidden visually (positioned off-screen with `.itl-visually-hidden`-style rules) and from assistive technology (`aria-hidden="true"`), skipped by keyboard focus (`tabindex="-1"`), `autocomplete="off"`, still present in the DOM so that bots fill it and it is submitted with the form; with README, preview and render test row.
- [X] T030 Extend `LanguageToggle` in `components/bundle.js`/`index.d.ts` and `components/LanguageToggle/{README.md,preview.html}`: add an optional `rel` per language option that is rendered on the link-mode anchor (the site passes `nofollow`, per [contracts/http-routes.md](contracts/http-routes.md) "Language selection"); render test row.
- [X] T031 List every addition from T011–T030 in `Intello Design System/design-system.json` and in the component list of `Intello Design System/README.md`; confirm `components/index.d.ts` exports every new component. (Done: `design-system.json` lists assets only, not components, so the new icons are registered there and the components are recorded in its `lastChange` note and in the README's "Website additions" paragraph.)
- [X] T032 [P] Run `tools/` stylelint (T005 config) over `Intello Design System/components/bundle.css` for the new rules and create `tools/check-ds-values.mjs` that fails on any hard-coded colour, font family or radius in newly added CSS (the two existing hard-coded hexes `#4a4a68` and `#c9c9d6` and the Google Fonts `@import` are allow-listed with a comment); fix findings.
- [X] T033 [P] Create `tools/a11y-previews.mjs` (Playwright + axe-core) that opens every new component `preview.html` and fails on any serious or critical violation; run it and fix findings in the design system files.
- [X] T034 [P] Self-host Montserrat: use `tools/node_modules/@fontsource/montserrat` to copy the four `woff2` files (weights 400, 500, 600, 700, latin subset) into `public/fonts/`, and write `public/css/fonts.css` with `@font-face` rules (`font-display: swap`, relative URLs to `/fonts/…`); record the SIL OFL licence in `public/fonts/LICENSE.txt`.

**Checkpoint (2A)**: all additions render server-side, previews are accessible, CSS lint clean.

### 2B. Application skeleton (needs T008)

- [X] T035 Create `src/config.js`: parse environment per [contracts/environment.md](contracts/environment.md); in production fail fast naming missing/invalid variable **names only** (never values) when a required variable is absent, `FORM_TOKEN_SECRET` is shorter than 32 characters, or `SMTP_SECURE` disagrees with `SMTP_PORT`; refuse to start while `content/site.json` has `placeholder: true` unless `ALLOW_PLACEHOLDERS=1`; port is `process.env.PORT`, falling back to a local default of 3000 only when it is absent (permitted by constitution v1.3.1, and no host is ever hard-coded); `TRUST_PROXY` hop count from the spike; load `.env` for local use only via a tiny built-in parser (no new dependency, `process.loadEnvFile` on Node 24).
- [X] T036 [P] Create `tests/unit/config.test.js` covering: missing variable names listed without values, short secret, SMTP port/secure mismatch, placeholder guard with and without `ALLOW_PLACEHOLDERS`, `PORT` fallback, dev JSON-transport fallback only outside production.
- [X] T037 Create the Hostinger entry file `server.js` at the repository root: import `src/app.js`, bind to the configured port, print one start-up JSON line (port, Node version, languages), handle `SIGTERM` gracefully, and exit non-zero with the config error message on failure.
- [X] T038 Create `src/security/headers.js` configuring Helmet exactly as the "Security headers" section of [contracts/http-routes.md](contracts/http-routes.md): CSP `default-src 'self'; script-src 'none'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`, HSTS in production only, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `X-Powered-By` removed.
- [X] T039 Create `src/ds/assets.js` (Express router): serve `/ds/tokens.css` from `Intello Design System/tokens.css`, `/ds/bundle.css` from `components/bundle.css` with the Google Fonts `@import` line stripped at load time, and `/ds/assets/*` from `Intello Design System/assets/` limited to `Logos/` and `Icons/` `.svg`; compute a content hash for a `?v=` URL helper and send `Cache-Control: public, max-age=31536000, immutable` for hashed requests. `bundle.js`, previews, READMEs, `tokens.json` and `design-system.json` must return 404.
- [X] T040 Create `src/i18n/locales.js`: supported languages `es` (default) and `en`; the page map from [contracts/http-routes.md](contracts/http-routes.md) (`home` empty slug, `servicios/services`, `nosotros/about`, `tecnologia/technology`, `preguntas/faq`, `contacto/contact`, `privacidad/privacy`); helpers `pathFor(key, lang)`, `equivalentUrl(path, lang)`, `pageKeyFor(path)`; slugs lowercase ASCII, unique per language.
- [X] T041 Create the language-neutral content files `content/structure.json` (page keys, the four service ids `back-office`, `tracking`, `technology`, `ai-analytics` with `icon`, `anchor`, `cardImage`, `sectionImage`; topic ids plus `other`; image id per slot), `content/site.json` (`phone`, `hours.es/en`, optional `address`, `placeholder: true` with clearly marked placeholder values), `content/images.json` (registry entries per [data-model.md](data-model.md) "Image asset" for all 16 ids from [research.md](research.md#r11-imagery-workflow-higgsfield), `approved: false`, empty `files`) and `content/email.json` (Spanish team-facing labels for the notification email).
- [X] T042 Create `src/i18n/content.js`: load and deep-validate `content/{es,en}/*.json` and the neutral files at start-up, expose `getContent(lang, file)`, `site()`, `structure()`, `image(id)`; throw at start-up on missing files or invalid JSON.
- [X] T043 [P] Write `content/es/common.json` and `content/en/common.json` with the shape in [contracts/content-schema.md](contracts/content-schema.md) (`skipLink`, `nav` with `ariaLabel`, `menuLabel`, `links[]` of `{key,label}`, `cta.label`; `language`; `footer`; `ctaBand`; `exampleLabel`). English `label` values must be no longer than Spanish. Use the voice rules (sentence case, *tú* / "you", verb-first CTA such as "Solicitar demo" / "Request a demo").
- [X] T044 [P] Write `content/es/not-found.json`, `content/en/not-found.json`, `content/es/error.json` and `content/en/error.json` per [contracts/content-schema.md](contracts/content-schema.md): not-found has `meta`, `title`, `body`, `home.label`, `contact.label`; error has `meta`, `title`, `body` (server error), `tooLarge` (`title`, `body`, for a `413`), `home.label`, `contact.label` and `phoneNote` (offers the phone number). Constitution VII requires both 404 and 500 pages in both languages.
- [X] T045 Create `tests/unit/content.test.js` enforcing the seven rules in [contracts/content-schema.md](contracts/content-schema.md): (1) key-tree and array-length parity between `es` and `en` with no empty strings; (2) English `label` length ≤ Spanish; (3) `meta.title` ≤ 60 and `meta.description` ≤ 160 characters, unique per language; (4) voice checks: no `!`, no emoji, no all-caps word longer than four letters, buttons start with a verb from a small per-language list and have two or three words; (4a) figures: across **all** content files any number followed by `+`, `%` or `x`, and any client or statistic count, must be listed in `tests/allowed-figures.json` (initially only the "24/7" capability, pending client confirmation); (5) no `TODO`, `Lorem`, `XXX` or `[[` in values; (6) every image id in `structure.json` exists in `content/images.json` with `alt.es` and `alt.en`, and when `approved` is true all three width variants exist under `public/img/`; (7) `site.json.placeholder` is reported (fails only when the environment variable `RELEASE_CHECK=1` is set, used at release; an environment variable is used because Node's test runner rejects unknown command-line flags).
- [X] T046 Create `src/render/html.js`: bind `htm` to `React.createElement`; export `renderDocument({lang, pageKey, meta, body})` returning a complete HTML string with `<!doctype html>`, `<html lang>`, charset and viewport metas, `<title>`, description, canonical (no query string), `hreflang` for `es`, `en` and `x-default` (Spanish URL), Open Graph tags (`og:locale`, title, description, image, url), links to `/css/fonts.css`, `/ds/tokens.css`, `/ds/bundle.css` (hashed), a `data-theme="light"` wrapper, and absolutely no `<script>` or `<style>` element.
- [X] T047 Create `src/render/frame.js`: shared page frame composed only from design system components: `SkipLink` → `NavBar` (links centred with the current-page dot, phone and hours, call to action to the contact page, `LanguageToggle` in link mode with `href` = equivalent URL in the other language and `rel` from T030) → `<main id="main">` → `Footer` (links, contact details from `site.json`, toggle, privacy link). Text from `common.json`; toggle codes `ES`/`EN`.
- [X] T048 Create `src/pages/index.js` (registry mapping page key → render function, so each story registers its own page) `src/pages/not-found.js` (branded bilingual not-found page with links home and to contact, using `PageHero` and the frame) and `src/pages/error.js` (server-error page for `500` and the "too large" text for `413`, in the route's language, with links home and to contact and the phone number from `site.json`; shows no technical detail).
- [X] T049 Create `src/routes/pages.js`: for every registered page and language, `GET /{lang}/{slug}` → complete HTML with `Content-Language`, `Cache-Control: no-cache` and an `ETag`; `/es` and `/en` redirect `301` to `/es/` and `/en/`; a language-prefixed URL always serves that language; unknown paths under a prefix return `404` with that language's not-found page, unknown unprefixed paths `404` in cookie → browser → Spanish order; render each page once per language into an in-memory cache keyed by route, **except the contact page, which is never cached** (every response carries its own single-use form token): the contact page in every state, including `?sent=1`, `?topic=` and the `422`, `429` and `503` results, is rendered per request with `Cache-Control: no-store` and no `ETag`.
- [X] T050 Create `src/routes/seo.js` with `GET /healthz` returning `200 {"status":"ok"}` and `GET /robots.txt` (allow all, `Sitemap:` line from `SITE_URL`).
- [X] T051 Create `src/app.js`: build the Express 5 app with `trust proxy` from config, middleware order (request id and one-JSON-line-per-request logging without bodies → Helmet → static `public/` with hashed/versioned long cache → `/ds` assets → seo → pages → error handler that renders `src/pages/error.js` in the route's language for `500` with no stack trace, mapping body-too-large to `413` with the "too large" text), `X-Powered-By` disabled.
- [X] T052 Create `tests/integration/foundation.test.js` (ephemeral server + `fetch`): security headers present on every response including the exact CSP string; no `X-Powered-By`; `/ds/bundle.css` contains no `googleapis`; `/ds/bundle.js`, `/ds/README.md`, `/ds/tokens.json` return 404; `/ds/assets/Logos/intello-logo-navy.svg` returns 200; `/es` → 301 `/es/`; unknown `/es/xyz` and `/en/xyz` return 404 in the right language; `Content-Language` matches; `/healthz` works; no page contains a `<script` or `<style` element; a deliberately thrown error returns `500` with the error page in the route's language and no stack trace; a POST body over 16 KB returns `413` with the "too large" text.

**Checkpoint**: Foundation ready. The server starts, serves the not-found page and static assets in both languages with all headers; user stories can begin, in parallel if staffed.

---

## Phase 3: User Story 1 - Understand what Intello does from the homepage (Priority: P1) 🎯 MVP

**Goal**: The homepage in both languages matches the reference's structure and mood: hero, overlapping white panel with about and four service cards, closing call to action, footer.

**Independent Test**: Open `/es/` and `/en/` at 1240 px; a first-time visitor can say what Intello offers and who it is for ([quickstart.md](quickstart.md) Scenario 1). Note: the links from the homepage to Services, Contact and Privacy resolve only once US4 and US2 are built; until then T053 checks that the link targets are correct, not that the target pages exist.

### Tests for User Story 1

- [X] T053 [P] [US1] Write `tests/integration/home.test.js`: `/es/` and `/en/` return 200; exactly one `<h1>` with a two-tone headline; eyebrow, lede, primary CTA linking to the contact page, four capability highlights; the tracking card is labelled with `exampleLabel` (FR-008) and no fabricated statistic appears; the panel contains the about block (two image slots, link to About) and exactly four service cards each linking to `/{lang}/{services-slug}#{anchor}` for its service id; closing `CtaBand` and footer present; the video link is absent (FR-013); every `<img>` has non-empty `alt` in the page language and `width`/`height`.

### Implementation for User Story 1

- [X] T054 [P] [US1] Read the starting copy in `Intello Design System/components/HomePage/README.md` and `Intello Design System/preview/homepage.html`, then write `content/es/home.json` and `content/en/home.json` per [contracts/content-schema.md](contracts/content-schema.md) (`meta`, `hero` with `features[4]`, `tracking`, `stat`, `about`, `services`); drop any unsourced number (no "5000+"); keep "24/7" only as a capability flagged for client confirmation in `research.md` follow-ups.
- [X] T055 [P] [US1] Write `content/es/services.json` and `content/en/services.json` with `meta`, `header` and `items[4]` keyed by service id (`back-office`, `tracking`, `technology`, `ai-analytics`), each `{title, bullets[2], summary, deliverables[], cta.label}`. Shared content: the homepage cards use `title` and `bullets`; the Services page (US4) uses the rest. English `label` ≤ Spanish.
- [X] T056 [US1] Create `src/render/image.js`: `imageProps(id, lang, {priority, sizes})` reads the registry; when `approved` is true return `ImageTile` props with `srcSet` (480/960/1600 webp), `sizes`, `width`, `height`, `alt[lang]`, `priority`; otherwise return the art-direction slot props (no `src`, `aria-label` from alt). Reused by every page.
- [X] T057 [US1] Create `src/pages/home.js`: compose `Hero` (eyebrow, two-tone `Headline`, lede, `Button` with arrow, four `FeatureItem`, `TrackingCard` with the example label, `StatChip`, hero image with `priority`), then the overlapping white rounded `Section` panel holding `AboutBlock`, a hairline divider and `SectionHeader` plus four `ServiceCard` (icon from `structure.json`, bullets, arrow link to the Services anchor), then `CtaBand`; all text from `home.json`, `services.json` and `common.json`; register it in `src/pages/index.js` for both languages.
- [X] T058 [P] [US1] Create `tools/visual.mjs`: Playwright script that captures every route listed in `tools/routes.json` (both languages) at 360, 768 and 1240 px into `tools/out/`, and fails if the page has horizontal scroll at any width; it also screenshots, at the same widths, the design system `preview.html` of the main components each page uses (into `tools/out/previews/`) for the side-by-side comparison required by Quality Gate 4; create `tools/routes.json` listing the 14 page routes plus one unknown URL per language (to capture the 404 page).
- [X] T059 [P] [US1] Create `tools/a11y.mjs`: Playwright + axe-core over every route in `tools/routes.json`, failing on any serious or critical violation; used by every later story.
- [X] T060 [US1] Run `tools/visual.mjs` and `tools/a11y.mjs` on `/es/` and `/en/`, compare the 1240 px screenshots with the reference screenshot (light page, two-tone headline, dominant imagery slot, overlapping white panel, four cards), fix design findings by composing existing components (or adding to the design system first), and note the result in `specs/001-intello-marketing-website/checklists/requirements.md`.

**Checkpoint**: Homepage works standalone in both languages with art-direction slots where images will go.

---

## Phase 4: User Story 2 - Contact Intello or request a demo (Priority: P1)

**Goal**: A visitor sends an enquiry and the Intello team receives an email with the visitor as reply address; failures and abuse are handled safely.

**Independent Test**: [quickstart.md](quickstart.md) Scenario 2 steps 1–9 with a mocked transport locally, then real SMTP at deployment.

### Tests for User Story 2

- [X] T061 [P] [US2] Write `tests/unit/validate.test.js` for `src/contact/validate.js` using the exact rules from [data-model.md](data-model.md) "Enquiry": `name` "Trimmed; 2–100 characters; control characters removed"; `company` "≤ 150 characters"; `email` "≤ 254 characters; one `@` with text and a dot-separated domain after it; no whitespace or line breaks"; `phone` "≤ 30 characters; digits, spaces and `+ - ( ) .` only"; `topic` one of `back-office`, `tracking`, `technology`, `ai-analytics`, `other` (default `other`); `message` "10–4000 characters; line breaks normalised; control characters removed"; each failure returns a message key, never a literal string.
- [X] T062 [P] [US2] Write `tests/unit/token.test.js` for `src/contact/token.js`: valid between 2 seconds and 2 hours after issue (a faster post is automated, an older one expired), tampered signature rejected, each nonce works once, used nonces expire from memory.
- [X] T063 [P] [US2] Write `tests/integration/contact.test.js` with an injected mock transport, covering everything in "Tests this contract requires" of [contracts/contact-form.md](contracts/contact-form.md): recipients equal `CONTACT_TO`; `Reply-To` is the visitor and `From` is `CONTACT_FROM`; the visitor's language is stated in the body; a name or subject containing `\r\n` cannot add a header; filled honeypot sends nothing and returns the normal `303`; a reused token sends once; a too-fast post returns `422` with a fresh token; the sixth post within 15 minutes returns `429` with `Retry-After`; a transport error returns `503` with the phone number and no stack trace; validation failure returns `422` with errors beside fields, a `role="alert"` summary and entries preserved; success is `303` to `?sent=1`; body over 16 KB returns `413`; both `/es/contacto` and `/en/contact` behave identically in their language; two consecutive GETs of the contact page return different form tokens and `Cache-Control: no-store` with no `ETag`; the navigation CTA exists on every page and links to the contact URL (SC-010); no logged line contains the posted name, email, phone, company or message.

### Implementation for User Story 2

- [X] T064 [P] [US2] Write `content/es/contact.json` and `content/en/contact.json` per the schema: `meta`, `header`, `details` (`phoneLabel`, `hoursLabel`), `form` (`labels` for every field, `hints`, `topics` by id, `privacy` statement stating what is collected (name, company, email, phone, message) and why, `submit.label` verb-first, `errors` by rule key, `summaryTitle`, `notices` for token, expired and already-sent), `sent`, `failed` (names the phone as the alternative), `rateLimited`.
- [X] T065 [P] [US2] Write `content/es/privacy.json` and `content/en/privacy.json` (`meta`, `header`, `updated`, `sections[]` of `{heading, body[]}`) describing only what the site actually does: form data used only to reply, sent by email and not stored (FR-025), one first-party language cookie `itl_lang`, no analytics or trackers; mark the text as needing client/legal approval in the follow-ups and keep `site.json.placeholder` true until approved.
- [X] T066 [US2] Implement `src/contact/validate.js` (hand-written, no dependency) per the rules quoted in T061, returning `{values, errors}` with trimmed/normalised values and message keys.
- [X] T067 [US2] Implement `src/contact/token.js`: HMAC-SHA256 over `issuedAt` and a random `nonce` with `FORM_TOKEN_SECRET`; `issue()` and `consume(token)` returning `ok | missing | too-fast | expired | used | invalid`; in-memory used-nonce set pruned at expiry.
- [X] T068 [US2] Implement `src/contact/mailer.js`: Nodemailer transport factory (SMTP with auth from config; outside production with no `SMTP_HOST` use the JSON transport that logs the message; disabled in production); `sendEnquiry(enquiry, {transport})` builds `From` = `CONTACT_FROM`, `To` = `CONTACT_TO` list, `Reply-To` = visitor name and email, subject `[Intello web] {topic label} — {name}` truncated to 150 characters, plain-text body in the order of [contracts/contact-form.md](contracts/contact-form.md) "Body content" using Spanish labels from `content/email.json`; strip `\r` and `\n` from every header value; transport injectable for tests.
- [X] T069 [US2] Implement `src/security/limits.js` using `express-rate-limit`: default 5 posts per 15 minutes per client address on the contact POST routes only, answering `429` through the page renderer with a `Retry-After` header; key by the client address determined by `trust proxy`.
- [X] T070 [US2] Create `src/pages/privacy.js` (`PageHero` + `Prose` + `CtaBand`, localised "updated" date format per language) and register it for both languages.
- [X] T071 [US2] Create `src/pages/contact.js`: `PageHero`, details block (phone as dial link, hours), the form built from `Field`, `TextInput`, `Textarea`, `Select`, `Honeypot` (name `website`), hidden token field `ft`, the privacy statement and link directly above the submit `Button`, `FormErrorSummary` and per-field errors, `FormNotice` for sent, failed, rate-limited, already-sent and expired states, `?topic=<id>` pre-selection, `?sent=1` confirmation; a form that works without scripts; the hero uses the contact image slot from `structure.json` through `src/render/image.js`; the page is rendered per request and never cached (see T049); register it for both languages.
- [X] T072 [US2] Create `src/routes/contact.js`: `POST /es/contacto` and `POST /en/contact` with `express.urlencoded` limit 16 KB; order of checks: rate limit → honeypot (log and redirect as sent) → token → validate → send; outcomes and statuses exactly as the "Contact submission" table of [contracts/http-routes.md](contracts/http-routes.md) (303 `?sent=1`, 422, 429, 503, 413); one JSON log line per outcome (`requestId`, route, language, outcome, duration) with no personal data; success only after SMTP acceptance.
- [X] T073 [US2] Wire the contact routes and limiter into `src/app.js` (before the error handler) and register the contact and privacy pages in `src/pages/index.js`; run `npm test` until T061–T063 pass.
- [X] T074 [US2] Run `tools/a11y.mjs` and `tools/visual.mjs` on `/es/contacto`, `/en/contact` and both privacy pages including a `422` state (submit empty via Playwright), fix findings, and manually walk [quickstart.md](quickstart.md) Scenario 2 (local, JSON transport).

**Checkpoint**: Homepage and contact work together; this pair is the minimum launchable site once imagery and client details exist.

---

## Phase 5: User Story 3 - Read the site in my own language (Priority: P2)

**Goal**: First-visit language follows the browser, the toggle overrides and remembers, links always show the language they name, search engines can relate both versions.

**Independent Test**: The request table in [quickstart.md](quickstart.md) Scenario 3 passes.

### Tests for User Story 3

- [X] T075 [P] [US3] Write `tests/unit/negotiate.test.js` for `src/i18n/negotiate.js`: English-first lists pick `en`; `es-SV,es;q=0.9,en;q=0.5` picks `es`; `pt-BR,pt;q=0.9`, a missing header and a bare `*` pick `es`; cookie `es`/`en` wins over the header; invalid cookie values are ignored.
- [X] T076 [P] [US3] Write `tests/integration/language.test.js` for all eight rows of the Scenario 3 table (including `GET /es/servicios?setlang=1` sets `itl_lang=es` with `Max-Age` one year, `Path=/`, `SameSite=Lax`, `HttpOnly`, and `GET /es/servicios` without the flag sets no cookie); `/` returns `302` with `Cache-Control: no-store` and `Vary: Accept-Language, Cookie`; every page head has `hreflang` `es`, `en`, `x-default` and a canonical without the query; toggle links point at the equivalent page in the other language with `?setlang=1` and `rel="nofollow"`; `/sitemap.xml` lists all 14 page URLs with `xhtml:link` alternates; no page mixes languages (assert no Spanish label text on `/en/*` and vice versa using the content files).

### Implementation for User Story 3

- [X] T077 [US3] Implement `src/i18n/negotiate.js`: `chooseLanguage(req)` returns the cookie language if valid, else `req.acceptsLanguages('es','en')` (English only when it is the best supported match), else `es`.
- [X] T078 [US3] Implement `src/routes/entry.js` for `GET /`: `302` to `/{lang}/` using `chooseLanguage`, with `Cache-Control: no-store` and `Vary: Accept-Language, Cookie`; no other unprefixed URL redirects; register before the pages router in `src/app.js`.
- [X] T079 [US3] In `src/routes/pages.js`, when the query flag `setlang=1` is present set the cookie `itl_lang` (`Max-Age` 31536000, `Path=/`, `SameSite=Lax`, `HttpOnly`, `Secure` in production) for the language of the route; a page URL without the flag never changes the cookie; make sure the response caching (T049) keys on language and ignores the flag, and the canonical URL never includes it.
- [X] T080 [US3] Update `src/render/frame.js` so the `LanguageToggle` links use `?setlang=1` and `rel="nofollow"`, show the codes `ES`/`EN` with native names as accessible names, and work with scripts disabled; same for the footer toggle.
- [X] T081 [US3] Extend `src/routes/seo.js` with `GET /sitemap.xml` listing every page in both languages with `xhtml:link` alternates for `es`, `en` and `x-default`, built from `src/i18n/locales.js` and `SITE_URL`.
- [X] T082 [P] [US3] Create `src/i18n/format.js` for FR-030 (phone number display and `tel:` link per language convention from `content/site.json`; locale-aware date formatting via `Intl.DateTimeFormat` for the privacy "updated" date) and use it in the frame, the contact page and the privacy page.
- [X] T083 [US3] Run `npm test` until T075–T076 pass, then run `tools/a11y.mjs` on every route in both languages and fix findings.

**Checkpoint**: Language behaviour complete and testable on its own.

---

## Phase 6: User Story 4 - Explore services and the technology behind them (Priority: P2)

**Goal**: The Services page presents four service sections and the Technology page explains in plain language what AI does for the client.

**Independent Test**: [quickstart.md](quickstart.md) Scenario 4.

### Tests for User Story 4

- [X] T084 [P] [US4] Write `tests/integration/services.test.js`: `/{lang}/{services}` has four `ServiceSection` elements whose ids equal the `anchor` values the homepage cards link to; each has summary, at least one deliverable, an image slot or image with `alt`, and a CTA linking to the contact page with `?topic=<service id>`; `/{lang}/{technology}` lists the capabilities from `technology.json` (alerts, forecasts, dashboards, integrations), a `Steps` list and a CTA to the contact page; both pages have unique meta.

### Implementation for User Story 4

- [X] T085 [P] [US4] Write `content/es/technology.json` and `content/en/technology.json` (`meta`, `header`, `capabilities[]` of `{title, body}` for end-customer alerts, demand forecasts, KPI dashboards and integrations, `how` with `steps[]`, `cta`), describing AI by what it does, with no robots, brains or sparkles and no invented figures.
- [X] T086 [US4] Create `src/pages/services.js`: `PageHero` from `services.json` header plus four `ServiceSection` (alternating `reverse`, image from `structure.json` `sectionImage` through `src/render/image.js`, line icon per deliverable, CTA to the contact page with `?topic=<id>`), then `CtaBand`; register for both languages.
- [X] T087 [US4] Create `src/pages/technology.js`: `PageHero`, capability blocks (`SectionHeader`, `FeatureItem`/cards from existing components), `Steps` for how it works, the two technology image slots from `structure.json`, `CtaBand`; register for both languages.
- [X] T088 [US4] Run `npm test`, `tools/a11y.mjs` and `tools/visual.mjs` for the Services and Technology routes in both languages and fix findings.

**Checkpoint**: Homepage service cards now land on real sections.

---

## Phase 7: User Story 5 - Build confidence with About and FAQ (Priority: P3)

**Goal**: About explains the operation and engagement using only confirmed facts; FAQ opens and closes by keyboard without scripts.

**Independent Test**: [quickstart.md](quickstart.md) Scenario 5.

### Tests for User Story 5

- [X] T089 [P] [US5] Write `tests/integration/about-faq.test.js`: the FAQ renders each item as `<details><summary>` with its answer already in the HTML; every FAQ item exists in both languages; the FAQ ends with a CTA to the contact page; the About and FAQ content passes the site-wide figures check from T045 (no unsourced statistic) and the About page has a CTA; both pages have unique meta.

### Implementation for User Story 5

- [X] T090 [P] [US5] Write `content/es/about.json` and `content/en/about.json` (`meta`, `header`, `story`, `approach` with `steps[]`, `clients` with `items[]`, `cta`) using only facts from the client's description (back office and shipment tracking for logistics companies, technology services, AI-supported data analysis) and flagging anything needing client confirmation in the follow-ups.
- [X] T091 [P] [US5] Write `content/es/faq.json` and `content/en/faq.json` (`meta`, `header`, `items[]` of `{id, question, answer[]}` covering services, onboarding, data handling, how to get started, and which companies Intello works with, plus `cta`); answers must not promise anything the client has not confirmed.
- [X] T092 [US5] Create `src/pages/about.js`: `PageHero`, story `Section`, `Steps` for the approach, clients list, two image slots, `CtaBand`; register for both languages.
- [X] T093 [US5] Create `src/pages/faq.js`: `PageHero`, `Accordion` from `faq.json`, `CtaBand`; register for both languages.
- [X] T094 [US5] Run `npm test`, `tools/a11y.mjs` and `tools/visual.mjs` for About and FAQ in both languages and fix findings.

**Checkpoint**: All 14 page routes (7 pages in 2 languages) render, and both error pages (404, 500) are covered by tests.

---

## Phase 8: Imagery (cross-cutting; owner-gated, serves FR-034 to FR-036 and SC-011)

**Purpose**: Replace art-direction slots with reviewed monochrome images. Constitution: the owner approves each generation batch before it runs.

- [X] T095 **Owner action**: approve the image list and spend from [research.md](research.md#r11-imagery-workflow-higgsfield) (16 images plus the share image; about 17.75 credits first pass, about 53 credits worst case of the 421.75 balance) or amend the list. Record the approval and date in `specs/001-intello-marketing-website/checklists/requirements.md`. Blocks T096–T101.
- [X] T096 Write the final brief (prompt and art direction: monochrome, high-key, soft daylight, photographic realism, no text, no logos, no faces, people only from behind, in silhouette or as hands, screens with abstract unreadable graphs) and bilingual `alt` text for every image into `content/images.json`, still with `approved: false`.
- [X] T097 Preflight then generate the hero image `hero-main`: call the Higgsfield `generate_image` tool with model `gpt_image_2_6`, webp, 2k, high quality, first with `get_cost: true` to confirm 2.75 credits, then for real; save the raw file to `tools/raw-images/hero-main.webp` and record model and `generatedOn` in `content/images.json`.
- [X] T098 Preflight and generate the remaining 15 images in batches of at most four at medium quality (1 credit each), checking the balance with the `balance` tool before each batch; save raw files to `tools/raw-images/<id>.webp`; stop and report if the balance would drop below the approved budget.
- [X] T099 [P] Create `tools/optimize-images.mjs` (sharp): from `tools/raw-images/` write 480, 960 and 1600 px wide webp files to `public/img/<id>-<width>.webp`, report the hero's 480 px file size (budget ≤ 150 KB), write pixel dimensions and ratio back into `content/images.json`, and crop the 1200×630 share image to `public/img/og.jpg`; also create `public/favicon.svg` from `Intello Design System/assets/Logos/intello-mark-navy.svg`.
- [ ] T100 **Owner review (assistant pass done, owner confirmation pending)**: inspect every optimised image against FR-034 to FR-036 and the constitution (monochrome, no embedded text or logos, no recognisable faces, not cartoon or obviously synthetic); for each pass set `approved: true` in `content/images.json`; for each failure revise the brief and regenerate (maximum three attempts per image, within the approved spend).
- [X] T101 Switch the pages from slots to images: confirm every `src/render/image.js` call passes `sizes`, only the hero uses `priority`, `og:image` points at `og.jpg`, and `npm test` rule 6 passes with the approved set; re-run `tools/visual.mjs` and `tools/a11y.mjs`.
- [X] T102 Run Lighthouse (mobile) on `/es/` and `/en/` via `tools/` and record the scores; fix until Performance ≥ 90, Accessibility ≥ 95, LCP ≤ 2.5 s and CLS ≤ 0.1; record results in `specs/001-intello-marketing-website/checklists/requirements.md`.

**Checkpoint**: Imagery is the dominant visual element and every image is reviewed.

---

## Phase 9: Polish and Release

**Purpose**: Quality gates, documentation, client details, deployment.

- [X] T103 [P] Create `tools/keyboard.mjs` (Playwright with JavaScript disabled): open and close the mobile menu at 360 px, open and close every FAQ question, tab through the contact form, and submit it, all by keyboard only; assert focus is always visible.
- [X] T104 [P] Run the full quality-gate sweep and fix findings: a clean `npm ci` in a fresh checkout on Node 24 followed by `npm start` **and** `node server.js`, each serving on a `PORT` set in the environment (Quality Gate 1); `npm test`; `tools/a11y.mjs` over all routes and languages; stylelint and `tools/check-ds-values.mjs`; `tools/visual.mjs` at 360, 768 and 1240 px with no horizontal scroll; `tools/keyboard.mjs`.
- [X] T105 [P] Run `npm audit --omit=dev`; resolve any high or critical finding or document an accepted exception in `research.md`.
- [X] T106 [P] Write `DEPLOY.md`: Hostinger Web App steps (Node 24, GitHub or ZIP deploy, entry file `server.js`, `npm install`), every environment variable with where to find its value, the placeholder guard and `ALLOW_PLACEHOLDERS` for staging, the DNS records the sending domain needs (SPF, DKIM and DMARC, required before launch by constitution VIII) and how to check them, how to roll back, the smoke test from [quickstart.md](quickstart.md), and how to change content and image briefs.
- [ ] T107 Constitution housekeeping (PATCH 1.3.1 itself was applied on 2026-11-17 before implementation): once the spike (T008) and client inputs (T109) are in, resolve the remaining TODOs in `.specify/memory/constitution.md` (`TODO(HOSTING_TIER)`, `TODO(MAIL_LIBRARY)`, `TODO(CONTACT_RECIPIENT)`, `TODO(SMTP_ACCOUNT)`; `TODO(GOTHAM_LICENCE)` stays open), record anything the spike changed (for example the real port behaviour), bump the version if the text changes, and remove the temporary Sync Impact Report comment before the first commit. Owner approves any text change.
- [X] T108 [P] Optional, owner-approved: record the approved horizontal logo in `Intello Design System/README.md` (line ~61) and `Intello Design System/components/Logo/README.md` (line ~3), replacing "proposed, pending brand approval" and keeping the 0.42 × mark-height note.
- [ ] T109 **Client inputs**: obtain phone, opening hours, address, `CONTACT_TO` recipients, the sending mailbox and SMTP credentials, the approved privacy notice text, confirmation or removal of any "24/7" claim, the Hostinger plan tier, your confirmation that "jsmailer" means Nodemailer, and access to the sending domain's DNS to publish SPF, DKIM and DMARC records for the sending mailbox; update `content/site.json` and `content/*/privacy.json`, set `placeholder` to `false`, and re-run `RELEASE_CHECK=1 npm test`.
- [ ] T110 Staging deploy to a temporary domain with `ALLOW_PLACEHOLDERS=1`: push to GitHub, deploy on Hostinger, set the environment variables, and run the Deployment smoke test in [quickstart.md](quickstart.md): `/healthz`, the language request table, the delivery test for SC-003 (10 consecutive real submissions, each arriving in the configured inbox within 2 minutes with the visitor as `Reply-To`; record each delay), a check that the received message's headers show SPF, DKIM and DMARC passing, a check that the app refuses to start when a required variable is removed, and Lighthouse on the live home page; record results in `research.md`.
- [ ] T111 Walk [quickstart.md](quickstart.md) Scenarios 1–6 end to end against staging and record pass or fail per step in `specs/001-intello-marketing-website/checklists/requirements.md`.
- [ ] T112 Usability and design review (SC-001, SC-002, SC-009): run the five-visitor comprehension test in each language, the contact form timing test with at least ten participants (or document the smaller sample), and a design review of every page against the design system; record findings and fix any deviation.
- [ ] T113 Production deploy with placeholders removed (no `ALLOW_PLACEHOLDERS`), repeat the Deployment smoke test on the live domain, and confirm a single real contact submission arrives.

---

## Dependencies and Execution Order

### Phase dependencies

- **Phase 1 Setup**: T001–T006 start immediately; T007 is an owner action; T008 needs T007.
- **Phase 2A Design system** (T009–T034): needs T001, T002 and T005 only. Can run while the spike (T007) is pending.
- **Phase 2B Skeleton** (T035–T052): needs T009; the spike (T007–T008) is deferred to the first Hostinger deploy by owner decision; **blocks all user stories**.
- **US1 (Phase 3)** and **US2 (Phase 4)**: need Phase 2 only; independent of each other.
- **US3 (Phase 5)**: needs Phase 2; its integration tests touch pages from other stories (sitemap lists 14 URLs), so run its final test pass after US1, US2, US4 and US5 pages are registered.
- **US4 (Phase 6)**: needs Phase 2 and T055 (shared `services.json` content, created in US1).
- **US5 (Phase 7)**: needs Phase 2 only.
- **Imagery (Phase 8)**: needs T056 (image helper) and T041 (registry); the owner approval T095 gates generation. Can start as soon as any page exists.
- **Polish (Phase 9)**: needs all desired stories and Phase 8; T109 (client inputs) gates T110 onward.

### Story dependency summary

```text
Setup ──► DS additions ─┐
   │                    ├──► Skeleton ──┬─► US1 Home ───────┐
   └──► Spike (T007) ───┘               ├─► US2 Contact ────┤
                                        ├─► US3 Language ───┼─► Imagery ─► Polish ─► Release
                                        ├─► US4 Services ───┤   (owner gate)
                                        └─► US5 About/FAQ ──┘
```

### Within each story

- Tests first, and they must fail before implementation.
- Content files before pages; pages before registration in `src/pages/index.js`; routes before the story's accessibility run.
- Design system changes always land before the page that needs them (constitution Principle I).

### Parallel opportunities

- T003, T004, T005 together; T032, T033, T034 together after the design system additions.
- Content pairs for different pages (T043, T044; T054, T055; T064, T065; T085; T090, T091) can be written in parallel because each is a separate file pair.
- After Phase 2: US1, US2, US4 and US5 can be built by different people; US3 follows.
- T058 and T059 (tools) while T057 (home page) is written.
- T103, T104, T105, T106, T108 in the polish phase.

### Parallel example: User Story 2

```text
# Tests together (different files):
T061 tests/unit/validate.test.js
T062 tests/unit/token.test.js
T063 tests/integration/contact.test.js

# Content together:
T064 content/{es,en}/contact.json
T065 content/{es,en}/privacy.json

# Then sequentially: T066 validate → T067 token → T068 mailer → T069 limits → T071 contact page → T072 routes → T073 wiring
```

---

## Implementation Strategy

### MVP first

1. Phase 1 (setup and spike), Phase 2A in parallel with the spike, Phase 2B.
2. **US1** Homepage, then **STOP and validate** with Scenario 1 and the reference comparison.
3. **US2** Contact. Homepage plus contact is the smallest site that meets the business goal (the only conversion). Treat Phases 1–4 as the MVP.
4. Run the imagery gate (Phase 8) as soon as the owner approves, so the MVP is not shipped with empty slots.

### Incremental delivery

1. Foundation ready.
2. US1 → validate → (internal demo).
3. US2 → validate with the mocked transport, then staging with real SMTP.
4. US3 → US4 → US5 in any order (each adds pages without breaking the others).
5. Imagery, polish, production.

### Scope levers (if time is short)

- Drop US5 (About and FAQ) or merge the FAQ into Contact; remove their nav links and routes.
- Ship US4's Services page without a separate Technology page by moving the four capabilities into Services.
- Ship with art-direction slots only (skip Phase 8) for a content-review preview, never for production.

---

## Notes

- Tasks T007, T095, T100, T107, T109 are owner actions or decisions; the assistant must not proceed past them on its own.
- Commit after each task or logical group. Suggested commit message style: `feat(ds): add Footer component` / `feat(home): compose homepage` / `test(contact): cover header injection`.
- Hostinger facts are `UNVERIFIED` until T008; never encode an assumption about the port, proxy or SMTP before then.
- Avoid: literal copy in components, hard-coded colours or sizes, client JavaScript, third-party requests, logging visitor data, and generating images before T095.
