"use client";

import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { assetUrl } from "@/lib/assets";
import {
  FadeUp,
  StaggerChildren,
  TextReveal,
  ImageRevealMask,
  MagneticButton,
} from "@/components/motion";

/**
 * ARCHETYPE G — Mixed-Media Hybrid Scroll
 *
 * The pattern observed in Hut 8, ORYZO, SOLAIS, Peachweb, Peachworlds:
 *   Section 1 (VIDEO)  — cinematic/emotional hero (loops or scrubs)
 *   Section 2 (IMAGE)  — static mockup/feature section with reveal-on-scroll
 *   Section 3 (TYPE)   — oversized typography manifesto ($0 cost)
 *   Section 4 (IMAGE)  — services grid with image cards
 *   Section 5 (VIDEO)  — optional secondary video accent (or skip for cost)
 *   Section 6 (CTA)    — bold call to action on solid bg
 *
 * Why this archetype: most sites don't need 24 seconds of continuous video.
 * One 8s hero + smart image sections = same emotional impact at 1/3 the cost.
 *
 * Reveals come from the motion primitive library (FadeUp / StaggerChildren /
 * TextReveal / ImageRevealMask / MagneticButton) — NOT the progress-driven
 * opacity system that the scrub archetypes use. This prompt-only build ships a
 * still, parallax hero (no frame-sequence scrubbing). Palettes can alternate
 * per section for editorial rhythm.
 */

export default function VideoHomepage() {
  return (
    <div className="relative">
      <VideoHeroSection />
      <ImageMockupSection />
      <OversizedTypeSection />
      <ImageGridSection />
      <OptionalVideoLoopSection />
      <CtaSection />
    </div>
  );
}

