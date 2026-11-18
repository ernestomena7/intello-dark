# Contract: Contact Form and Notification Email

**Plan**: [../plan.md](../plan.md) | **Spec**: FR-018 to FR-025 | **Constitution**: Principle VIII

## Form fields

| Name | Control | Required | Rules |
|------|---------|----------|-------|
| `name` | Text input | Yes | 2–100 characters after trimming |
| `company` | Text input | No | ≤ 150 characters |
| `email` | Email input | Yes | ≤ 254 characters; valid address shape; no line breaks |
| `phone` | Telephone input | No | ≤ 30 characters; digits, spaces and `+ - ( ) .` |
| `topic` | Select | No | `back-office`, `tracking`, `technology`, `ai-analytics`, `other` (default `other`). A link from a service can pre-select it with `?topic=<id>` |
| `message` | Textarea | Yes | 10–4000 characters |
| `website` | Hidden honeypot | Must be empty | Visually hidden, not focusable, `autocomplete="off"`, hidden from assistive technology |
| `ft` | Hidden form token | Yes | See [../data-model.md](../data-model.md#form-token-transient) |

Entries are kept in the re-rendered form after any failure. The message and company are never echoed into headers.

## Behaviour requirements

1. **Works without scripts.** A normal form post and a server-rendered result.
2. **Labels and errors.** Every control has a visible label. Each error is shown beside its field, linked to it with `aria-describedby`, and the set of errors is summarised at the top in an element announced to assistive technology (`role="alert"`), with links to the fields.
3. **Language.** Labels, hints, errors, the privacy statement, the confirmation and the failure notice are all taken from the page language's content files.
4. **Privacy statement.** Directly above the submit button: what is collected (name, company, email, phone, message), why (to answer the enquiry), and a link to the privacy page.
5. **Confirmation** appears only after the mail server accepted the message.
6. **Failure notice** names the phone number as the alternative and exposes no technical detail.
7. **Double submission**: the token is single use, so a second post of the same form sends nothing and shows the "already sent" notice.

## Notification email

| Part | Value |
|------|-------|
| Transport | Nodemailer, SMTP with authentication; secure connection (port 465, or 587 with STARTTLS) |
| `From` | `CONTACT_FROM`, a mailbox on the Intello domain that the SMTP account may send as |
| `To` | `CONTACT_TO`: one or more addresses, comma separated |
| `Reply-To` | The visitor: name and email, with line breaks removed |
| Subject | `[Intello web] {topic label} — {name}`; line breaks removed; truncated to 150 characters |
| Body | Plain text only |
| Body content | Visitor language (`es` or `en`), topic, name, company, email, phone, received time (ISO 8601), request id, then the message |
| Team-facing language | Spanish for the team's labels; the visitor's language is stated in the body. Change in content if the team prefers English |
| Header safety | Any value used in a header has `\r` and `\n` removed before use |

**Before launch**: the sending domain must have SPF, DKIM and DMARC records for the `CONTACT_FROM` mailbox (constitution VIII). The deployment check reads the headers of a received test message to confirm they pass.

**Caching**: every response of the contact page carries its own form token, so the contact page is never cached or given an `ETag` (`Cache-Control: no-store`).

## Abuse protection

| Control | Rule |
|---------|------|
| Rate limit | Per client address; default 5 posts per 15 minutes; on the contact post routes only; `429` with `Retry-After` |
| Honeypot | A filled `website` field is treated as automated: no email, normal-looking redirect, logged |
| Minimum fill time | A post less than 2 seconds after the token was issued is rejected as automated (`422`, fresh form) |
| Token expiry | Older than 2 hours is rejected (`422`, fresh form) |
| Third-party CAPTCHA | Not used (constitution V) |

## Logging

One JSON line per submission outcome on stdout: `requestId`, route, language, outcome (`sent`, `invalid`, `rate-limited`, `token`, `honeypot`, `mail-failed`), duration. **Never** the message text, email address, name, phone or company.

## Tests this contract requires

Using a mocked transport: recipients match `CONTACT_TO`; `Reply-To` is the visitor and `From` is `CONTACT_FROM`; the language is stated; a subject or name containing `\r\n` cannot add a header; a filled honeypot sends nothing; a repeated token sends once; a too-fast post is rejected; the sixth post in the window returns `429`; a transport error returns `503` with the phone number and no stack trace; every message key exists in both languages.
