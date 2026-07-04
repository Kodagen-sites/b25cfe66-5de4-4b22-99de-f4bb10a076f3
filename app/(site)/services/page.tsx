import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceCardV8 from "@/components/ServiceCard";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "What we bake",
  description:
    "Naturally leavened sourdough, hand-laminated viennoiserie, custom celebration cakes and order-ahead pickup from our Brooklyn counter.",
};

const brand = {
  name: siteConfig.company.name,
  description: siteConfig.company.description,
  email: siteConfig.company.email,
  phone: siteConfig.company.phone,
  location: siteConfig.company.location,
  url: siteConfig.seo.siteUrl,
  socials: siteConfig.socials,
};

export default function ServicesPage() {
  return (
    <>
      <SEOHead
        path="/services"
        title={`What we bake — ${siteConfig.company.name}`}
        description={metadata.description as string}
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
            { name: "Services", url: `${siteConfig.seo.siteUrl}/services` },
          ]),
          ...siteConfig.services.map((s) =>
            serviceSchema({
              service: s,
              provider: brand,
              serviceUrl: `${siteConfig.seo.siteUrl}/services/${s.slug}`,
            }),
          ),
        ]}
      />

      <PageHero
        eyebrow="What we bake"
        title={siteConfig.servicesHeading}
        image={assetUrl("service-breads", "artisan sourdough loaves on rack")}
        intro="Four things we do properly, every single morning — no shortcuts, no mixes, no frozen dough."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {siteConfig.services.map((service, i) => (
              <FadeUp key={service.slug}>
                <ServiceCardV8
                  service={service}
                  index={i}
                  imageSrc={assetUrl(`service-${service.slug}`, service.name)}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
