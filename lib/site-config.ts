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
