// Static branding shim consumed by the admin login screen (a client component
// that can't run server-side config loaders). Values mirror the public site's
// brand tokens so the login chrome matches the storefront.
import assetManifest from "@/content/asset-manifest.json";

const heroImage =
  ((assetManifest as { images?: Record<string, string> }).images ?? {})["section-hero"] ?? "";

export const mockHotelConfig = {
  businessName: "Marlowe & Finch",
  hero: { backgroundImage: heroImage },
  theme: {
    primaryColor: "#E0AE57",
    accentColor: "#C97C54",
    fontHeading: "Fraunces, serif",
  },
};

export type MockHotelConfig = typeof mockHotelConfig;
