// Rate limiting for the contact form: 5 posts per 15 minutes per client address (contracts/contact-form.md).
import { rateLimit } from 'express-rate-limit';

export function createContactLimiter({ onLimit, limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: false,
    legacyHeaders: false,
    handler: (req, res, next) => {
      const reset = req.rateLimit?.resetTime ? new Date(req.rateLimit.resetTime).getTime() : Date.now() + windowMs;
      res.set('Retry-After', String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))));
      onLimit(req, res, next);
    },
  });
}
