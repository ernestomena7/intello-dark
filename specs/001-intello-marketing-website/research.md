# Phase 0 Research: Intello Bilingual Marketing Website

**Date**: 2026-11-17 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

All items that were open in the constitution (`TODO(HOSTING_PLAN)`, `TODO(NODE_VERSION)`, rendering approach, i18n mechanism, SMTP) are resolved here. Anything that could not be confirmed from documentation is marked **UNVERIFIED** and is checked by the hosting spike (plan Phase 0) before real work depends on it.

## Evidence gathered

| Source | What it established |
|--------|--------------------|
| Hostinger docs and support pages (fetched 2026-11-17) | Node.js Web Apps run on Business and Cloud plans; Node 18.x, 20.x, 22.x and 24.x are selectable; deploy from GitHub/GitLab (auto-redeploy on push), or by uploading an archive (no auto-redeploy); the runtime is configured by an **entry file** (`.js`, `.mjs` or `.cjs`; root directory for Express) and an optional **build script**, with no documented `start command`; dependencies are installed with `npm install` (package manager auto-detected from the lockfile); environment variables are injected at build and run time and persist across deployments; keys are limited to `A-Z`, `0-9`, `_`; apps can't listen on their own ports; processes stop after a period without traffic and restart on the next request; one request is stopped after 120 s; 15-minute limit each for install and build; process limits (NPROC) 120 on Business up to 800; 5 Node.js apps on Business, 10 on Cloud; deployments overwrite the build folders; rollback = push older code or upload an older archive. |
| Hostinger email docs | Mailbox SMTP: `smtp.hostinger.com`, SSL on 465, or TLS/STARTTLS on 587; login is the full mailbox address and its password. |
| Hostinger docs | **Not documented**: the port the app must bind, whether outbound SMTP is allowed from a Node app, whether the runtime file system persists between redeploys, whether the proxy needs `trust proxy`, whether `devDependencies` are installed. These are the spike's job. |
| `npm view` (2026-11-17) | Latest stable: Express 5.3.0, Nodemailer 10.6.0, Helmet 8.3.0, express-rate-limit 8.7.4, htm 3.1.1; React and React DOM 18.3.1 are the latest 18.x. All support Node 24 (`engines` ≥ 16 to ≥ 20). Local Node is 24.15.0. |
| Server-render test (this repo, 2026-11-17) | The design system's `components/bundle.js` evaluates in plain Node with only `window.React` supplied (no DOM) in about 18 ms, and `NavBar`, `Hero`, `Section`, `AboutBlock`, `ServiceCard`, `ImageTile`, `Logo`, `Button`, `StatusBadge`, `Eyebrow`, `Headline` and `LanguageToggle` (link and button modes) all render to static HTML. `NavBar` has **no mobile menu markup**; `ImageTile` renders only `<img src alt>` (**no `srcset`, `width`, `height` or `loading`**). The inline `Logo` SVG makes `NavBar` about 16 KB of HTML. |
| Higgsfield preflight (2026-11-17, `get_cost`, nothing generated) | Model `gpt_image_2_6`, 4:3, webp output: default quality at 1k costs 0.25 credits; **medium at 2k costs 1 credit; high at 2k costs 2.75; xhigh at 4k costs 7**. Account balance when checked: 421.75 credits (Plus plan). |

## Decisions

### R1. Hosting target
- **Decision**: Hostinger **managed Node.js Web App** on a Business or Cloud plan, deployed from a GitHub repository.
- **Rationale**: it is the only Hostinger option that runs Node without manual server administration, which matches the constitution's "no root, no Docker" rule. VPS needs manual CLI setup.
- **Alternatives**: VPS (more freedom, but we would own OS, TLS, process supervision and patching), rejected for a small team. ZIP upload (works, but no auto-redeploy), kept only as a fallback.
- **Open**: which plan the client owns (`TODO(HOSTING_PLAN)` becomes "confirm plan tier", not "choose type").

### R2. Node.js version
- **Decision**: **Node.js 24.x**, pinned in `package.json` `engines` (`>=24 <25`) and selected in hPanel.
- **Rationale**: the newest LTS line Hostinger lists, and the version used locally, so development matches production.
- **Alternatives**: 22.x (also supported, older). Not chosen without a reason to be behind.

### R3. Entry file, start and port
- **Decision**: a root `server.js` is the Hostinger entry file; `npm start` runs the same file for local use and CI. The app listens on `process.env.PORT`, falling back to 3000 only when `PORT` is absent (local development).
- **Rationale**: Hostinger documents an entry file, not a start command, and does not document the port. Honouring `PORT` is the safe superset.
- **UNVERIFIED**: what Hostinger actually injects. **Spike S1** deploys a hello-world and logs `process.env.PORT`.
- **Constitution note**: Principle III says "npm ci" and "npm start" and forbids a hard-coded port. Hostinger runs `npm install` and an entry file. This plan treats the Hostinger behaviour as compatible (the repo provides both) and recommends a PATCH clarification (see plan, Follow-ups).

