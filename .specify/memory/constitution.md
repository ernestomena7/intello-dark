<!--
SYNC IMPACT REPORT (temporary review scratch; remove before committing)
Version change: 1.4.0 → 1.5.0 (MINOR, 2026-11-18): Principle II gains a Positioning rule at the owner's request: Intello provides cargo monitoring and business intelligence for logistics companies and is not itself a logistics company. All site copy (home, services, about, technology, FAQ, contact, footer, metadata, email topics) was rewritten, and a content test (rule 8) now fails if old operator-style taglines return.

Previous amendment (1.4.0):
Version change: 1.3.2 → 1.4.0 (MINOR, 2026-11-18): Principle I imagery rule changed from monochrome to muted colour close to the design system palette, at the owner's request (the black and white pictures were not wanted). Technology section Imagery bullet unchanged in substance. Design system README, ImageTile README and the spec (FR-007, FR-010, FR-011, FR-034, FR-036, Image asset, SC-011) were updated to match.

Previous amendment (1.3.2):
Version change: 1.3.1 → 1.3.2 (PATCH): `container-max` token raised from 1240px to 1400px at the owner's request (the site looked too narrow); Principle IV width range and Quality Gate 4 widths updated to 1440px. tokens.json and tokens.css were edited together by hand (no generator is vendored).

Previous amendment (1.3.1):
Version change: 1.3.0 → 1.3.1
Bump rationale: PATCH. Clarifications that align the text with verified Hostinger behaviour and
the approved plan; no principle is added, removed or loosened in substance.
Modified: III (npm tooling wording; the app has an entry file `server.js`; local default port
only when PORT is absent); VII (switcher links may carry the `?setlang=1` flag; entry redirect
varies on Accept-Language and Cookie); Technology and Hosting Constraints (Runtime pinned to
Node.js 24.x; Hosting resolved to a managed Node.js Web App; form components specified); Quality
Gates item 1 (clean install wording).
Resolved: TODO(NODE_VERSION), TODO(HOSTING_PLAN) (type; tier still open), TODO(FORM_COMPONENTS).
Still open: TODO(HOSTING_TIER), TODO(GOTHAM_LICENCE), TODO(CONTACT_RECIPIENT),
TODO(SMTP_ACCOUNT), TODO(MAIL_LIBRARY); design system docs still describe the horizontal lockup
as "pending brand approval".

Previous amendment (1.3.0), kept for review:
Version change: 1.2.0 → 1.3.0
Bump rationale: MINOR. The Principle I imagery rule is materially expanded to permit reviewed,
photographic AI-generated imagery. It loosens a rule, so existing compliant work stays compliant.
Modified: I. Design System Fidelity (imagery bullet); Technology and Hosting Constraints
(new Imagery bullet).
Resolved: the design system README imagery rule was updated to match this amendment.

Previous amendment (1.2.0), kept for review: new principle VIII (contact form and email
delivery); the other edits followed design-system and brand decisions.

Modified principles:
  I. Design System Fidelity (horizontal lockup now approved; narrow exception allowing repair
     of generation defects in tokens.css)
  VII. Bilingual by Default (switcher MUST use link mode, so switching works without JavaScript)
Added principles:
  VIII. Contact Form and Email Delivery
Added sections: none
Removed sections: none
Also updated: Technology and Hosting Constraints (Email); Quality Gates (CSS lint, mail
transport tests, tokens.css repair record, references now "Principles I–VIII").
Resolved: TODO(HORIZONTAL_LOGO) (approved); tokens.css "}}" defect (repaired 2026-11-17);
no-JS gap in the language switcher (LanguageToggle link mode added to the design system).
History: 1.1.1 aligned with LanguageToggle; 1.1.0 added Principle VII; 1.0.0 initial adoption.

