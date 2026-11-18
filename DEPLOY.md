# Deploying the Intello website to Hostinger

The site is a Node.js app (Express, server-rendered). It runs as a **Hostinger managed Node.js Web App** (not a VPS). This guide covers a first deploy, every setting, updates and rollback. Facts about the host that were still unverified when this was written are marked **Verify**; the hosting spike (`spike/`, steps S1 to S8 in the plan) answers them at the first deploy.

## 1. Before you start

| Need | Detail |
|------|--------|
| Hostinger plan | A plan with **Node.js Web Apps** (Business or Cloud). Record the tier in `.specify/memory/constitution.md` (`TODO(HOSTING_TIER)`). |
| Node version | **24.x** (`engines` is `>=24 <25`). Select it in hPanel. |
| Domain | A domain or subdomain with HTTPS. Use a temporary domain for staging. |
| Mailbox | A Hostinger email account on the Intello domain to send from, and its password. |
| DNS for the sending domain | **SPF, DKIM and DMARC** records for the sending domain, required before launch (constitution Principle VIII). Hostinger shows the SPF and DKIM records for its mailboxes in hPanel under Emails; add a DMARC record (for example `v=DMARC1; p=none; rua=mailto:...`) and tighten it later. Check them with a received test message (see section 6). |
| Client details | Phone, opening hours, address, privacy notice text, recipients (`CONTACT_TO`). Until they are in `content/site.json` with `"placeholder": false`, production refuses to start. |

## 2. How Hostinger runs the app

Hostinger runs **`npm install`** and then starts an **entry file**. It does not run `npm ci` or `npm start`. This repository supports both: the entry file is `server.js` (at the repository root) and `npm start` runs the same file.

- **Build command**: none (there is no build step).
- **Entry file**: `server.js`.
- **Start command** (if the panel asks): `npm start`.
- **Port**: the app listens on `process.env.PORT`. It falls back to 3000 only when `PORT` is absent. **Verify** that Hostinger provides `PORT` (spike S1).

## 3. Environment variables

Set these in hPanel under the app's **Environment variables**. Saving redeploys. Names may use only `A-Z`, `0-9` and `_`. `.env.example` lists every name; never commit a real `.env`.

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Enables strict start-up checks, HSTS and `Secure` cookies |
| `SITE_URL` | `https://your-domain` | No trailing slash; must be `https://` |
| `TRUST_PROXY` | number of proxy hops, probably `1` | **Verify** with spike S3 (`/spike/headers`) |
| `SMTP_HOST` | `smtp.hostinger.com` | |
| `SMTP_PORT` | `465` | or `587` with STARTTLS |
| `SMTP_SECURE` | `true` | `true` for 465, `false` for 587 (the app refuses a mismatch) |
| `SMTP_USER` | the full mailbox address | secret |
| `SMTP_PASS` | the mailbox password | **secret** |
| `CONTACT_FROM` | a mailbox on the Intello domain | the SMTP account must be allowed to send as it |
| `CONTACT_TO` | `a@x.com, b@x.com` | recipients, comma separated; never sent to the browser |
| `FORM_TOKEN_SECRET` | a random string of 32 or more characters | **secret**; generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ALLOW_PLACEHOLDERS` | `1` | **staging only**; remove for production |
| `LOG_LEVEL` | `info` | optional |

Outbound SMTP from the host is **unverified** (spike S2). If it is blocked, use a mail relay that is reachable from the host and record the decision in `specs/001-intello-marketing-website/research.md`.

## 4. First deploy

1. Push the repository to GitHub (or prepare a ZIP of the repository **without** `node_modules`, `tools/`, `spike/` and `.env`).
2. In hPanel create a **Node.js Web App** from the GitHub repository (or upload the ZIP).
3. Choose **Node 24.x**, entry file `server.js`.
4. Add the environment variables from section 3. Use `ALLOW_PLACEHOLDERS=1` on a staging domain until the client details are in.
5. Deploy. Watch the build log: `npm install` must finish within Hostinger's limits.
6. Open `https://<domain>/healthz`. It must show `{"status":"ok"}`.

If the app does not start, the runtime log shows a line naming the missing or invalid variables (names only, never values).

## 5. Updating

Push to the connected branch (or upload a new ZIP) and redeploy. Saving environment variables also redeploys.

- **Text changes**: edit `content/es/*.json` and `content/en/*.json` (both languages; `npm test` fails if a key is missing in either). Contact details are in `content/site.json`.
- **Images**: the registry is `content/images.json`. Briefs, alt text and approval are recorded there. Only images with `"approved": true` are shown; others show an art-direction placeholder.
- **Design system**: edits go in `Intello Design System/` first (component, README, preview), then the site uses them.

## 6. Smoke test after every deploy

1. `GET /healthz` returns `{"status":"ok"}`.
2. Language: `GET /` with `Accept-Language: en` redirects to `/en/`; with `es` or no header to `/es/`; with a saved cookie to that language.
3. Open `/es/` and `/en/` on a phone-width window: menu opens, language toggle works.
4. Send the contact form once from the live site. The message must reach the inbox in `CONTACT_TO`, with the visitor as **Reply-To**. In the received message's headers confirm **SPF, DKIM and DMARC** pass.
5. Run Lighthouse (mobile) on `/es/`: Performance 90 or more, Accessibility 95 or more, LCP 2.5 s or less, CLS 0.1 or less.

## 7. Rollback

- **GitHub deploys**: in hPanel redeploy the previous commit, or `git revert` the bad commit and push.
- **ZIP deploys**: keep the previous ZIP and upload it again.
- **Environment variable mistakes**: restore the previous values and save (this redeploys).

The app stores nothing at runtime (no database, no files), so a rollback never loses data. Enquiries are only emailed.

## 8. Notes

- The process may stop when idle and start again on the next request (cold start). Rate-limit counters and used form tokens are in memory and reset then; at worst one unexpired form token can be reused once.
- Security headers (strict CSP with `script-src 'none'`, HSTS in production) are set by the app. The site loads nothing from another origin.
- Local run: `npm install`, copy `.env.example` to `.env`, `npm start`, open `http://localhost:3000/`. With `SMTP_HOST` unset, contact messages are printed to the console instead of sent.
- Quality checks (dev only, not installed on the host): see `tools/` (`npm install` there once, then `node a11y.mjs`, `node visual.mjs`, `node keyboard.mjs`, `node check-ds-values.mjs`).