### R4. Rendering approach
- **Decision**: **Express 5 serving server-rendered HTML** produced by React 18 `renderToStaticMarkup` over the design system's own components, with **no client-side JavaScript in v1**.
- **Rationale**: the design system is React 18 and must not be forked (Principle I); rendering it on the server gives complete HTML on first response (Principle IV), the fastest pages, a CSP with `script-src 'none'`, and no hydration mismatch risk. The server-render test proved it works.
- **Alternatives**:
  - Next.js: supported by Hostinger, but pulls React 19 and a large build for a seven-page site (Principle VI).
  - Static site generation at build time: simpler hosting, but the contact form, language redirect and failure states need a live server anyway, and two code paths are worse than one.
  - Astro or Eleventy: would require re-implementing the React components or adding an integration layer.

### R5. Page authoring
- **Decision**: `htm` (tagged templates bound to `React.createElement`) in plain ES modules. No JSX, so **no build step**.
- **Rationale**: `npm install` then `server.js` is the whole deploy. A build step is one more thing to fail on a shared plan (15-minute limit, memory unknown). `htm` is 1 KB and has no dependencies.
- **Alternatives**: JSX with esbuild (nicer editor support, adds a build and a dev dependency); raw `createElement` (no dependency, noisy to read).

### R6. Internationalisation
- **Decision**:
  - Content in JSON, one folder per language (`content/es`, `content/en`), loaded and validated at start-up.
  - Localised path prefixes and slugs: `/es/servicios` and `/en/services`, etc.
  - Language negotiation with Express's built-in `req.acceptsLanguages('es', 'en')`, so there is no extra dependency.
  - The language cookie is `itl_lang`, first-party, language code only.
  - The toggle links are the real equivalent URLs plus `?setlang=1`, which sets the cookie.
- **Rationale**: JSON allows an automated key-parity test, which the constitution requires. Built-in negotiation handles q-values, wildcards and missing headers correctly. `?setlang=1` lets the toggle be a plain link to the equivalent page, as Principle VII requires, while ordinary inbound links never change a visitor's saved language.
- **Detection order on `/`**: valid cookie, then browser preference (English only if it is the best supported match), then Spanish.
- **Caching**: the `/` redirect is a 302 with `Cache-Control: no-store` and `Vary: Accept-Language, Cookie`. **UNVERIFIED**: whether any Hostinger layer caches it; checked in Spike S5.
- **Alternatives**: a library such as i18next (more than needed for two languages and static copy); subdomains per language (extra DNS and TLS for no gain).

### R7. Contact form and email
- **Decision**: plain HTML form posting to a language-specific route. The server validates, then sends through **Nodemailer 10.6 over SMTP**, then replies with a redirect to a confirmation view (post-redirect-get).
- **Details**:
  - Mailbox on the Intello domain as `From`, the visitor in `Reply-To`.
  - Port 465 with `secure: true` by default, 587 with STARTTLS as the documented alternative.
  - Protections: a honeypot field, a minimum fill time, a signed single-use form token (this also gives the "double submit sends one email" behaviour), and per-client rate limiting.
  - CR/LF stripped from anything used in a header.
- **Development mode**: with no `SMTP_HOST` and outside production, Nodemailer's JSON transport logs the message instead of sending it.
- **UNVERIFIED**: outbound SMTP from the Hostinger runtime (Spike S2). **Fallback if blocked**: an HTTPS transactional-email API, which needs a recorded decision under Principle V before use.

### R8. Security headers and abuse protection
- **Decision**: Helmet with a strict CSP (`default-src 'self'`; `script-src 'none'`; `style-src 'self'`; `style-src-attr 'unsafe-inline'` (the design system emits inline style attributes, confirmed in the render test; this allows attributes only, and with no scripts allowed it cannot lead to code execution); `img-src 'self' data:`; `font-src 'self'`; `form-action 'self'`; `frame-ancestors 'none'`), HSTS in production, and `express-rate-limit` with its in-memory store.
- **Notes**: the rate-limit memory resets when Hostinger stops an idle process, so it only has to cover bursts, which is what matters for form abuse. Trust-proxy depth is an environment variable (`TRUST_PROXY`) because Hostinger does not document it (**UNVERIFIED**, Spike S3).
- **Alternatives**: hand-written headers (easy to get wrong), CAPTCHA (third-party script, excluded by Principle V without a recorded decision).

