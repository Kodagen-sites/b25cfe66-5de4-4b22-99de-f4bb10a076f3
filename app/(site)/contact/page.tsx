import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SEOHead } from "@/components/seo/SEOHead";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import ContactForm from "@/components/ContactForm";
import FadeUp from "@/components/motion/FadeUp";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Visit us",
  description:
    "Find Marlowe & Finch on Vanderbilt Avenue in Brooklyn — opening hours, contact details and how to place an order.",
};

const sd = siteConfig.seo.structuredData;
const addr = sd.address;
const fullAddress = `${addr.streetAddress}, ${addr.addressLocality}, ${addr.addressRegion} ${addr.postalCode}`;

const brand = {
  name: siteConfig.company.name,
  description: siteConfig.company.description,
  email: siteConfig.company.email,
  phone: siteConfig.company.phone,
  location: siteConfig.company.location,
  url: siteConfig.seo.siteUrl,
  socials: siteConfig.socials,
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${siteConfig.company.name} ${fullAddress}`,
  )}&output=embed`;

  return (
    <>
      <SEOHead
        path="/contact"
        title={`Visit us — ${siteConfig.company.name}`}
        description={metadata.description as string}
        jsonLd={[
          localBusinessSchema({
            brand,
            address: addr,
            hours: sd.hours as any,
            priceRange: sd.priceRange as "$$",
            businessType: sd.businessType,
            geo: sd.geo,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
            { name: "Visit", url: `${siteConfig.seo.siteUrl}/contact` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Visit"
        title="Come say hello"
        image={assetUrl("section-cta", "brooklyn bakery storefront")}
        intro="Pull up a stool on Vanderbilt Avenue, or drop us a line — we read every message."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid gap-14 md:grid-cols-2 md:gap-20">
            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                Find the counter
              </p>
              <h2 className="mt-5 font-display text-[clamp(26px,3.5vw,40px)] font-light text-cream">
                {siteConfig.company.name}
              </h2>

              <ul className="mt-8 space-y-5 text-cream/80">
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="mt-1 flex-none text-primary" />
                  <span>{fullAddress}</span>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={18} className="mt-1 flex-none text-primary" />
                  <a href={`mailto:${siteConfig.company.email}`} className="hover:text-primary">
                    {siteConfig.company.email}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={18} className="mt-1 flex-none text-primary" />
                  <a href={`tel:${siteConfig.company.phone}`} className="hover:text-primary">
                    {siteConfig.company.phone}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={18} className="mt-1 flex-none text-primary" />
                  <div className="space-y-1">
                    {sd.hours.map((h) => (
                      <div key={h.opens + h.dayOfWeek[0]}>
                        <span className="text-cream">
                          {h.dayOfWeek[0]}
                          {h.dayOfWeek.length > 1 ? `–${h.dayOfWeek[h.dayOfWeek.length - 1]}` : ""}
                        </span>{" "}
                        <span className="text-cream/60">
                          {h.opens}–{h.closes}
                        </span>
                      </div>
                    ))}
                  </div>
                </li>
              </ul>

              <div className="mt-8 overflow-hidden rounded-sm border border-white/12">
                <iframe
                  title={`Map to ${siteConfig.company.name}`}
                  src={mapSrc}
                  loading="lazy"
                  className="h-[280px] w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeUp>

            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                Send a message
              </p>
              <h2 className="mt-5 mb-8 font-display text-[clamp(26px,3.5vw,40px)] font-light text-cream">
                Custom order or catering?
              </h2>
              <ContactForm email={siteConfig.company.email} />
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
