Pill button with a trailing arrow — the main call to action.

- `variant`: `primary` (navy; yellow in dark) — once per view, for the thing the page is for ("Solicitar demo"); `accent` (yellow) — a second action on the same level, e.g. "Rastrear envío"; `outline` — quiet actions inside white sections ("Conoce más de nosotros"); `ghost` — text-only, no arrow by default.
- `size`: `sm` (nav), `md`, `lg` (hero). `block` stretches it full width with the arrow pushed to the right edge, as under the about image.
- `href` renders an `<a>`; otherwise a `<button type="button">`. `arrow={false}` removes the arrow.
- Consumer provides: the label (verb first, sentence case, 2–3 words).
- Don't: square corners, icons on the left, two primaries side by side.