### R9. Design-system delivery
- **Decision**: the server evaluates `components/bundle.js` in a small sandbox at start-up and serves, from the `Intello Design System/` folder, only `tokens.css`, a **sanitised `bundle.css`** (the Google Fonts `@import` removed at start-up, with a test that no `googleapis` text is served) and `assets/`. The JavaScript bundle and the previews are never sent to browsers.
- **Rationale**: the design system folder stays the single source of truth; nothing is copied or forked; the constitution's font rule is enforced in code and by test.
- **Cache busting**: asset URLs carry a content hash (`?v=…`, computed at start-up) so they can be cached for a year.

### R10. Fonts
- **Decision**: self-host Montserrat (OFL) as `woff2`, Latin subset, for the weights the design system uses: 300 italic, 400, 500 and 700. `@font-face` lives in a small site CSS file; `font-display: swap`; only the 400 and 700 files are preloaded.
- **Rationale**: Principles IV and V. Gotham stays out until licensed files exist.

### R11. Imagery workflow (Higgsfield)
- **Decision**: generate with `gpt_image_2_6`, **webp**, **2k**; **medium quality** (1 credit) for most images and **high** (2.75 credits) for the hero; resize to 480, 960 and 1600 px wide with `sharp` in the dev-only `tools/` package and commit only the results.
- **Count**: 16 images (hero, 2 home about, 4 service cards, 4 service sections, 2 technology, 2 about, 1 contact) plus a 1200×630 social-share image cropped from the hero.
- **Estimated spend**: first pass about 17.75 credits (15 × 1 + 1 × 2.75). Allowing up to three attempts per image, about 53 credits worst case, roughly 13% of the 421.75 balance.
- **Briefs**: every prompt requires monochrome, high-key, soft daylight, photographic realism, and explicitly **no text, no logos and no faces** (people are shown from behind, in silhouette, or as hands at keyboards). Screens show abstract, unreadable graphs.
- **Provenance**: `content/images.json` records, per image, the file, the brief, model, date, approval flag and `alt` text in both languages. Pages use an image only if `approved` is true, otherwise they show the `ImageTile` art-direction slot.
- **Approval**: constitution rule: each batch needs the owner's approval before it runs.

### R12. Testing and quality tooling
- **Decision**: the deployed package has **no dev dependencies**: unit and integration tests use Node's built-in `node:test` and `fetch` against an ephemeral server. Browser-level checks live in a separate, dev-only `tools/` package (own `package.json`) that Hostinger never installs: Playwright with axe-core, stylelint, sharp and Lighthouse.
- **Rationale**: Hostinger's handling of `devDependencies` is undocumented, and Playwright's browser download would threaten the install limit. Keeping it out of the root package removes the risk.

### R13. Observability
- **Decision**: one JSON line per event on stdout (request id, route, status, duration; errors without message bodies). No logging dependency. Hostinger's runtime logs collect stdout.

### R14. Cold starts and idle stops
- **Decision**: keep start-up work minimal (the design system bundle loads in about 18 ms; content JSON is small) and render each page once per language into an in-memory cache keyed by route. HTML is sent with `Cache-Control: no-cache` plus an ETag so repeat visits revalidate cheaply.
- **Effect**: the first request after an idle stop pays start-up plus one render. Spike S4 measures it.

### R15. Design-system additions (design-first rule)
The constitution requires missing patterns to be added to the design system first. Gaps found: no mobile menu, no footer, no closing call-to-action band, no inner-page hero, no accordion, no form controls, no responsive image support, no prose style for legal text, no service detail section, no steps list, no skip link. The full list with props is in [contracts/design-system-additions.md](contracts/design-system-additions.md).

### R16. Placeholder guard
- **Decision**: `content/site.json` carries the client's phone, hours and address plus a `placeholder` flag. In production the app refuses to start while `placeholder` is true, unless `ALLOW_PLACEHOLDERS=1` is set (for a staging deploy on a temporary domain).
- **Rationale**: spec FR-033 and the Assumptions say placeholders must never be published; this makes it a mechanical guarantee.

### R17. Theme
- **Decision**: light theme only; the page wrapper is always `data-theme="light"`. The dark tokens remain in the design system, unused.

## Risks and how they are covered

| Risk | Covered by |
|------|-----------|
| Hostinger does not provide `PORT`, or proxies differently | Spike S1 and S3 before page work starts |
| Outbound SMTP blocked | Spike S2; fallback decision recorded before use |
| Redirect on `/` cached by a proxy | `no-store` + `Vary`; Spike S5 |
| Runtime file system not persistent | Stateless by design; nothing is written at runtime |
| Idle process stop causes a slow first request | Minimal start-up, cached render, Spike S4 |
| Image generation produces text, faces or the wrong look | Briefs, review gate, `approved` flag, art-direction slot fallback |
| Install or build limits | No build step, 7 production dependencies, no dev dependencies in the root package |