Deferred items / follow-up TODOs:
  - TODO(HOSTING_PLAN): confirm Hostinger product (managed Node.js web app vs VPS).
  - TODO(NODE_VERSION): pin the Node.js LTS major once the hosting plan is known.
  - TODO(GOTHAM_LICENCE): licensed Gotham web files are not yet in the design system.
  - TODO(CONTACT_RECIPIENT): confirm which address(es) receive contact form submissions.
  - TODO(SMTP_ACCOUNT): confirm the sending mailbox (for example Hostinger email on the Intello
    domain) and that outbound SMTP works on the chosen plan.
  - TODO(MAIL_LIBRARY): "jsmailer" was interpreted as Nodemailer; confirm.
  - TODO(FORM_COMPONENTS): the design system has no form field components yet.
  - Design system docs (README, Logo README) still describe the horizontal lockup as "pending
    brand approval"; update them to record the approval.

Templates: no versioned template layer was modified (out of scope for this command).
-->

# Intello Website Constitution

## Core Principles

### I. Design System Fidelity (NON-NEGOTIABLE)

The website MUST be built from the `Intello Design System` folder and from nothing else visually.
The design system is the single source of truth for colour, type, spacing, shape, logo, icons and
components.

- Visual values MUST come from design tokens (`tokens.json` is the source; `tokens.css` is
  generated from it and MUST NOT be hand-edited except to repair generation defects recorded
  under Quality Gates). Hard-coded colours, font sizes, spacing, radii
  and shadows in site code are forbidden.
- Existing components (the `itl-` prefixed set: `NavBar`, `Hero`, `Section`, `ServiceCard`,
  `Button`, `StatusBadge`, `TrackingCard`, etc.) MUST be used instead of re-implementing them.
  A pattern with no matching component MUST be added to the design system first (component,
  README guidelines, preview), then consumed by the site.
- Light and dark themes MUST work through `data-theme="light|dark"` on the page wrapper.
- Brand rules from the design system README MUST hold: text is navy `ink`, never black; yellow is
  never text or a thin icon on a light surface and is limited to one accent per view; every
  interactive element is a pill or circle; cards use `line` hairlines or `shadow-float`, with no
  gradients and no coloured left borders; every interactive element shows the 2px `focus-ring`.
- Logos MUST be the approved files in `assets/Logos` or the `Logo` component. The stacked master
  lockup is used at 200px minimum width on screen; the horizontal lockup (`layout="horizontal"`,
  brand-approved) and the mark alone (`layout="mark"`) are also approved. All keep 2x clear
  space. Recolouring, distortion, a changed wordmark or altered mark-to-wordmark proportions are
  forbidden.
- Icons MUST be the Lucide set in `assets/Icons` (or the `Icon` component). No emoji, robots,
  brains or sparkles as decoration.
- Imagery MUST be photographic in quality, high-key with soft daylight, and in colour with a
  restrained, slightly desaturated palette close to the design system's (deep navy, steel blue,
  warm light greys and off-whites, at most a small soft yellow accent). Bright, saturated or neon
  colours, strong colour casts and gradients-as-decoration are forbidden. Imagery MUST show real
  logistics subjects such as warehouses, ports, trucks, air cargo, operations floors
  and people working with dashboards. Images generated with the Higgsfield connector are
  permitted, provided each one is reviewed and approved before use; has no embedded text, no
  third-party logos and no face that could be mistaken for a real client or staff member; and is
  not cartoon, clip-art or otherwise low-quality synthetic in style. Real photography of Intello's
  own operation SHOULD replace generated images as it becomes available. Stock imagery MUST NOT
  ship. Until an approved image exists, the `ImageTile` art-direction slot MUST be used.

Rationale: the brand is "calm, precise, light, with everything in its place". Drift in small
details is how a premium logistics identity becomes generic.

### II. Brand Voice and Honest Content

All user-facing copy, in every supported language (see Principle VII), MUST follow the design
system's content fundamentals.

- Spanish (Latin America) is the primary voice: address the reader as *tú* and refer to Intello
  as *nosotros*. The English copy MUST use the equivalent direct voice ("you" / "we") and be
  adapted to read naturally, not translated word for word.
