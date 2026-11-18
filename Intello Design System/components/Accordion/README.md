Questions that open to reveal answers, built on native `<details>` and `<summary>`: works by keyboard (Tab, Enter, Space) and with scripts disabled.

- Props: `items` [{id, question, answer}] where `answer` is a string or an array of paragraphs. `id` becomes the element id so a question can be linked to.
- All answers are present in the HTML (good for search engines). The chevron rotates by CSS only.
