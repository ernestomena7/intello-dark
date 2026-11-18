# Implementation Plan: Intello Bilingual Marketing Website

**Branch**: `001-intello-marketing-website` | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-intello-marketing-website/spec.md`

## Summary

Build the Intello website as a small Node.js application for a Hostinger managed Node.js Web App. The server (Express 5) renders every page to complete HTML by running React 18 over the **unmodified Intello design system components**, with **no client-side JavaScript** in v1. Spanish and English are first-class: content lives in per-language JSON files, each language has its own URL space, the first visit to `/` is routed by the browser's language, and a link-mode `LanguageToggle` lets the visitor override and remember a language. The contact form posts to the server, which validates, protects against abuse, and emails the Intello team with Nodemailer over SMTP. Imagery is generated with Higgsfield, optimised offline, and committed with its brief and alt text.

Because the design system lacks several patterns this site needs (mobile menu, footer, call-to-action band, inner-page hero, accordion, form controls, responsive images and more), the plan starts with a short hosting spike and then **design-system additions** before any page is built. Details and evidence are in [research.md](research.md).

## Technical Context

**Language/Version**: JavaScript (ES modules), Node.js 24.x (pinned in `engines`, selected in hPanel)

**Primary Dependencies** (8 production, 0 dev in the root package): `express` 5.3, `react` and `react-dom` 18.3.1 (server-side only), `htm` 3.1, `nodemailer` 10.6, `helmet` 8.3, `express-rate-limit` 8.7, `compression` 1.8.2 (added during implementation, see below). Each is justified in the Constitution Check (Principle VI).

**Storage**: None. Content is versioned JSON in the repository; images are committed files. Rate-limit counters and used form tokens are in-memory with expiry and are allowed to reset when Hostinger stops an idle process.

**Testing**: Node's built-in `node:test` with `fetch` against an ephemeral server for unit and integration tests. A separate dev-only `tools/` package (own `package.json`, never installed by Hostinger) holds Playwright with axe-core, stylelint, sharp and Lighthouse for browser, accessibility, CSS and image checks.

**Target Platform**: Hostinger managed Node.js Web App (Business or Cloud plan), deployed from GitHub; entry file `server.js`; environment variables set in hPanel.

**Project Type**: Server-rendered web application (a single project; no separate frontend and backend).

**Performance Goals**: Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, LCP ≤ 2.5 s, CLS ≤ 0.1 on the home page (constitution IV). Plan budgets: zero client JavaScript; no third-party requests; hero image ≤ 150 KB at the mobile size; every image has explicit dimensions; fonts limited to four self-hosted files.

**Constraints**: Stateless; nothing written to disk at runtime; no native binaries or background workers at runtime; the idle process may stop and restart (cold start); 120 s request cap; 15-minute install and build limits; environment variable names limited to `A-Z`, `0-9`, `_`; shared process limits (NPROC 120 on Business); Spanish and English both complete at release; the design system is consumed, never forked.

**Scale/Scope**: 7 page types (Home, Services, About, Technology, FAQ, Contact, Privacy) plus a not-found page and a server-error page, in 2 languages = 14 page routes and 2 error pages per language; 1 form; about 16 images; low-traffic B2B marketing site.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against constitution v1.3.1 (the PATCH that recorded the entry-file, default-port and `?setlang=1` clarifications was applied on 2026-11-17).

| Principle | Status | How the plan satisfies it |
|-----------|--------|---------------------------|
| **I. Design System Fidelity** | PASS | Pages are composed only from design system components rendered server-side. Gaps are filled by adding components to the design system first ([contracts/design-system-additions.md](contracts/design-system-additions.md)). Only `tokens.css`, a sanitised `bundle.css` and `assets/` are served, with a test for no hard-coded values in site CSS. Imagery follows the v1.3.0 rule: monochrome, reviewed, no text, logos or faces, art-direction slot until approved. Light theme only. |
| **II. Brand Voice and Honest Content** | PASS | Copy lives in JSON, reviewed against the voice rules; a test enforces that button and navigation labels in English are no longer than their Spanish counterparts; no statistics are invented; the shipment card is labelled as an example. |
| **III. Hostinger-Ready Node.js** | PASS | `npm install` then `server.js`; reads `PORT` (local default 3000 only when absent, as v1.3.1 permits); all configuration from environment variables with `.env.example`; stateless; no root, Docker or native binaries at runtime; `DEPLOY.md` planned. Hostinger runs `npm install` and an entry file rather than `npm ci` and `npm start`; the repo provides both paths (v1.3.1 records this) and Spike S1 verifies the port. |
| **IV. Accessible, Responsive, Fast, Crawlable** | PASS | Server-rendered HTML with no client JavaScript; native `details` for the mobile menu and FAQ so they work without scripts; `lang`, canonical, `hreflang`, Open Graph and unique titles per page; sitemap; self-hosted fonts; responsive images with explicit dimensions; Lighthouse and axe gates in `tools/`. |
| **V. Security and Privacy by Default** | PASS | Helmet with strict CSP and HSTS; validation and rate limiting on the one input endpoint; no third-party scripts, trackers or embeds; one first-party cookie (language code only); `npm audit` gate. |
| **VI. Simplicity** | PASS | Eight production dependencies, each with a requirement (below); no build step; no database; language negotiation uses Express's built-in `acceptsLanguages`; hand-written validation for six fields; JSON content instead of a CMS. |
| **VII. Bilingual by Default** | PASS, with one interpretation | All requirements implemented as written. The toggle's links are the real equivalent URLs with `?setlang=1`, which sets the cookie without an extra redirect hop and without letting inbound links change a saved choice. Cache headers on the `/` redirect include `Vary: Accept-Language, Cookie`. |
| **VIII. Contact Form and Email** | PASS | Server-side Nodemailer over SMTP; configuration from environment variables; `From` on the Intello domain with `Reply-To` as the visitor; validation, header-injection stripping, honeypot, rate limit; success shown only after SMTP accepts; no storage; bilingual and works without JavaScript; privacy notice; form controls added to the design system first. |

**Dependency justification (Principle VI)**

| Dependency | Requirement it serves |
|------------|----------------------|
| `express` | HTTP routing, static files, form parsing, `acceptsLanguages` (FR-001, FR-027, FR-029) |
| `react`, `react-dom` | Required by the design system components; used on the server only (FR-031) |
| `htm` | Readable page templates without a build step (Principle III, R5) |
| `nodemailer` | SMTP delivery of enquiries (FR-020, FR-021) |
| `helmet` | Correct security headers and CSP (FR-040, Principle V) |
| `express-rate-limit` | Abuse protection on the form (FR-022) |
| `compression` | gzip for HTML and CSS so the home page meets the Lighthouse LCP target (constitution IV, SC-008) whether or not the host compresses (spike S6 unverified). Measured locally: home HTML 44 KB to 7 KB; Lighthouse mobile LCP 2.8 s without it, 2.41 s with it. Version 1.8.1 has a high-severity advisory, so 1.8.2 is pinned. Added 2026-11-17. |

**Gate result**: PASS. No unjustified violations; Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-intello-marketing-website/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── http-routes.md
│   ├── contact-form.md
│   ├── content-schema.md
│   ├── environment.md
│   └── design-system-additions.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks, not created here)
```