- Sentence case everywhere (headlines, buttons, navigation). No exclamation marks, no emoji.
- Headlines are short and split into two tones (claim in `ink`, qualifier in `ink-subtle`).
  `ink-subtle` MUST NOT be used for body copy or for text under 24px.
- Buttons start with a verb, have two or three words, and carry the arrow.
- AI is described by what it does ("alertas por IA", "pronósticos de demanda"), never as a mascot.
- Positioning: Intello is a provider of cargo monitoring and business intelligence (with technology
  and back office services) FOR logistics companies. It is NOT a logistics, transport, freight or
  warehousing company. Copy, imagery captions, metadata and emails MUST NOT claim or imply that
  Intello moves, stores, delivers or operates cargo, and MUST say plainly that it does not where
  a visitor could assume it (About page, FAQ). Pictures of logistics operations show the client's
  world, never Intello's own operation.
- Numbers, client counts and percentages MUST be real and sourced. Invented figures for layout
  purposes are forbidden; use a capability such as "24/7" instead.
- Shipment status MUST pair colour with a word and an icon (`StatusBadge`).

Rationale: Intello sells operational trust. One invented statistic undermines the whole site.

### III. Hostinger-Ready Node.js Application (NON-NEGOTIABLE)

The site is a Node.js application that MUST be deployable to a Hostinger server without manual
patching on the server.

- The app MUST install and start with standard npm tooling: `npm ci` (or `npm install`, which is
  what the Hostinger managed Web App runs), `npm run build` (when a build step exists) and
  `npm start`. Because the managed host runs an entry file rather than a start command, the
  repository MUST also provide a top-level entry file (`server.js`) that starts the same server
  as `npm start`.
- The app MUST listen on the port provided by `process.env.PORT` and MUST NOT hard-code a host.
  A local development default port MAY be used only when `PORT` is absent, and MUST be documented
  in `.env.example`.
- All configuration and secrets MUST come from environment variables. A documented `.env.example`
  MUST exist; real `.env` files and secrets MUST NOT be committed.
- The app MUST run on the pinned Node.js LTS version declared in `package.json` `engines`.
- The app MUST be stateless: no required writes to the local filesystem at runtime beyond
  temporary files and logs. Persistent data MUST live in an external service or database.
- The app MUST NOT require root access, Docker, system packages, long-lived background workers or
  native binaries unless the Hostinger plan in use is confirmed to support them and the
  requirement is recorded in the plan.
- A `DEPLOY.md` MUST document the exact Hostinger steps (Node version, build command, start
  command, entry file, environment variables) and the rollback procedure.

Rationale: hosting is a hard constraint, not a later concern. Deploy surprises are avoided by
designing for the host from the first commit.

### IV. Accessible, Responsive, Fast, Crawlable

- Pages MUST meet WCAG 2.1 AA: contrast per design tokens, keyboard operability, visible focus,
  semantic landmarks and headings, meaningful `alt` text, and a `lang` attribute on the document
  that matches the language being served (`es` or `en`).
- Layouts MUST work from 360px to 1440px+ (`container-max`, 1400px). Below 900px the navigation collapses
  and the site MUST supply its own accessible menu toggle.
- Public pages MUST be server-rendered so the first HTML response contains the content (SEO and
  speed). Client-side JavaScript MUST be limited to progressive enhancement.
- Production performance targets, measured on the mobile profile, are Lighthouse Performance
  ≥ 90, Accessibility ≥ 95, LCP ≤ 2.5 s and CLS ≤ 0.1 on the home page. A regression beyond these
  targets blocks release unless an exception is recorded in the plan.
- Every page, in each language, MUST have a unique title, meta description, canonical URL and
  Open Graph data, plus `hreflang` alternates (see Principle VII).
- Fonts MUST be served from our own origin in production (Montserrat fallback is OFL-licensed and
  may be self-hosted). Gotham MUST be added only with licensed web files; unlicensed copies MUST
  NOT be used.

