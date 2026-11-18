// Security headers (contracts/http-routes.md "Security headers").
import helmet from 'helmet';

export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'none'"],
  styleSrc: ["'self'"],
  // The design system sets inline style attributes (aspect-ratio, progress width). Attributes only, never <style> elements.
  styleSrcAttr: ["'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  fontSrc: ["'self'"],
  formAction: ["'self'"],
  baseUri: ["'none'"],
  frameAncestors: ["'none'"],
};

export function securityHeaders(config) {
  return helmet({
    contentSecurityPolicy: { useDefaults: false, directives: CSP_DIRECTIVES },
    strictTransportSecurity: config.isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    xContentTypeOptions: true,
    hidePoweredBy: true,
    // Social-media crawlers fetch the share image from another origin.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
}
