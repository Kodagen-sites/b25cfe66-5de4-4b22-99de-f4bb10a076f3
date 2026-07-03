import { SEOHead } from "@/components/seo/SEOHead";
import { siteConfig } from "@/content/site-config";
import { organizationSchema, localBusinessSchema } from "@/lib/seo/structured-data";
import VideoHomepage from "@/components/VideoHomepage";

const brand = {
  name: siteConfig.company.name,
  tagline: siteConfig.company.tagline,
  description: siteConfig.company.description,
  email: siteConfig.company.email,
  phone: siteConfig.company.phone,
  location: siteConfig.company.location,
  url: siteConfig.seo.siteUrl,
  logo: siteConfig.seo.defaultOgImage,
  socials: siteConfig.socials,
};

export default function HomePage() {
  const sd = siteConfig.seo.structuredData;
  return (
    <>
      <SEOHead
        path="/"
        jsonLd={[
          organizationSchema(brand, sd.address),
          localBusinessSchema({
            brand,
            address: sd.address,
            hours: sd.hours as any,
            priceRange: sd.priceRange as "$$",
            businessType: sd.businessType,
            geo: sd.geo,
          }),
        ]}
      />
      <VideoHomepage />
    </>
  );
}
