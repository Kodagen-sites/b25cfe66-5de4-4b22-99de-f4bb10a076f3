import type { Metadata } from "next";
import { SEOHead } from "@/components/seo/SEOHead";
import { productSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import { AddToCart } from "@/components/cart/AddToCart";

export const metadata: Metadata = {
  title: "Order for pickup",
  description:
    "Reserve tomorrow's bake tonight. Sourdough, viennoiserie and celebration cakes, ready to collect warm from the Brooklyn counter.",
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

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-parchment text-stone">
      <SEOHead
        path="/shop"
        title={`Order for pickup — ${siteConfig.company.name}`}
        description={metadata.description as string}
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: `${siteConfig.seo.siteUrl}/` },
            { name: "Order", url: `${siteConfig.seo.siteUrl}/shop` },
          ]),
          ...siteConfig.products.map((p) =>
            productSchema({
              product: {
                name: p.name,
                description: p.description,
                slug: p.slug,
                price: p.priceCents / 100,
                currency: siteConfig.currency,
                availability: "InStock",
              },
              brand,
              productUrl: `${siteConfig.seo.siteUrl}/shop`,
            }),
          ),
        ]}
      />

      <section className="px-5 pb-16 pt-40 md:px-10 md:pt-48">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Order ahead</p>
          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(38px,6vw,80px)] font-light leading-[1.0] tracking-[-0.02em]">
            {siteConfig.ctaBlock.heading}
          </h1>
          <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-stone/70">
            {siteConfig.ctaBlock.description}
          </p>
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.products.map((p) => {
              const imageUrl = assetUrl(p.imageSlot, p.name);
              return (
                <article
                  key={p.slug}
                  className="group flex flex-col overflow-hidden rounded-sm border border-stone/10 bg-cream shadow-[0_18px_40px_-24px_rgba(59,46,35,0.4)]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 bg-parchment/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-xl font-medium leading-tight">{p.name}</h2>
                      <span className="font-mono text-lg tabular-nums text-accent">{p.price}</span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-stone/65">{p.description}</p>

                    <AddToCart
                      product={{
                        id: p.slug,
                        name: p.name,
                        priceCents: p.priceCents,
                        imageUrl,
                        href: "/shop",
                      }}
                      className="mt-6 w-full bg-stone px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-bark"
                    >
                      Add to cart — {p.price}
                    </AddToCart>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-14 max-w-[640px] text-sm leading-relaxed text-stone/55">
            Orders are prepared fresh for next-day pickup at {siteConfig.seo.structuredData.address.streetAddress},{" "}
            {siteConfig.seo.structuredData.address.addressLocality}. You&apos;ll confirm your pickup
            window at checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
