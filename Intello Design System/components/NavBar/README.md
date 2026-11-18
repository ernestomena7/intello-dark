Top navigation: logo left, links centred with a dot under the current page, language toggle, phone + hours and the primary CTA right.

- Props: `links` [{label, href, active}], `phone`, `hours`, `cta` {label, href}, `language` (LanguageToggle props; renders the ES/EN switch before the phone), `logoTone` (default `auto`), `homeHref`, `ariaLabel`, `menuLabel` (accessible name of the mobile menu button, for example "Menú" / "Menu").
- 5–6 links, one word each where possible. Sits directly on `surface-page`, no bar background or shadow.
- Below 900px the links, language toggle, phone and CTA move into a native `<details>` menu: a pill button named by `menuLabel` opens a panel containing all of them. It works with the keyboard and without scripts. At 900px and above the layout is unchanged.
