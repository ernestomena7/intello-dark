// Registry of public pages. Each story adds its module here; a page that is not registered has no route yet.
// A module exports { key, render(ctx) -> { meta, body, indexable? }, cache? } (cache: false disables the render cache).
import * as notFound from './not-found.js';
import * as error from './error.js';

import * as home from './home.js';
import * as contact from './contact.js';
import * as privacy from './privacy.js';
import * as services from './services.js';
import * as technology from './technology.js';
import * as about from './about.js';
import * as faq from './faq.js';

const modules = [home, services, about, technology, faq, contact, privacy];

export const pages = new Map(modules.map((m) => [m.key, m]));
export { notFound, error };