// ============================================================
// Section 1 — VIDEO HERO (the expensive one, worth it)
// Above-fold content stays static; only the primary CTA gets a
// magnetic micro-interaction.
// ============================================================
function VideoHeroSection() {
  // Prompt-only mode: no Veo clip on disk — render the Unsplash still from
  // siteConfig.scrollHero.imageUrl instead of the <video> tag. The rest of
  // the section (gradient scrim + overlay copy + CTAs + scroll hint) is
  // identical, so the look stays consistent across asset modes.
  const isPromptOnly = siteConfig.scrollHero.assetMode === "prompt-only";
  return (
    <section className="relative min-h-screen bg-bg flex items-center justify-center px-6 overflow-hidden">
      {isPromptOnly ? (
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src={assetUrl("section-hero", "artisan sourdough bakery")}
          alt=""
          loading="eager"
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-4xl text-center">
        <div className="font-mono text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-6">
          {siteConfig.company.tagline}
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-light leading-[0.95] text-white">
          {siteConfig.hero.h1.map((line, i) => (
            <span
              key={i}
              className={`block ${
                line.accent ? "italic font-serif text-primary" : ""
              }`}
            >
              {line.text}
            </span>
          ))}
        </h1>
        <p className="mt-8 text-base md:text-lg text-white/75 max-w-xl mx-auto">
          {siteConfig.company.description}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <MagneticButton
            as="a"
            href="/shop"
            className="min-h-[48px] px-7 py-3.5 rounded-full bg-primary text-bg font-display font-medium text-sm hover:brightness-110 transition-all"
          >
            {siteConfig.cta.primary}
          </MagneticButton>
          <Link
            href="/services"
            className="min-h-[48px] px-7 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-display font-medium text-sm backdrop-blur-md hover:bg-white/10 inline-flex items-center justify-center"
          >
            {siteConfig.cta.secondary}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-white/60 uppercase animate-pulse">
        Scroll ↓
      </div>
    </section>
  );
}

// ============================================================
// Section 2 — IMAGE MOCKUP (static, with reveal animation)
// This is where a product screen / feature image lives.
// Left column fades up as a block. Right column uses ImageRevealMask
// for a premium clip-path reveal on the mockup image.
// ============================================================
function ImageMockupSection() {
  const feature = siteConfig.features?.[0] ?? {
    title: "Built for how you actually work.",
    description: siteConfig.company.description,
  };

  const restFeatures = siteConfig.features?.slice(1, 4) ?? [];

  return (
    <section className="relative min-h-screen bg-bg flex items-center px-6 py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <FadeUp>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary/80 uppercase mb-4">
              Platform Overview
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-4xl md:text-6xl text-white font-light leading-[1.05] mb-6">
              {feature.title}
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              {feature.description}
            </p>
          </FadeUp>

          {restFeatures.length > 0 && (
            <StaggerChildren
              staggerDelay={0.08}
              initialDelay={0.3}
              className="space-y-3"
            >
              {restFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-display font-semibold text-white text-sm">
                      {f.title}
                    </div>
                    <div className="text-white/60 text-sm mt-0.5">{f.description}</div>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          )}
        </div>

        {/* Right: product screen / mockup image */}
        <div className="relative">
          {/*
            Image path convention: /section-2-mockup.jpg generated by the skill.
            ImageRevealMask handles the clip-path reveal + onError fallback
            (it hides the img if missing; the container's gradient shows through).
          */}
          <ImageRevealMask
            src={assetUrl("section-about", "baker kneading sourdough dough")}
            alt={feature.title}
            aspectClass="aspect-[4/3]"
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-white/5 to-accent/20"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Section 3 — OVERSIZED TYPE ($0 cost — pure text)
// Manifesto / differentiator moment. Palette contrast to section 2.
// The giant word uses TextReveal for a word-by-word entrance.
// ============================================================
function OversizedTypeSection() {
  const themeWord = siteConfig.sectionThemeWord || "Crafted";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-12"
      style={{ background: siteConfig.brand.accent }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <FadeUp>
          <div
            className="font-mono text-xs tracking-[0.4em] uppercase mb-6 opacity-60"
            style={{ color: siteConfig.brand.bg }}
          >
            {siteConfig.whyUs.heading}
          </div>
        </FadeUp>

        <TextReveal
          as="h2"
          className="font-display font-light text-[80px] sm:text-[140px] md:text-[220px] lg:text-[320px] leading-[0.88] tracking-tight break-words"
          stagger={0.08}
        >
          {themeWord}
        </TextReveal>

        <FadeUp delay={0.4}>
          <p
            className="mt-10 max-w-xl text-base md:text-lg opacity-80"
            style={{ color: siteConfig.brand.bg }}
          >
            {siteConfig.whyUs.items[0]?.description ?? siteConfig.company.description}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// Section 4 — IMAGE GRID (services as image cards)
// Each card can have its own image; gracefully falls back to gradient.
// StaggerChildren reveals cards in sequence as the grid scrolls in.
// ============================================================
function ImageGridSection() {
  return (
    <section className="relative min-h-screen bg-bg flex items-center px-6 py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <FadeUp>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary/80 uppercase mb-3">
              What We Build
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-4xl md:text-6xl text-white font-light">
              {siteConfig.servicesHeading ?? "Services"}
            </h2>
          </FadeUp>
        </div>

        <StaggerChildren
          staggerDelay={0.08}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {siteConfig.services.slice(0, 6).map((svc) => (
            <Link
              key={svc.slug}
              href={`/services/${svc.slug}`}
              className="group block rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:border-primary/40 transition-all h-full"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/30 via-white/5 to-accent/30">
                <img
                  src={assetUrl(`service-${svc.slug}`, svc.name)}
                  alt={svc.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
                <div className="absolute bottom-4 left-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-white mb-2">{svc.name}</h3>
                <p className="text-white/60 text-sm leading-snug line-clamp-2">
                  {svc.description}
                </p>
                <div className="mt-3 font-mono text-xs text-primary/80 group-hover:text-primary transition-colors">
                  Learn more →
                </div>
              </div>
            </Link>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// ============================================================
// Section 5 — OPTIONAL SECONDARY VIDEO LOOP (may be skipped)
// Short atmospheric moment between content sections.
// Skip if budget-constrained: set siteConfig.mixedMedia.skipSecondaryVideo = true.
// ============================================================
function OptionalVideoLoopSection() {
  if (siteConfig.mixedMedia?.skipSecondaryVideo) return null;

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/accent.mp4"
        poster="/accent-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/30 to-bg" />

      <div className="relative h-full flex items-end justify-center pb-16 px-6">
        <FadeUp>
          <div className="text-center max-w-2xl">
            <div className="font-mono text-[11px] tracking-[0.4em] text-white/70 uppercase mb-3">
              {siteConfig.mixedMedia?.accentEyebrow ?? "The Outcome"}
            </div>
            <p className="font-display text-2xl md:text-4xl text-white leading-tight">
              {siteConfig.mixedMedia?.accentLine ??
                siteConfig.manifesto ??
                siteConfig.company.description}
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ============================================================
// Section 6 — CTA
// ============================================================
function CtaSection() {
  return (
    <section className="relative bg-bg py-32 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-[1.0] mb-6">
            {siteConfig.ctaBlock?.heading ?? "Let's build yours."}
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            {siteConfig.ctaBlock?.description ?? siteConfig.company.description}
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MagneticButton
              as="a"
              href="/contact"
              className="min-h-[48px] px-8 py-4 rounded-full bg-primary text-bg font-display font-medium hover:brightness-110"
            >
              {siteConfig.cta.primary}
            </MagneticButton>
            <a
              href={`mailto:${siteConfig.company.email}`}
              className="min-h-[48px] px-8 py-4 rounded-full border border-white/20 text-white font-display font-medium hover:bg-white/5 inline-flex items-center justify-center"
            >
              Or email us directly
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.45}>
          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] md:text-[11px] text-white/50 font-mono uppercase tracking-wider">
            {siteConfig.trustBar.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
