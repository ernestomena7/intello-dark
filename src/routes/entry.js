// GET / : the only unprefixed URL that redirects. Saved choice first, then the browser, then Spanish.
import express from 'express';
import { chooseLanguage } from '../i18n/negotiate.js';

export function entryRouter() {
  const router = express.Router({ strict: true });
  router.get('/', (req, res) => {
    res.set({ 'Cache-Control': 'no-store', Vary: 'Accept-Language, Cookie' });
    res.redirect(302, `/${chooseLanguage(req)}/`);
  });
  return router;
}
