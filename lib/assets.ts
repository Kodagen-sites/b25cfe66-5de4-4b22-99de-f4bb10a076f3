import assetManifest from "@/content/asset-manifest.json";
import { resolveImage } from "@/lib/image-fallback";

const INDUSTRY = "artisan bakery";
const BRAND_COLOR = "#C97C54";

type Manifest = { images?: Record<string, string> };

function rawSlot(slot: string): string {
  return ((assetManifest as Manifest).images ?? {})[slot] ?? "";
}

/**
 * Resolve an image slot from the platform-populated asset manifest, degrading
 * to a branded gradient when the slot hasn't been resolved yet (prompt-only
 * builds populate the manifest asynchronously via gen:unsplash).
 */
export function assetUrl(slot: string, keyword?: string): string {
  return resolveImage({
    src: rawSlot(slot),
    industry: INDUSTRY,
    keyword,
    brandColor: BRAND_COLOR,
  });
}

/** True when the manifest actually holds a resolved URL for the slot. */
export function hasAsset(slot: string): boolean {
  return Boolean(rawSlot(slot));
}
