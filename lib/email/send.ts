import { FK_COL, KODAGEN_SCHEMA, withSchema } from '@/lib/db-scope';
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Send a transactional email from a site. Uses:
 *   1. Customer's own Resend API key (if they added one in Integrations), OR
 *   2. Kodagen's managed key from RESEND_API_KEY env var
 *
 * Sender name = the site's businessName. Reply-to = the site's contact email.
 * From address = noreply@kodagen.com (managed domain) or the customer's
 * verified domain if they provide their own key.
 */
export async function sendEmail(
  siteId: string,
  opts: {
    to: string | string[];
    subject: string;
    html: string;
    /** Override the from name (defaults to the site's businessName) */
    fromName?: string;
    /** Override reply-to */
    replyTo?: string;
    /** Tags for filtering in Resend dashboard */
    tags?: { name: string; value: string }[];
  },
): Promise<{ ok: boolean; id?: string; error?: string }> {
  // Resolve email config: customer key → managed key
  const supabase = createServiceClient();
  const [{ data: integration }, { data: site }, { data: settings }] = await Promise.all([
    supabase
      .from("integrations_config")
      .select("config, enabled")
      .eq(FK_COL, siteId)
      .eq("kind", "email")
      .maybeSingle(),
    withSchema(supabase, KODAGEN_SCHEMA)
      .from("sites")
      .select("name")
      .eq("id", siteId)
      .maybeSingle(),
    withSchema(supabase, KODAGEN_SCHEMA)
      .from("site_settings")
      .select("business_name, primary_email")
      .eq(FK_COL, siteId)
      .maybeSingle(),
  ]);

  const cfg = (integration?.config ?? {}) as Record<string, unknown>;
  const contactEmail = (settings?.primary_email as string) ?? "";

  const apiKey = (() => {
    // Customer's own key takes priority if they enabled the integration
    if (integration?.enabled && typeof cfg.api_key === "string" && cfg.api_key.startsWith("re_")) {
      return cfg.api_key;
    }
    // Fall back to Kodagen's managed key
    return process.env.RESEND_API_KEY ?? "";
  })();

  if (!apiKey) {
    return { ok: false, error: "No email API key configured. Add RESEND_API_KEY to .env.local or enable the Email integration." };
  }

  const fromName = opts.fromName ?? (settings?.business_name as string | undefined) ?? (site?.name as string) ?? "Kodagen";
  // Sending domain priority:
  //   1. Customer's own domain (from their Email integration config)
  //   2. Kodagen's managed domain (RESEND_FROM_DOMAIN env)
  //   3. Resend's test domain (fallback — only delivers to Resend account email)
  const fromDomain = (typeof cfg.from_domain === "string" && cfg.from_domain)
    ? cfg.from_domain
    : process.env.RESEND_FROM_DOMAIN ?? "resend.dev";
  const fromLocal = process.env.RESEND_FROM_LOCAL ?? "noreply";
  const fromAddress = fromDomain === "resend.dev"
    ? `${fromName} <onboarding@resend.dev>`
    : `${fromName} <${fromLocal}@${fromDomain}>`;
  const replyTo = opts.replyTo ?? (contactEmail || undefined);

  const resend = new Resend(apiKey);
  try {
    const toAddresses = Array.isArray(opts.to) ? opts.to : [opts.to];
    console.log(`[email] Sending "${opts.subject}" to ${toAddresses.join(", ")} from ${fromAddress}`);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddresses,
      subject: opts.subject,
      html: opts.html,
      replyTo: replyTo ? [replyTo] : undefined,
      tags: opts.tags,
    });
    if (error) {
      console.error("[email] Send failed:", error.message);
      return { ok: false, error: error.message };
    }
    console.log("[email] Sent:", data?.id);
    return { ok: true, id: data?.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] Exception:", msg);
    return { ok: false, error: msg };
  }
}
