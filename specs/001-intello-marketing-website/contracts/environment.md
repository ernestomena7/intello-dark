# Contract: Environment Variables

**Plan**: [../plan.md](../plan.md) | **Constitution**: Principles III and VIII

Set in Hostinger hPanel under the app's Environment variables (saving redeploys), or in a local `.env` file that is never committed. Names use only `A-Z`, `0-9` and `_`, as Hostinger requires. `.env.example` lists every name with no real values.

| Name | Required in production | Example | Secret | Purpose |
|------|------------------------|---------|--------|---------|
| `NODE_ENV` | Yes | `production` | No | Enables production behaviour: strict start-up checks, HSTS, `Secure` cookies |
| `PORT` | If provided by the host | (set by Hostinger) | No | Listening port; the app falls back to a local default of 3000 only when this is absent (permitted by constitution v1.3.1) |
| `SITE_URL` | Yes | `https://example.com` | No | Base URL for canonical links, `hreflang`, sitemap and Open Graph |
| `TRUST_PROXY` | Yes (value from Spike S3) | `1` | No | Number of proxy hops to trust so client addresses and HTTPS are read correctly |
| `SMTP_HOST` | Yes | `smtp.hostinger.com` | No | Mail server host |
| `SMTP_PORT` | Yes | `465` | No | `465` (secure from the start) or `587` (STARTTLS) |
| `SMTP_SECURE` | Yes | `true` | No | `true` for 465, `false` for 587 |
| `SMTP_USER` | Yes | the full mailbox address | Yes | SMTP login |
| `SMTP_PASS` | Yes | (mailbox password) | **Yes** | SMTP password |
| `CONTACT_FROM` | Yes | a mailbox on the Intello domain | No | `From` address of notification emails |
| `CONTACT_TO` | Yes | comma-separated addresses | Treat as private | Who receives enquiries; never sent to the browser |
| `FORM_TOKEN_SECRET` | Yes | random string, at least 32 characters | **Yes** | Signs the single-use form token |
| `ALLOW_PLACEHOLDERS` | Staging only | `1` | No | Lets a staging deploy start while `content/site.json` still has placeholder details |
| `LOG_LEVEL` | No | `info` | No | `info` or `debug` |

## Start-up rules

- In production the app **fails fast** with a clear message naming the missing or invalid variables (names only, never values) if any required variable is absent, `FORM_TOKEN_SECRET` is shorter than 32 characters, or `SMTP_SECURE` disagrees with `SMTP_PORT`.
- In production the app **refuses to start** while `content/site.json` has `placeholder: true`, unless `ALLOW_PLACEHOLDERS=1`.
- Outside production, if `SMTP_HOST` is unset, email is written to the log through Nodemailer's JSON transport instead of being sent. This fallback is **disabled** in production.
- No secret value is ever logged, rendered into HTML or exposed on a route.
