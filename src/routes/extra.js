// Routes that need the app-level services (contact form). opts: { mailTransport, now } for tests.
import { contactRoutes } from './contact.js';

export function extraRoutes(app, config, opts = {}) {
  contactRoutes(app, config, opts);
}
