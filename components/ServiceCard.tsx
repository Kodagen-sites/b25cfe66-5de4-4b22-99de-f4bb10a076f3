"use client";

import Link from "next/link";

/**
 * CV8 — Sticker
 *
 * Cards with slight random rotation, soft drop shadow, and a "peeling
 * corner" pseudo element. On hover, rotation goes to 0 and card slightly
 * scales — feels like "picking up" the sticker.
 *
 * Works over bright / pastel backgrounds (S3, S10, S11). On dark styles
 * the sticker still reads but loses some of the paper feeling.
 *
 * Use when:
 *   - Kids / family / playful brands
 *   - Light creative tools, illustration-adjacent brands
 *   - Styles: S3, S10 ideal; S11 works for "gallery label" feel
 *   - Personality: playful, warm, dreamy, editorial-with-warmth
 *
 * Recommended grid: `grid grid-cols-1 md:grid-cols-3 gap-10` (sticker
 * cards need AIR around them — tight gaps ruin the stuck-on-paper feel).
 */

type Service = {
  slug: string;
  name: string;
  description: string;
};

type Props = {
  service: Service;
  index: number;
  imageSrc?: string;
};

// Deterministic rotation per card index — feels random without actually being random.
// Array cycles; cards past index 6 reuse rotations.
const ROTATIONS = [-2.4, 1.8, -1.2, 2.6, -1.8, 2.0];

export default function ServiceCardV8({ service, index, imageSrc }: Props) {
  const rot = ROTATIONS[(index ?? 0) % ROTATIONS.length];

  return (
    <div className="relative" style={{ transform: `rotate(${rot}deg)` }}>
      <Link
        href={`/services/${service.slug}`}
        className="group relative block h-full transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.02]"
        style={{
          background: "#fefcf7",           // warm off-white paper
          color: "#2D1810",                // warm dark brown
          boxShadow:
            "0 18px 40px -12px rgba(45,24,16,0.25), 0 4px 8px -2px rgba(45,24,16,0.10)",
          borderRadius: "6px",
          transformOrigin: "center",
          // counter the parent rotation on hover so card lifts flat
          transform: `rotate(${-rot}deg)`,
          transformBox: "fill-box",
        }}
      >
        {/* Peeling corner — top-right */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
          style={{
            background:
              "linear-gradient(225deg, rgba(45,24,16,0.15) 0%, rgba(45,24,16,0.05) 40%, transparent 50%)",
            borderTopRightRadius: "6px",
          }}
        />

        {imageSrc && (
          <div
            className="relative aspect-[4/3] overflow-hidden"
            style={{
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              borderBottom: "1px solid rgba(45,24,16,0.08)",
            }}
          >
            <img
              src={imageSrc}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        )}

        <div className="p-5 md:p-6">
          <div
            className="inline-block font-mono text-[9px] tracking-[0.25em] uppercase mb-3 px-2 py-1"
            style={{
              background: "rgba(212,130,107,0.15)",
              color: "#D4826B",
              borderRadius: "3px",
            }}
          >
            Service
          </div>
          <h3
            className="font-display text-xl md:text-2xl font-medium leading-tight mb-3"
            style={{ color: "#2D1810" }}
          >
            {service.name}
          </h3>
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: "rgba(45,24,16,0.70)" }}
          >
            {service.description}
          </p>
          <div
            className="font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: "#D4826B" }}
          >
            Pick up →
          </div>
        </div>
      </Link>
    </div>
  );
}
