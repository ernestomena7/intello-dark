Wraps one control with a visible label, optional hint and optional error, and wires the accessibility attributes.

- Props: `id` (becomes the control id), `label`, `hint`, `error`, `required`, `children` (one TextInput, Textarea or Select).
- Adds `aria-describedby` (hint and error ids) and `aria-invalid` to the control. A required field shows an asterisk (hidden from assistive technology; the control itself is `required`).
- Errors are text with an icon in `danger`, never colour alone. Use the `.itl-form` and `.itl-form-row` utilities for spacing.
