// Adapter over content/site-config.ts.
//
// A few shared templates (legal pages, admin-shaped helpers) import
// `@/lib/site-config` and expect `contact` / `footer` shapes. This re-exports
// the single source of truth from content/ and projects those fields so both
// import paths stay consistent. Keep the canonical data in
// content/site-config.ts — edit copy there, not here.
import { siteConfig as content } from "@/content/site-config";

export const siteConfig = {
  ...content,
  // Admin engine id — catalog (products + orders) for this bakery storefront.
  engine: "catalog",
  contact: {
    email: content.company.email,
    phone: content.company.phone,
    location: content.company.location,
  },
  footer: {
    contactEmail: content.company.email,
    address: content.company.location,
  },
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;

// Async accessor used by admin server components that expect a Promise-returning
// config loader (parity with the DB-backed loader on dynamic tenants).
export async function getSiteConfig() {
  return siteConfig;
}
