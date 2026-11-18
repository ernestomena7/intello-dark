// CSS lint for tokens.css, the design system bundle.css and site styles (constitution quality gate 2).
// Hard-coded colours, font families and radii are checked by check-ds-values.mjs, which understands the
// design system's dense one-line style and its allow-list.
export default {
  rules: {
    'color-no-invalid-hex': true,
    'color-named': 'never',
    'block-no-empty': true,
    'declaration-no-important': true,
    'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates-with-different-values'] }],
    'declaration-block-no-shorthand-property-overrides': true,
    'property-no-unknown': true,
    'unit-no-unknown': true,
    'function-no-unknown': [true, { ignoreFunctions: ['var', 'calc', 'min', 'max', 'clamp', 'rgba', 'rgb', 'brightness', 'grayscale', 'contrast'] }],
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }],
    'at-rule-no-unknown': true,
    'no-invalid-double-slash-comments': true,
    'no-invalid-position-at-import-rule': true,
    'no-duplicate-at-import-rules': true,
    'media-feature-name-no-unknown': true,
    'string-no-newline': true,
  },
};
