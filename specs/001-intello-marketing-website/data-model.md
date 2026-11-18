# Data Model: Intello Bilingual Marketing Website

**Date**: 2026-11-17 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

The site has no database. Everything below is either versioned content (JSON in the repository), configuration (environment variables), a cookie, or short-lived in-memory state. Nothing a visitor submits is stored (spec FR-025).

## Supported languages

| Code | Name | Role |
|------|------|------|
| `es` | Español | Default, primary voice |
| `en` | English | Supported |

## Page (versioned content and a route map)

A public page with one entry per language.

| Field | Description | Rules |
|-------|-------------|-------|
| `key` | Stable id: `home`, `services`, `about`, `technology`, `faq`, `contact`, `privacy`, `not-found`, `error` | Fixed set; `not-found` and `error` have no slug (they answer other URLs and failures) |
| `slug.es`, `slug.en` | URL segment per language, for example `servicios` and `services`; `home` is the empty segment | Unique within a language; lowercase ASCII; no accents |
| `meta.title`, `meta.description` | Page title and description per language | Required, non-empty, unique across pages in one language; title ≤ 60 characters, description ≤ 160 |
| `meta.ogImage` | Image id from the image registry | Optional; defaults to the site share image |
| `body` | Page content in that language | Shape defined in [contracts/content-schema.md](contracts/content-schema.md) |

**Relationships**: the route map links each page's two language versions; this is what the language toggle, `hreflang` alternates and the sitemap use. A page missing in either language fails the content parity check and the build of the test suite.

## Service

One of four fixed offerings, used on the homepage cards and in sections of the Services page.

| Field | Description |
|-------|-------------|
| `id` | `back-office`, `tracking`, `technology`, `ai-analytics` |
| `title`, `bullets[2]` | Card text per language |
| `summary`, `deliverables[]` | Services page section text per language |
| `icon` | Design system icon name |
| `cardImage`, `sectionImage` | Image ids from the image registry |
| `anchor` | Section id on the Services page, same value in both languages |

**Relationships**: a service card links to its section on the Services page; the contact form's topic list is built from the same four ids plus `other`.

## FAQ entry

| Field | Description | Rules |
|-------|-------------|-------|
| `id` | Stable id | Unique |
| `question`, `answer` | Text per language | Both required in both languages; answer is plain text with optional paragraphs |

## Image asset (registry: `content/images.json`)

| Field | Description | Rules |
|-------|-------------|-------|
| `id` | Stable id, for example `hero-main` | Unique |
| `files` | The 480, 960 and 1600 px webp files and their pixel dimensions | Empty while `approved` is false; all three required once `approved` is true; dimensions recorded to prevent layout shift |
| `ratio` | Aspect ratio, for example `4 / 3` | Matches the files |
| `alt.es`, `alt.en` | Text alternative per language | Required, non-empty |
| `brief` | The prompt and art direction used to generate it | Required |
| `model`, `generatedOn` | Source model and date | Required |
| `approved` | Owner has reviewed it against the constitution | Pages use the image only when true; otherwise the art-direction slot is shown |
| `usage` | Where it appears | Informational |

## Site settings (`content/site.json`)

| Field | Description | Rules |
|-------|-------------|-------|
| `phone` | Phone number as displayed and as a dial link | Supplied by the client |
| `hours` | Opening hours text per language | Supplied by the client |
| `address` | Optional postal address per language | Optional |
| `placeholder` | True while any value above is a placeholder | In production the app refuses to start while true, unless `ALLOW_PLACEHOLDERS=1` |

Recipient addresses and mail credentials are **not** here; they are environment variables ([contracts/environment.md](contracts/environment.md)).

## Language preference (cookie `itl_lang`)

| Aspect | Value |
|--------|-------|
| Content | `es` or `en` only |
| Set when | The visitor uses the language toggle (a request with `?setlang=1`) |
| Lifetime | One year |
| Attributes | First-party, `Path=/`, `SameSite=Lax`, `HttpOnly`, `Secure` in production |
| Read when | Choosing the language for `/` |
| Invalid values | Ignored; browser preference is used |

## Enquiry (transient)

Exists only for the duration of one request, long enough to build and send the email. It is never written to disk or a database.

| Field | Required | Rules |
|-------|----------|-------|
| `name` | Yes | Trimmed; 2–100 characters; control characters removed |
| `company` | No | ≤ 150 characters |
| `email` | Yes | ≤ 254 characters; one `@` with text and a dot-separated domain after it; no whitespace or line breaks |
| `phone` | No | ≤ 30 characters; digits, spaces and `+ - ( ) .` only |
| `topic` | No (default `other`) | One of `back-office`, `tracking`, `technology`, `ai-analytics`, `other` |
| `message` | Yes | 10–4000 characters; line breaks normalised; control characters removed |
| `language` | Derived | `es` or `en` from the route the form was posted to |
| `receivedAt` | Derived | Server time, ISO 8601 |
| `requestId` | Derived | Random id also written to the log |

**State flow**

```text
form rendered (token issued)
   └─ submitted
        ├─ rate limited ................ 429, form shown with notice
        ├─ token missing/expired/used .. 422, fresh form with notice (nothing sent)
        ├─ honeypot filled ............. 303 to confirmation, nothing sent, logged
        ├─ validation failed ........... 422, form re-shown, entries kept, errors beside fields
        └─ valid
             ├─ SMTP accepted .......... 303 to confirmation (token consumed)
             └─ SMTP failed ............ 503, form re-shown, failure notice with phone, error logged
```

## Form token (transient)

A signed value placed in a hidden field when the form is rendered.

| Field | Description |
|-------|-------------|
| `issuedAt` | Time issued |
| `nonce` | Random value |
| signature | HMAC of the above with `FORM_TOKEN_SECRET` |

**Rules**: valid only between 2 seconds and 2 hours after issue (a faster post is treated as automated; an older one has expired); each nonce works once. Used nonces are held in memory until expiry. A restart clears them, which at worst allows one replay of an unexpired token.

## Translation key tree

Every key present in `content/es/*.json` must be present in `content/en/*.json` and vice versa, with non-empty strings. Keys named `label` (buttons, navigation, links) must satisfy: English length ≤ Spanish length. A failing check fails the test suite (constitution VII and the design system's label rule).
