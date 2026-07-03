import { FK_COL, KODAGEN_SCHEMA, BOOKING_SCHEMA, withSchema } from '@/lib/db-scope';
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Loaded provider config for a site — what the booking flow + webhooks read
 * to know which gateway to hit and with what credentials.
 */
export type LoadedProvider =
  | {
      kind: "paystack";
      mode: "test" | "live";
      public_key: string;
      secret_key: string;
      currency: string;
    }
  | {
      kind: "stripe";
      mode: "test" | "live";
      publishable_key: string;
      secret_key: string;
      webhook_secret: string;
      currency: string;
    };

/**
 * Returns every enabled payment provider with all required keys present.
 * If `kind` is passed, returns just that one (or null).
 */
export async function loadEnabledProviders(siteId: string): Promise<LoadedProvider[]> {
  const supabase = createServiceClient();
  const { data } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("integrations")
    .select("kind, config, enabled")
    .eq(FK_COL, siteId)
    .in("kind", ["paystack", "stripe"]);

  const providers: LoadedProvider[] = [];
  for (const row of data ?? []) {
    if (!row.enabled) continue;
    const cfg = (row.config ?? {}) as Record<string, unknown>;
    const get = (k: string) => (typeof cfg[k] === "string" ? (cfg[k] as string).trim() : "");

    if (row.kind === "paystack" && get("public_key") && get("secret_key")) {
      providers.push({
        kind: "paystack",
        mode: (get("mode") as "test" | "live") || "test",
        public_key: get("public_key"),
        secret_key: get("secret_key"),
        currency: get("currency") || "NGN",
      });
    }
    if (row.kind === "stripe" && get("publishable_key") && get("secret_key")) {
      providers.push({
        kind: "stripe",
        mode: (get("mode") as "test" | "live") || "test",
        publishable_key: get("publishable_key"),
        secret_key: get("secret_key"),
        webhook_secret: get("webhook_secret"),
        currency: get("currency") || "USD",
      });
    }
  }
  return providers;
}

/** Look up a single provider by kind. Returns null if not enabled / missing keys. */
export async function loadProvider(
  siteId: string,
  kind: "paystack" | "stripe",
): Promise<LoadedProvider | null> {
  const all = await loadEnabledProviders(siteId);
  return all.find((p) => p.kind === kind) ?? null;
}

/** Look up a site by slug — used by webhooks that don't have a session. */
export async function getSiteByRef(slug: string): Promise<{ id: string; slug: string } | null> {
  const supabase = createServiceClient();
  const { data } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .select("id, slug, status")
    .eq("slug", slug)
    .maybeSingle();
  // Suspended/inactive tenants must not be able to initialize new payments.
  if (!data || data.status !== "active") return null;
  return { id: data.id as string, slug: data.slug as string };
}
