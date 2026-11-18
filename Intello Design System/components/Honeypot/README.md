Spam trap: a text field that only automated scripts fill in.

- Props: `name` (for example `website`), `label`.
- Moved off-screen, hidden from assistive technology (`aria-hidden`), skipped by the keyboard (`tabindex="-1"`), `autocomplete="off"`, but still in the DOM and submitted with the form. The server treats any value as a bot.
- Never give it a label that invites people to fill it in.
