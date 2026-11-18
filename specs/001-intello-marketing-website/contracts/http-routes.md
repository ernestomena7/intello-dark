# Contract: HTTP Routes

**Plan**: [../plan.md](../plan.md) | **Spec**: FR-001 to FR-005, FR-027 to FR-029, FR-039

## Page routes (GET)

Every page exists in both languages under its own prefix. Slugs are localised.

| Page key | Spanish | English |
|----------|---------|---------|
| home | `/es/` | `/en/` |
| services | `/es/servicios` | `/en/services` |
| about | `/es/nosotros` | `/en/about` |
| technology | `/es/tecnologia` | `/en/technology` |
| faq | `/es/preguntas` | `/en/faq` |
| contact | `/es/contacto` | `/en/contact` |
| privacy | `/es/privacidad` | `/en/privacy` |

**Behaviour**
- `200` with complete server-rendered HTML; `<html lang="es|en">`; `Content-Language` header matches.
- `/es` and `/en` (no trailing slash) redirect `301` to `/es/` and `/en/`.
- A language-prefixed URL **always** serves that language, regardless of cookie or browser (FR-027, edge case "link names a language").
- Unknown paths under a language prefix return `404` using that language's not-found page. Unknown unprefixed paths return `404` using the language chosen by cookie, then browser, then Spanish.
- Every page head carries: `<title>`, meta description, canonical (without query), `hreflang` for `es` and `en` plus `x-default` pointing to the Spanish URL, and Open Graph tags.
- `Cache-Control: no-cache` with an `ETag`, so revalidation is cheap. **Exception**: the contact page in every state (including `?sent=1`, `?topic=` and the `422`, `429` and `503` results) is never cached by the server or sent with an `ETag`, because each response carries its own form token; `Cache-Control: no-store`.
- Unhandled failures return `500` with the error page of the route's language (never a stack trace or message). A body over the limit returns `413` with the error page's "too large" text.

## Entry route

`GET /`

| Condition (checked in order) | Result |
|------------------------------|--------|
| Cookie `itl_lang` is `es` or `en` | `302` to `/{cookie}/` |
| `Accept-Language` best supported match is English | `302` to `/en/` |
| Anything else (Spanish best match, header missing, only unsupported languages) | `302` to `/es/` |

Response headers: `Cache-Control: no-store`, `Vary: Accept-Language, Cookie`. No other unprefixed URL redirects.

## Language selection

The toggle's two links are the real equivalent page URLs with a query flag:

`GET /{lang}/{slug}?setlang=1`

- Responds exactly like the page route and additionally sets the cookie `itl_lang={lang}` (`Max-Age` one year, `Path=/`, `SameSite=Lax`, `HttpOnly`, `Secure` in production).
- The canonical URL in the response never includes the flag. Toggle links carry `rel="nofollow"`.
- A page URL **without** the flag never changes the cookie.

## Contact submission

`POST /es/contacto` and `POST /en/contact`, `Content-Type: application/x-www-form-urlencoded`, body limit 16 KB. Field rules in [contact-form.md](contact-form.md).

| Outcome | Status | Response |
|---------|--------|----------|
| Sent | `303` | Redirect to the contact URL with `?sent=1`; that page shows the confirmation |
| Honeypot filled | `303` | Same redirect as "Sent"; nothing is sent; logged |
| Validation failed | `422` | Contact page with errors beside fields and entries kept |
| Token missing, too fast, expired or already used | `422` | Contact page with a fresh token and a notice; nothing sent |
| Rate limit exceeded | `429` | Contact page with a notice; `Retry-After` header |
| Mail delivery failed | `503` | Contact page with a failure notice and the phone number; error logged |
| Body larger than the limit | `413` | The error page's "too large" text in the page's language |

All messages are in the language of the route.

## Utility routes

| Route | Purpose |
|-------|---------|
| `GET /sitemap.xml` | Lists every page in both languages with `xhtml:link` alternates |
| `GET /robots.txt` | Allows all; points to the sitemap |
| `GET /healthz` | `200` with `{"status":"ok"}`; no secrets, used by the hosting spike and smoke checks |

## Static routes

| Route | Source | Notes |
|-------|--------|-------|
| `/ds/tokens.css` | `Intello Design System/tokens.css` | Hashed URL (`?v=`), cached for one year |
| `/ds/bundle.css` | `Intello Design System/components/bundle.css` with the Google Fonts `@import` removed | Test asserts no `googleapis` text is served |
| `/ds/assets/*` | `Intello Design System/assets/` | Logos and icons only |
| `/css/fonts.css`, `/fonts/*` | `public/` | Self-hosted Montserrat |
| `/img/*`, `/favicon.svg` | `public/` | Hashed or versioned, cached for one year |

The design system's JavaScript bundle, previews and READMEs are **never** served.

## Security headers (all responses)

`Content-Security-Policy: default-src 'self'; script-src 'none'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`, `Strict-Transport-Security` in production, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and no `X-Powered-By`.

**Why `style-src-attr 'unsafe-inline'`**: design system components emit inline `style` attributes (for example `ImageTile` sets `aspect-ratio`, and progress indicators set widths). This directive allows only style *attributes*, not `<style>` elements, and because `script-src` is `'none'` there is no script that inline styles could help to run. All dynamic text is escaped by React. A test asserts the policy string and that no `<style>` element or inline `<script>` appears in any page.