Rationale: a logistics buyer reads the site on a phone between calls; speed and clarity are part
of the brand promise.

### V. Security and Privacy by Default

- Production traffic MUST use HTTPS, with security headers (CSP, HSTS, X-Content-Type-Options,
  Referrer-Policy, frame protections) configured in the app.
- Every endpoint that accepts user input (contact, demo request, tracking lookup) MUST validate
  and sanitise input on the server, enforce rate limiting, and return no internal error details.
- Personal data collected MUST be limited to what the form needs. Third-party scripts, analytics
  and embeds MUST NOT be added without an explicit, recorded decision stating purpose and data
  shared.
- Dependencies MUST be reviewed before adding, kept to maintained packages, and `npm audit` MUST
  show no unresolved high or critical issues at release.

Rationale: the site fronts a company that handles other companies' shipment data.

### VI. Simplicity

- Start with the simplest architecture that satisfies the specification (YAGNI). A new
  dependency, service or abstraction MUST be justified in the plan by a requirement it serves.
- Prefer a small number of well-maintained dependencies over many convenience packages.
- Content that rarely changes SHOULD be kept in versioned files rather than a database or CMS
  until a specification requires editing by non-developers.

Rationale: a small team must be able to deploy, understand and maintain this site on a modest
hosting plan.

### VII. Bilingual by Default (Spanish primary, English supported)

The website MUST be fully available in Spanish (`es`, the default) and English (`en`).

- **Language selection.** On a visitor's first request to an unprefixed URL with no saved
  preference, the server MUST read the browser's `Accept-Language` header and serve English if
  English is the best supported match. Spanish MUST be served when the best match is Spanish, when
  the header is missing, and when it names only unsupported languages.
- **User choice wins.** A visible language switcher MUST be present on every page and MUST
  override browser detection. The choice MUST be remembered in a first-party cookie that stores
  only the language code.
