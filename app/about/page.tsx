import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { SEOHead } from "@/components/seo/SEOHead";
import { organizationSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import FadeUp, { StaggerChildren } from "@/components/motion/FadeUp";
import TextReveal from "@/components/motion/TextReveal";
import NumberCounter from "@/components/motion/NumberCounter";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.aboutStory.slice(0, 155),
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

function splitStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return { num: match ? parseInt(match[1], 10) : 0, suffix: match ? match[2] : value };
}

export default function AboutPage() {
  return (
    <>
      <SEOHead
        path="/about"
        title={`About — ${siteConfig.company.name}`}
        description={siteConfig.aboutStory.slice(0, 155)}
        jsonLd={[
          organizationSchema(brand, siteConfig.seo.structuredData.address),
          breadcrumbSchema([
            { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
            { name: "About", url: `${siteConfig.seo.siteUrl}/about` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Our story"
        title={siteConfig.aboutHeading}
        image={assetUrl("section-about", "baker kneading sourdough dough")}
        intro={siteConfig.company.tagline}
      />

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
            <div>
              <TextReveal className="font-display text-[clamp(28px,4vw,44px)] font-light leading-[1.15] tracking-[-0.01em] text-cream">
                {siteConfig.manifesto}
              </TextReveal>
            </div>
            <FadeUp>
              <p className="text-lg leading-relaxed text-cream/70">{siteConfig.aboutStory}</p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ink/40">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <FadeUp>
            <p className="mb-14 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              What we stand for
            </p>
          </FadeUp>
          <StaggerChildren className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.values.map((v) => (
              <FadeUp key={v.title}>
                <div className="border-t border-white/12 pt-5">
                  <h3 className="mb-3 font-display text-xl font-medium text-cream">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-cream/65">{v.description}</p>
                </div>
              </FadeUp>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.stats.map((s) => {
              const { num, suffix } = splitStat(s.value);
              return (
                <FadeUp key={s.label}>
                  <div>
                    <div className="font-display text-[clamp(44px,6vw,72px)] font-light leading-none text-primary">
                      <NumberCounter to={num} suffix={suffix} />
                    </div>
                    <p className="mt-3 text-sm uppercase tracking-[0.14em] text-cream/60">{s.label}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-accent text-bg">
        <div className="mx-auto max-w-[1280px] px-5 text-center md:px-10">
          <FadeUp>
            <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(30px,5vw,56px)] font-light leading-[1.05]">
              {siteConfig.ctaBlock.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg text-bg/80">{siteConfig.ctaBlock.description}</p>
            <Link
              href="/shop"
              className="mt-10 inline-block bg-bg px-9 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-ink"
            >
              {siteConfig.cta.primary}
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
