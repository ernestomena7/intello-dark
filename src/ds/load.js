// Loads the Intello design system components for server-side rendering.
//
// The design system ships as a browser bundle (`components/bundle.js`) that reads `window.React` and
// writes `window.Intello`. We evaluate it once, in an isolated context that holds nothing but a fake
// `window`, and render the resulting React 18 components with `renderToStaticMarkup`. The bundle is
// never modified and never served to browsers.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(HERE, '..', '..');
export const DS_DIR = path.join(ROOT_DIR, 'Intello Design System');
export const BUNDLE_JS = path.join(DS_DIR, 'components', 'bundle.js');

// Components the site relies on. Loading fails loudly if the design system lacks any of them.
export const REQUIRED_COMPONENTS = [
  'Button', 'IconButton', 'TextLink', 'VideoLink', 'Icon', 'Logo', 'Eyebrow', 'Headline', 'NavBar',
  'LanguageToggle', 'Hero', 'FeatureItem', 'StatChip', 'Section', 'SectionHeader', 'ImageTile',
  'ServiceCard', 'StatusBadge', 'TrackingCard', 'AboutBlock',
  'SkipLink', 'Footer', 'CtaBand', 'PageHero', 'ServiceSection', 'Steps', 'Accordion', 'Prose',
  'Field', 'TextInput', 'Textarea', 'Select', 'FormNotice', 'FormErrorSummary', 'Honeypot',
];

let cache = null;

export function loadDesignSystem() {
  if (cache) return cache;
  const code = fs.readFileSync(BUNDLE_JS, 'utf8');
  const sandbox = { window: { React } };
  vm.runInNewContext(code, sandbox, { filename: 'intello-bundle.js', timeout: 2000 });
  const components = sandbox.window.Intello;
  if (!components) throw new Error('The Intello design system bundle did not define window.Intello.');
  const missing = REQUIRED_COMPONENTS.filter((name) => typeof components[name] !== 'function');
  if (missing.length) {
    throw new Error(`The Intello design system is missing components: ${missing.join(', ')}.`);
  }
  cache = components;
  return cache;
}

export function renderToHtml(element) {
  return renderToStaticMarkup(element);
}

export { React };