### Source Code (repository root)

```text
server.js                         # Hostinger entry file; also what `npm start` runs
package.json                      # engines: node >=24 <25; 7 production dependencies
package-lock.json
.env.example                      # every variable, no real values
DEPLOY.md                         # Hostinger steps, variables, rollback
src/
├── app.js                        # builds the Express app: middleware order, routes
├── config.js                     # environment parsing, fail-fast checks, placeholder guard
├── i18n/
│   ├── locales.js                # supported languages, page map and slugs, equivalent-URL helper
│   ├── negotiate.js              # cookie, then Accept-Language, then Spanish
│   └── content.js                # loads and validates content JSON, exposes lookups
├── ds/
│   ├── load.js                   # evaluates the design system bundle in a sandbox
│   └── assets.js                 # serves tokens.css, sanitised bundle.css, assets/ with hashed URLs
├── render/
│   ├── html.js                   # htm bound to React; document shell: meta, hreflang, canonical, OG
│   └── frame.js                  # shared page frame: skip link, NavBar, footer, toggle
├── pages/
│   ├── home.js  services.js  about.js  technology.js
│   └── faq.js  contact.js  privacy.js  not-found.js  error.js
├── routes/
│   ├── entry.js                  # GET /
│   ├── pages.js                  # language-prefixed page routes and 404
│   ├── contact.js                # POST handlers per language
│   └── seo.js                    # sitemap.xml, robots.txt, healthz
├── contact/
│   ├── validate.js               # field rules and messages keys
│   ├── token.js                  # signed single-use form token
│   └── mailer.js                 # builds and sends the message (SMTP or dev JSON transport)
└── security/
    ├── headers.js                # Helmet configuration
    └── limits.js                 # rate limiters
content/
├── structure.json                # language-neutral: page keys, service ids, icons, anchors, topics, image slots
├── site.json                     # phone, hours, address, placeholder flag
├── email.json                    # team-facing (Spanish) labels for the notification email
├── images.json                   # per image: files, brief, model, date, approved, alt es/en
├── es/                           # common, home, services, about, technology, faq, contact, privacy, not-found, error (JSON)
└── en/                           # same file set and same key tree
public/
├── css/fonts.css                 # @font-face for self-hosted Montserrat
├── fonts/                        # montserrat woff2 files
├── img/                          # optimised webp at 480/960/1600 plus og.jpg
└── favicon.svg
"Intello Design System"/          # existing source of truth, plus the additions in the contract
tests/
├── unit/                         # negotiation, content parity, validation, tokens, config
└── integration/                  # routing, language behaviour, contact flow, SEO, DS assets, headers
tools/                            # dev-only, own package.json (never installed by Hostinger)
├── package.json
├── optimize-images.mjs
├── a11y.mjs                      # Playwright + axe over every route and language
├── visual.mjs                    # screenshots at 360, 768, 1240 px for review
└── stylelint.config.mjs
```

