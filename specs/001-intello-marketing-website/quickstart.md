# Quickstart: Validate the Intello Website

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

A run-and-check guide for proving the feature works end to end once built. It describes what to run and what to expect, and does not contain implementation code. Routes are in [contracts/http-routes.md](contracts/http-routes.md), the form in [contracts/contact-form.md](contracts/contact-form.md), variables in [contracts/environment.md](contracts/environment.md).

## Prerequisites

- Node.js 24.x and npm (`node -v` shows `v24.x`).
- A copy of `.env.example` saved as `.env` with local values. With `SMTP_HOST` unset, emails are written to the log instead of sent.
- For the browser checks: `tools/` dependencies installed once (`npm ci` inside `tools/`).

## Setup and run

1. `npm install`
2. Copy `.env.example` to `.env`; set `SITE_URL=http://localhost:3000`, `FORM_TOKEN_SECRET` (32+ characters) and, for local use, `ALLOW_PLACEHOLDERS=1`.
3. `npm start`, then open `http://localhost:3000/`.

**Expected**: the server logs one start-up line (port, Node version, language list) and `GET /healthz` returns `{"status":"ok"}`.

## Automated checks

| Command | Expected |
|---------|----------|
| `npm test` | All unit and integration tests pass (content parity, language negotiation, routing, headers, form behaviour, design system assets) |
| `npm audit --omit=dev` | No unresolved high or critical issues |
| In `tools/`: the accessibility, CSS lint and visual scripts | Zero serious or critical axe findings on every route and language; CSS lint clean; screenshots written for review at 360, 768 and 1240 px |
| Lighthouse (mobile) on the home page | Performance ≥ 90, Accessibility ≥ 95, LCP ≤ 2.5 s, CLS ≤ 0.1 |

## Scenario 1: Understand Intello from the homepage (User Story 1; FR-006 to FR-013, SC-001, SC-011)

1. Open `/es/` at 1240 px.
2. **Expected**: logo, centred links with a dot under *Inicio*, language toggle, phone with hours and the *Solicitar demo* pill in the navigation; an eyebrow, two-tone headline, lede, primary button with arrow and four capability highlights in the hero; a large monochrome image with the example shipment card and the capability chip; a white rounded panel overlapping the hero bottom holding the about block, a hairline, and four service cards; a closing call to action; the footer.
3. Select a service card. **Expected**: the Services page at that service's section.
4. Compare with the reference screenshot. **Expected**: same structure and mood (light page, two-tone headline, dominant monochrome imagery, overlapping white panel, four cards).

## Scenario 2: Contact Intello (User Story 2; FR-018 to FR-025, SC-002, SC-003)

1. From any page, select *Solicitar demo*. **Expected**: the contact form in two selections or fewer.
2. Submit empty. **Expected**: `422`, errors beside the three required fields in Spanish, a summary announced at the top, nothing sent.
3. Submit valid details. **Expected**: redirect to `?sent=1`, confirmation shown; with local settings the log shows one message with the visitor as `Reply-To` and the language stated.
4. Reload the confirmation and re-post the same form. **Expected**: no second email.
5. Fill the hidden honeypot (for example with a command-line post). **Expected**: normal-looking redirect, nothing sent, one `honeypot` log line.
6. Send six valid posts within 15 minutes. **Expected**: the sixth returns `429`.
7. Break the mail settings and submit. **Expected**: `503`, failure notice with the phone number, no stack trace on screen, an error log line without the message text.
8. Repeat step 3 at `/en/contact`. **Expected**: everything in English.
9. Disable scripts in the browser and repeat step 3. **Expected**: identical behaviour (there is no client script at all).

## Scenario 3: Language (User Story 3; FR-026 to FR-030, SC-004, SC-005)

| Request | Expected |
|---------|----------|
| `GET /` with `Accept-Language: en-US,en;q=0.9` | `302` to `/en/` |
| `GET /` with `Accept-Language: es-SV,es;q=0.9,en;q=0.5` | `302` to `/es/` |
| `GET /` with `Accept-Language: pt-BR,pt;q=0.9` | `302` to `/es/` |
| `GET /` with no `Accept-Language` | `302` to `/es/` |
| `GET /` with `Accept-Language: en` and cookie `itl_lang=es` | `302` to `/es/` |
| `GET /en/services` with a Spanish browser and a Spanish cookie | English page |
| `GET /es/servicios?setlang=1` | Spanish page and `Set-Cookie: itl_lang=es` |
| `GET /es/servicios` (no flag) | No `Set-Cookie` |

Also check: the toggle shows `ES` and `EN`, each link goes to the equivalent page, and it works with scripts off; the `/` response has `Cache-Control: no-store` and `Vary: Accept-Language, Cookie`; each page head has `hreflang` for `es`, `en` and `x-default`, plus its own canonical; `/sitemap.xml` lists all 14 page URLs with alternates.

## Scenario 4: Services and Technology (User Story 4; FR-014, FR-015)

1. Open `/en/services`. **Expected**: four sections with summary, deliverables, monochrome image and a link to the contact form with the topic preselected.
2. Open `/en/technology`. **Expected**: plain-language capabilities (alerts, forecasts, dashboards, integrations); no robots, brains or sparkles.

## Scenario 5: About and FAQ (User Story 5; FR-016, FR-017)

1. Open `/es/preguntas` and operate every question with the keyboard only (Tab, Enter or Space). **Expected**: each opens and closes; focus is always visible.
2. Read `/es/nosotros`. **Expected**: only client-confirmed statements and no invented figures.

## Scenario 6: Resilience and quality (edge cases, FR-037 to FR-040, SC-006 to SC-010)

- Widths of 360, 768 and 1240 px in both languages: no horizontal scroll or overlap; below 900 px the menu opens and closes by keyboard and touch.
- Unknown URL under `/es/` and under `/en/`: a branded not-found page in that language.
- Response headers on any page: strict CSP with `script-src 'none'`, no `X-Powered-By`.
- Network panel on the home page: no request to any other origin (no fonts, scripts or trackers); the served `bundle.css` contains no `googleapis`.
- Every image has dimensions and alt text in the page language.
- Start the app in production mode with placeholder details still set. **Expected**: it refuses to start with a clear message.

## Deployment smoke test (after each Hostinger deploy)

1. In hPanel confirm Node 24.x, entry file `server.js`, the environment variables from the contract, and that the deploy succeeded.
2. `GET https://<domain>/healthz` returns `{"status":"ok"}`.
3. Repeat Scenario 3's first four rows against the live domain.
4. Submit the contact form once from the live site. **Expected**: the message arrives in the configured inbox with the visitor as `Reply-To`. This is the real SMTP delivery check required by the constitution.
5. Run Lighthouse on the live home page and record the scores.
