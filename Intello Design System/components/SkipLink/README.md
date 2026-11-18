First focusable element on every page; lets keyboard and screen-reader users jump past the navigation.

- Props: `href` (default `#main`), `children` (the label, for example "Saltar al contenido" / "Skip to content").
- Invisible until it receives focus, then a navy pill with the 2px `focus-ring`. The target element must have the matching `id`.
- Do: keep it the very first element in the page wrapper. Don't: hide it with `display: none` (it would not be focusable).
