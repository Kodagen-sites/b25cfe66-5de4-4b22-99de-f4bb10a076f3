import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { SEOHead } from "@/components/seo/SEOHead";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import FadeUp from "@/components/motion/FadeUp";
import CardTiltLayer from "@/components/motion/CardTiltLayer";

export const metadata: Metadata = {
  title: "Our bakes",
  description:
    "A look at what leaves the ovens on Vanderbilt Avenue — sourdough, viennoiserie, celebration cakes and the everyday counter.",
};

const gallery = [
  { slot: "gallery-1", keyword: "dark crust sourdough boule", caption: "The 36-hour boule", tall: true },
  { slot: "gallery-2", keyword: "butter croissants tray", caption: "Morning lamination" },
  { slot: "gallery-3", keyword: "celebration layer cake buttercream", caption: "Made-to-order cakes" },
  { slot: "gallery-4", keyword: "fruit danish pastry", caption: "Seasonal danishes", tall: true },
  { slot: "gallery-5", keyword: "baker scoring bread dough", caption: "Hand-scored, every loaf" },
  { slot: "gallery-6", keyword: "bakery counter display bread", caption: "The Vanderbilt counter" },
];

export default function WorkPage() {
  return (
    <>
      <SEOHead
        path="/work"
        title={`Our bakes — ${siteConfig.company.name}`}
        description={metadata.description as string}
        jsonLd={breadcrumbSchema([
          { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
          { name: "Our Bakes", url: `${siteConfig.seo.siteUrl}/work` },
        ])}
      />

      <PageHero
        eyebrow="Our bakes"
        title="What leaves the oven"
        image={assetUrl("gallery-1", "dark crust sourdough boule")}
        intro="No stock photos here — this is the real thing, baked this week on Vanderbilt Avenue."
      />

      <section className="section-pad">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g) => (
              <FadeUp key={g.slot}>
                <CardTiltLayer className={`group relative block overflow-hidden rounded-sm ${g.tall ? "sm:row-span-2" : ""}`}>
                  <div className={`relative overflow-hidden ${g.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <img
                      src={assetUrl(g.slot, g.keyword)}
                      alt={g.caption}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                        {siteConfig.company.name}
                      </p>
                      <p className="mt-1 font-display text-lg text-white">{g.caption}</p>
                    </div>
                  </div>
                </CardTiltLayer>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="mt-20 border-t border-white/12 pt-14 text-center">
              <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(28px,4.5vw,52px)] font-light leading-[1.05] text-cream">
                {siteConfig.ctaBlock.heading}
              </h2>
              <Link
                href="/shop"
                className="mt-9 inline-block bg-primary px-9 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-flax hover:text-cream"
              >
                {siteConfig.cta.primary}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
