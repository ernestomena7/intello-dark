// Hand-written validation for the contact form (data-model.md "Enquiry").
// Returns cleaned values and error keys (never literal text: messages live in content/*/contact.json).

export const TOPICS = ['back-office', 'tracking', 'technology', 'ai-analytics', 'other'];
export const LIMITS = { nameMin: 2, nameMax: 100, companyMax: 150, emailMax: 254, phoneMax: 30, messageMin: 10, messageMax: 4000 };

// Built from strings so the source holds escape sequences, not literal control characters.
const LINE_BREAKS = new RegExp('[\\r\\n\\t\\u2028\\u2029]+', 'g');
const CONTROLS = new RegExp('[\\u0000-\\u001f\\u007f]', 'g');
const CONTROLS_EXCEPT_NEWLINE = new RegExp('[\\u0000-\\u0009\\u000b-\\u001f\\u007f]', 'g');

const asString = (v) => String(Array.isArray(v) ? v[0] ?? '' : v ?? '');
// Single-line fields: line breaks become spaces, other control characters are removed.
const oneLine = (v) => asString(v).replace(LINE_BREAKS, ' ').replace(CONTROLS, '').trim();
// Message: line breaks normalised to \n, other control characters removed.
const multiLine = (v) => asString(v).replace(/\r\n?/g, '\n').replace(CONTROLS_EXCEPT_NEWLINE, '').trim();

export function validate(body = {}) {
  const values = {
    name: oneLine(body.name),
    company: oneLine(body.company),
    email: oneLine(body.email),
    phone: oneLine(body.phone),
    topic: TOPICS.includes(asString(body.topic)) ? asString(body.topic) : 'other',
    message: multiLine(body.message),
  };
  const errors = {};

  if (!values.name) errors.name = 'required';
  else if (values.name.length < LIMITS.nameMin) errors.name = 'tooShort';
  else if (values.name.length > LIMITS.nameMax) errors.name = 'tooLong';

  if (values.company.length > LIMITS.companyMax) errors.company = 'tooLong';

  if (!values.email) errors.email = 'required';
  else if (values.email.length > LIMITS.emailMax) errors.email = 'tooLong';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'invalid';

  if (values.phone.length > LIMITS.phoneMax) errors.phone = 'tooLong';
  else if (!/^[0-9 +\-().]*$/.test(values.phone)) errors.phone = 'invalid';

  if (!values.message) errors.message = 'required';
  else if (values.message.length < LIMITS.messageMin) errors.message = 'tooShort';
  else if (values.message.length > LIMITS.messageMax) errors.message = 'tooLong';

  return { values, errors };
}
