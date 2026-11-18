Segmented pill that switches the site between Spanish and English; it lives in the `NavBar`, left of the phone number.

- Props: `value` + `onChange(code)` (controlled — the page owns the language and swaps its copy), or `defaultValue` (uncontrolled); `languages` (default `[{code:'es',label:'ES',name:'Español'},{code:'en',label:'EN',name:'English'}]`); `icon` (globe, default on); `label` (group `aria-label`).
- **Link mode (works without JavaScript):** give each language an `href` (`languages={[{code:'es',label:'ES',name:'Español',href:'/es/servicios'},{code:'en',label:'EN',name:'English',href:'/en/services'}]}`) and the options render as real `<a href hreflang lang>` links, with `aria-current="true"` on the active one. The page is then server-rendered with `value` set to the current language, and switching is plain navigation to the equivalent page; `onChange` is optional (called on click, never prevents navigation). Without `href` the options are buttons (`aria-pressed`) and need JavaScript.
- The active option takes the `action` fill (navy; yellow in dark) with `on-action` text; the rest are `ink-muted`.
- Consumer provides: the translated copy for each language and, on change, `document.documentElement.lang` (and the URL, e.g. `/es/…` ↔ `/en/…`, if the site has localized routes).
- Spanish is the default. Show codes (ES / EN), never flags — a language isn't a country.

**Link relation (added for the website).** In link mode each language option may carry `rel` (the site passes `nofollow` so crawlers do not treat the switch links as content links).

**Accessible name (WCAG 2.5.3 Label in Name).** The visible text is the code (`ES`, `EN`), so each option's accessible name is the native name followed by the code: "Español, ES" and "English, EN" (a parenthesised code would be ignored by accessibility checkers). The name therefore starts with the language's own name, as screen-reader users expect, and still contains the visible text that voice-control users say.
