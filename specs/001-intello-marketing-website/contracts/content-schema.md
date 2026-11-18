# Contract: Content Files and Translation Rules

**Plan**: [../plan.md](../plan.md) | **Spec**: FR-026, FR-032, FR-033 | **Constitution**: Principles II and VII

All user-facing text is in JSON under `content/`. No page or component contains literal copy.

## Files

```text
content/
├── structure.json      # language-neutral: page keys, service ids, icons, anchors, topic ids, image ids per slot
├── site.json           # phone, hours, address, placeholder flag
├── images.json         # image registry (files, dimensions, brief, model, date, approved, alt es/en)
├── email.json          # team-facing labels for the notification email (Spanish)
├── es/
│   ├── common.json     home.json     services.json   technology.json
│   ├── about.json      faq.json      contact.json    privacy.json   not-found.json   error.json
└── en/                 # exactly the same files and the same key tree
```

## Per-language file shapes

Only text lives in the per-language files. Anything language-neutral (ids, icons, image ids, anchors) lives in `structure.json`.

| File | Top-level keys |
|------|----------------|
| `common.json` | `skipLink`; `nav` (`ariaLabel`, `menuLabel`, `links[]` of `{key, label}`, `cta.label`); `language` (`label` for the group, plus names); `footer` (`tagline`, `columnHeadings`, `contactHeading`, `legal`, `privacyLabel`); `ctaBand` (`title`, `titleAccent`, `body`, `cta.label`); `exampleLabel` |
| `home.json` | `meta`; `hero` (`eyebrow`, `title`, `titleAccent`, `lede`, `cta.label`, `features[4]` of `{text}`); `tracking` (example shipment text: `heading` (the illustrative-example label), `id`, `from`, `fromMeta`, `to`, `toMeta`, `steps[4]`, `statusLabel`); `stat` (`value`, `label`); `about` (`eyebrow`, `title`, `titleAccent`, `body`, `note`, `cta.label`); `services` (`eyebrow`, `title`, `action.label`) |
| `services.json` | `meta`; `header` (`eyebrow`, `title`, `lede`); `items[4]` keyed by service id, each `{title, bullets[2], summary, deliverables[], cta.label}` |
| `technology.json` | `meta`; `header`; `capabilities[]` of `{title, body}` (end-customer alerts, demand forecasts, KPI dashboards, integrations); `how` (`title`, `steps[]`); `cta` |
| `about.json` | `meta`; `header`; `story` (`title`, `body[]`); `approach` (`title`, `steps[]` of `{title, body}`); `clients` (`title`, `items[]`); `cta` |
| `faq.json` | `meta`; `header`; `items[]` of `{id, question, answer[]}`; `cta` |
| `contact.json` | `meta`; `header`; `details` (`phoneLabel`, `hoursLabel`); `form` (`labels` per field, `hints`, `topics` by id, `privacy`, `submit.label`, `errors` by rule, `summaryTitle`, `notices` for token, expired and already-sent); `sent` (`title`, `body`); `failed` (`title`, `body`); `rateLimited` (`title`, `body`) |
| `privacy.json` | `meta`; `header`; `updated`; `sections[]` of `{heading, body[]}` |
| `not-found.json` | `meta`; `title`; `body`; `home.label`; `contact.label` |
| `error.json` | `meta`; `title` and `body` for a server error (500); `tooLarge` (`title`, `body`) for an oversized submission (413); `home.label`; `contact.label`; `phoneNote` (offers the phone number as an alternative) |

`meta` is always `{title, description}`.

## Rules enforced by the test suite

1. **Parity**: the set of keys (including array lengths) in each `es` file equals the set in the matching `en` file. A missing key or empty string in either language fails the suite.
2. **Label length**: every key named `label` has an English value no longer than its Spanish value (design system rule; FR-032).
3. **Meta limits**: `meta.title` ≤ 60 characters, `meta.description` ≤ 160, both unique across pages within a language.
4. **Voice checks**: no `!` in any value, no emoji, no all-caps words longer than four letters (eyebrows are uppercased by CSS, not typed), buttons start with a verb (checked against a small verb list per language) and have two or three words.
4a. **Figures**: across **all** content files, any number followed by `+`, `%` or `x`, or any client or statistic count, must appear in `tests/allowed-figures.json` (initially only the "24/7" capability, pending client confirmation).
5. **No leftovers**: no value contains `TODO`, `Lorem`, `XXX` or `[[`.
6. **Images**: every image id referenced in `structure.json` exists in `images.json`, has `alt.es` and `alt.en`, and all three width variants exist on disk.
7. **Placeholders**: `site.json.placeholder` must be false for the production start-up check to pass.

## Authoring notes

- Spanish uses *tú* and *nosotros*; English uses *you* and *we*; sentence case everywhere; two-tone headlines are written as `title` plus `titleAccent`.
- Numbers, client counts and percentages appear only when real and sourced. The only figure in the starting copy is the "24/7" capability, which stays subject to client confirmation.
- The starting copy is the design system's homepage reference (Spanish and English); the client corrects it before launch.
