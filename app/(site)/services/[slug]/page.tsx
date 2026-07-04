import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SEOHead } from "@/components/seo/SEOHead";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import FadeUp from "@/components/motion/FadeUp";
import { Check } from "lucide-react";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return siteConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) return { title: "Not found" };
  return {
    title: service.name,
    description: service.description.slice(0, 155),
  };
}

const brand = {
  name: siteConfig.company.name,
  description: siteConfig.company.description,
  email: siteConfig.company.email,
  phone: siteConfig.company.phone,
  location: siteConfig.company.location,
  url: siteConfig.seo.siteUrl,
  socials: siteConfig.socials,
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = siteConfig.services.filter((s) => s.slug !== slug);

  return (
    <>
      <SEOHead
        path={`/services/${service.slug}`}
        title={`${service.name} — ${siteConfig.company.name}`}
        description={service.description.slice(0, 155)}
        jsonLd={[
          serviceSchema({
            service,
            provider: brand,
            serviceUrl: `${siteConfig.seo.siteUrl}/services/${service.slug}`,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
            { name: "Services", url: `${siteConfig.seo.siteUrl}/services` },
            { name: service.name, url: `${siteConfig.seo.siteUrl}/services/${service.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="What we bake"
        title={service.name}
        image={assetUrl(`service-${service.slug}`, service.name)}
        intro={service.description}
      />

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                From the counter
              </p>
              <h2 className="mt-5 font-display text-[clamp(26px,3.5vw,40px)] font-light leading-tight text-cream">
                {service.description}
              </h2>
            </FadeUp>

            <FadeUp>
              <ul className="space-y-5">
                {(service.highlights ?? []).map((h) => (
                  <li key={h} className="flex items-start gap-4 border-b border-white/10 pb-5">
                    <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check size={13} />
                    </span>
                    <span className="text-lg text-cream/80">{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className="mt-10 inline-block bg-primary px-9 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-flax hover:text-cream"
              >
                {siteConfig.cta.primary}
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink/40">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            More from the oven
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group block border-t border-white/12 pt-5 transition-colors hover:border-primary"
              >
                <h3 className="font-display text-xl font-medium text-cream group-hover:text-primary">
                  {s.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-cream/60">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