**Structure Decision**: a single Node.js project at the repository root with the Hostinger entry file at its top level. The design system folder stays where it is and remains the visual source of truth; dev-only tooling is isolated in `tools/` so the deployed install stays small.

## Delivery Phases

The detailed task list is produced by `/speckit-tasks`. The order below is what makes the work safe.

| Phase | Goal | Gate to leave the phase |
|-------|------|-------------------------|
| **0. Hosting spike** | Deploy a hello-world to Hostinger and answer: S1 which port is provided; S2 whether outbound SMTP works on 465 or 587 (`transporter.verify()`); S3 whether proxy headers need `trust proxy`; S4 cold-start time after an idle stop; S5 whether the `/` redirect varies by `Accept-Language` and cookie; S6 whether `Content-Encoding` compression is applied; S7 Node 24 selectable and `npm install` time; S8 HTTPS certificate on the chosen domain and that the app sees HTTPS through the proxy (for `Secure` cookies and HSTS). | Written results in `research.md`; any blocked item has a recorded fallback decision. |
| **1. Design-system additions** | Add and document the components in the contract (each with component, README, preview, bundle and types), self-host fonts, and add CSS lint to the design system checks. | All additions render server-side in the test harness; previews reviewed in both languages. |
| **2. Application skeleton** | `server.js`, config, security headers, DS loading and asset routes, content loading and parity test, language negotiation and routing, document shell, frame. | Integration tests for routing, language behaviour and headers pass. |
| **3. Pages** | Home first, then Contact (page only), Services, Technology, About, FAQ, Privacy, 404, using placeholder art-direction slots. | Every page renders in both languages; axe clean. |
| **4. Contact form** | Validation, token, honeypot, rate limit, mailer, failure and success views. | Contact tests pass with a mocked transport; Spike S2 result applied. |
| **5. Imagery** | Owner approves each batch; generate, review, optimise, register in `content/images.json`, switch slots to images. | Every image reviewed against the constitution; Lighthouse targets met. |
| **6. Hardening and release** | `DEPLOY.md`, `.env.example`, quality gates run, staging deploy on a temporary domain, real SMTP delivery check, client content and details replace placeholders, production deploy. | All constitution quality gates pass; placeholder guard passes. |

## Post-Design Constitution Re-check

Re-evaluated after Phase 1 (data model, contracts, quickstart): **PASS**, no new violations. Two design findings were folded back in:

- The design system emits inline style attributes, so the CSP allows `style-src-attr 'unsafe-inline'` while keeping `script-src 'none'` and no `<style>` or `<script>` elements ([contracts/http-routes.md](contracts/http-routes.md)). This is consistent with Principle V.
- The spike gained S8 (HTTPS and proxy visibility) because Principle V requires HTTPS and the Hostinger documentation does not describe certificates.

Items that remain `UNVERIFIED` (port, outbound SMTP, proxy headers, runtime file-system behaviour, caching of the entry redirect, compression) are all assigned to spike steps S1 to S8 and block Phase 2 until answered.

## Follow-ups

1. **Constitution clarification (PATCH 1.3.1): done 2026-11-17.** It records the entry file and `npm install`, the default port only when `PORT` is absent, the `?setlang=1` toggle links, and `Vary: Accept-Language, Cookie` on the entry redirect, and it resolves `TODO(HOSTING_PLAN)` (managed Web App), `TODO(NODE_VERSION)` (24.x) and `TODO(FORM_COMPONENTS)`. Still open: `TODO(HOSTING_TIER)`, `TODO(MAIL_LIBRARY)`, `TODO(CONTACT_RECIPIENT)`, `TODO(SMTP_ACCOUNT)`, `TODO(GOTHAM_LICENCE)`.
2. **Client inputs needed before launch**: phone, hours and address; the enquiry recipient address or addresses; the sending mailbox; the privacy notice text; confirmation of any "24/7" claim; the Hostinger plan tier.
3. **Owner approval needed before Phase 5**: the image list in [research.md](research.md#r11-imagery-workflow-higgsfield) and the estimated spend of about 17.75 credits first pass, about 53 credits worst case.

## Complexity Tracking

No constitution violations to justify.