- **Switcher component.** The switcher MUST be the design system's `LanguageToggle`, supplied to
  the header through the `NavBar` `language` prop. It shows the codes `ES` and `EN`, each option
  exposes its native name in its accessible name, followed by the visible code so the name
  contains the visible text (WCAG 2.5.3): "Español, ES" and "English, EN". Each option carries
  its own `lang`, and flags MUST NOT be used to represent languages. Selecting a language MUST navigate
  to the equivalent page in that language (not merely swap text in place). Switching MUST work
  without client-side JavaScript: the site MUST give every language an `href` pointing to the
  equivalent page (the component's link mode), so the toggle renders as real links. Those links
  MAY carry a query flag (`?setlang=1`) that tells the server to store the choice; a URL without
  the flag MUST NOT change a saved choice, and canonical URLs MUST NOT include the flag.
- **Distinct URLs.** Each language MUST have its own crawlable URL (for example a path prefix such
  as `/es/` and `/en/`). Detection and redirection apply only to unprefixed entry URLs; a URL that
  names a language MUST always serve that language. Responses that vary by `Accept-Language` or
  by the language cookie MUST send `Vary: Accept-Language, Cookie` (or `Vary: Accept-Language` when
  no cookie is read) and SHOULD also be uncacheable (`Cache-Control: no-store`).
- **SEO signals.** Every page MUST declare `hreflang` alternates for `es` and `en` plus
  `x-default` pointing to the Spanish version, a per-language canonical URL, and a sitemap that
  lists both versions.
- **Full parity.** Every public page, error page (404, 500), form label, validation message,
  confirmation email, `alt` text, `aria-label` and metadata field MUST exist in both languages at
  release. Mixed-language pages and silent fallbacks to another language are forbidden.
- **No hard-coded copy.** User-facing strings MUST live in per-language resource files, not
  inline in components or templates, so a missing translation is detectable by a build or test
  check.
- **Formatting.** Dates, numbers, phone numbers and units MUST be formatted per language (for
  example with `Intl`).
- **Layout.** Layouts MUST hold for both languages. Each English label MUST be no longer than its
  Spanish counterpart (design system rule), and headlines, buttons and navigation labels MUST be
  verified in both languages.
- **Review.** English and Spanish copy SHOULD be reviewed by a fluent reader before release.

Rationale: Intello serves logistics operators across Spanish-speaking markets and international
partners who work in English. The first screen must speak the visitor's language without making
them hunt for a setting, while still letting them choose.

### VIII. Contact Form and Email Delivery

The website MUST provide a contact form whose submissions are emailed to Intello.

- **Server-side sending.** Email MUST be sent by the Node.js server through Nodemailer over
  authenticated SMTP. Mail MUST NOT be sent from the browser, and mail credentials and recipient
  addresses MUST NOT appear in client code or HTML. Browser-side mail services are excluded by
  Principle V.
- **Configuration.** SMTP host, port, credentials, sender and recipients MUST come from
  environment variables (for example `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
  `CONTACT_FROM`, `CONTACT_TO`), documented in `.env.example` and `DEPLOY.md`. `CONTACT_TO` MUST
  accept one or more addresses so recipients can change without a code change.
- **Deliverability.** `From` MUST be a mailbox on the Intello domain that the SMTP account is
  authorised to send as; the visitor's address MUST go in `Reply-To`, never in `From`. SPF, DKIM
  and DMARC for the sending domain MUST be configured before launch.
- **Validation and abuse protection.** The server MUST validate required fields, email format
  and maximum lengths; strip line breaks from any value used in a mail header (header-injection
  protection); rate-limit submissions per client; and include a honeypot field. A third-party
  CAPTCHA MUST NOT be added without the recorded decision required by Principle V.
- **Honest outcomes.** The visitor MUST see success only after SMTP has accepted the message. On
  failure the server MUST log the error with a request id (without the message body), and the
  visitor MUST see a friendly message in their language that offers the phone number as an
  alternative, with no stack traces or SMTP details. Submissions MUST NOT be stored by the site
  unless a specification requires it.
- **Bilingual and accessible.** Labels, hints, validation errors and success and failure
  messages MUST exist in both languages (Principle VII). The notification email MUST state the
  language the visitor used (`es` or `en`). Every field MUST have a visible label, errors MUST be
  tied to their fields and announced to assistive technology, and the form MUST work as a
  standard server-handled POST without client-side JavaScript, which may only enhance it.
- **Privacy notice.** The form MUST state, in both languages, what data is collected and why,
  and link to the privacy notice once one exists. Only fields needed to answer the enquiry may be
  collected.
- **Design system.** Form controls (input, textarea, select, field error, submit state) MUST be
  design-system components, added to the design system first (Principle I).
- **Delivery check.** Real SMTP delivery from the deployed Hostinger environment MUST be verified
  before release; automated tests use a mocked transport.

Rationale: the contact form is the site's main conversion point and its main abuse target. It
must deliver reliably to the right inbox, resist spam and header injection, and never leak
credentials or recipient addresses.

## Technology and Hosting Constraints

- **Runtime**: Node.js 24.x (LTS), pinned in `package.json` `engines` (`>=24 <25`) and recorded in
  `DEPLOY.md`. That Node 24 is selectable in hPanel is verified by the hosting spike (plan S7).
- **Hosting**: Hostinger managed Node.js Web App (not a VPS), deployed from GitHub or a ZIP, with
  the more restrictive managed environment assumed (Principle III). TODO(HOSTING_TIER): confirm
  the plan tier (Business or Cloud) and record it in `DEPLOY.md`.
- **UI layer**: the design system components are React 18 (`components/bundle.js`,
  `components/index.d.ts`). The site MUST consume them without forking. The rendering approach
  (for example server-side React rendering inside Node) is decided in `/speckit-plan` and MUST
  satisfy Principles I, III and IV.
- **Design system location**: `Intello Design System/` is the vendored source of truth. Changes to
  it are design-system changes and follow the amendment rules in Development Workflow.
- **Languages**: Spanish (Latin America, `es`, default) and English (`en`), both required
  (Principle VII). Additional languages require a specification and a constitution amendment.
- **Localization**: the i18n mechanism (resource files, locale routing, detection middleware) is
  chosen in `/speckit-plan` and MUST satisfy Principle VII without client-side-only rendering.
- **Imagery**: generated with the Higgsfield connector under Principle I. Every generation batch
  MUST be approved by the project owner before it runs, because generation spends credits. Each
  accepted image MUST be stored in the repository in optimised form together with its brief and
  the date it was generated, and MUST have an `alt` text in both languages.
- **Email**: Nodemailer over authenticated SMTP, configured only through environment variables
  (Principle VIII). TODO(SMTP_ACCOUNT): confirm the sending mailbox and that outbound SMTP is
  permitted on the chosen Hostinger plan.

## Development Workflow and Quality Gates

- Work follows Spec Kit order: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
  `/speckit-implement`. Every plan MUST include a Constitution Check against Principles I–VIII.
- Before a change is merged or deployed, all of the following MUST pass:
  1. Clean `npm ci` (and `npm run build` when a build step exists) on the pinned Node version,
     and both `npm start` and the entry file `server.js` serving on `process.env.PORT`.
  2. Lint passes and no hard-coded colour, spacing or font-size values appear outside the design
     tokens (automated check). CSS lint (for example stylelint) passes on `tokens.css`,
     `bundle.css` and site styles, so invalid or stray rules are caught.
  3. Automated accessibility check (for example axe) on every changed page, with zero serious or
     critical violations.
  4. Visual comparison against the design system previews at 360px, 768px, 1240px and 1440px, in both
     `es` and `en`, and in light and dark themes where the page supports both.
  5. Server routes and forms that accept input have tests covering valid input, invalid input
     and rate limiting. Contact form tests use a mocked mail transport and assert the recipients,
     `Reply-To`, language code and rejection of header-injection attempts.
  6. `npm audit` shows no unresolved high or critical issues.
  7. Translation parity check: every string key exists in both `es` and `en`, and tests confirm
     language detection (English browser → `en`; Spanish, missing or unsupported → `es`),
     switcher override and cookie persistence, and `hreflang` output.
- Design system changes MUST update the component, its README and its preview together, and
  `tokens.css` MUST be regenerated from `tokens.json` rather than edited by hand, except for
  repairs that restore validity.
- Recorded repair (2026-11-17): the generated `tokens.css` had stray `}}` terminators on its 12
  typography rules (lines 71–82), which can make browsers drop rules. They were repaired by hand
  because no generator is vendored in this repository. Any regeneration of `tokens.css` MUST be
  checked for this defect (the CSS lint gate) and re-repaired if it returns.
- Known design system conflict: `components/bundle.css` begins with an `@import` of Montserrat
  from Google Fonts. Production MUST NOT ship that import (Principles IV and V); the site MUST
  serve self-hosted Montserrat files until licensed Gotham files are added.

## Governance

This constitution supersedes other practices for the Intello website. Where a specification, plan
or task conflicts with it, the constitution wins until it is formally amended.

- **Amendments** require a written change describing what and why, an updated version number, an
  updated Sync Impact Report, and a review of any open specs and plans for conflicts. Principles
  marked NON-NEGOTIABLE may be changed only with an explicit migration plan for existing work.
- **Versioning** follows semantic versioning: MAJOR for removing or redefining a principle in a
  backward-incompatible way; MINOR for adding a principle or section or materially expanding
  guidance; PATCH for clarifications and wording fixes.
- **Compliance review**: every plan MUST pass its Constitution Check, and every pull request MUST
  confirm the quality gates above. Violations MUST be fixed or recorded as justified exceptions in
  the plan, with the simpler alternative that was rejected.
- **Runtime guidance** lives in the design system README and component READMEs for visual and
  content rules, and in `DEPLOY.md` for hosting.

**Version**: 1.5.0 | **Ratified**: 2026-11-17 | **Last Amended**: 2026-11-17
