import { FK_COL, KODAGEN_SCHEMA, BOOKING_SCHEMA, withSchema } from '@/lib/db-scope';
import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { inquiryNotificationEmail, inquiryAutoReplyEmail } from "@/lib/email/templates";

/**
 * Public endpoint — no auth. Visitor submits the contact form on /site/[slug].
 * We resolve site_id from slug, then insert the inquiry server-side so the
 * site_id is verified and we never trust client input on it.
 */
export async function POST(request: NextRequest) {
  let body: { slug?: string; name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim();
  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 50);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!slug || !name || !message) {
    return NextResponse.json({ ok: false, error: "Name and message are required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: site } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .select("id, status")
    .eq("slug", slug)
    .maybeSingle();

  if (!site || site.status !== "active") return NextResponse.json({ ok: false, error: "Site not found." }, { status: 404 });

  const { error } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("inquiries")
    .insert({
      site_id: site.id,
      name, email, phone, message,
      source: "website_form",
      status: "new",
    });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // ── Send email notifications (fire-and-forget — don't block the response) ──
  const siteId = site.id as string;
  const { data: siteRow } = await withSchema(supabase, KODAGEN_SCHEMA).from("sites")
    .select("name, config, theme").eq("id", siteId).maybeSingle();
  const siteCfg = (siteRow?.config ?? {}) as Record<string, unknown>;
  const thm = (siteRow?.theme ?? {}) as Record<string, unknown>;
  const siteName = (siteCfg.businessName as string) || (siteRow?.name as string) || "Your site";
  const brandColor = (thm.primaryColor as string) || undefined;
  const adminEmail = ((siteCfg.contact as Record<string, unknown> | undefined)?.email as string) || "";

  // 1. Notify admin
  if (adminEmail) {
    const tmpl = inquiryNotificationEmail({
      siteName,
      brandColor,
      visitorName: name,
      visitorEmail: email,
      visitorPhone: phone,
      message,
    });
    sendEmail(siteId, {
      to: adminEmail,
      ...tmpl,
      replyTo: email || undefined,
    }).catch((e) => console.error("[email] inquiry:", e));
  }

  // 2. Auto-reply to visitor
  if (email) {
    const tmpl = inquiryAutoReplyEmail({ siteName, brandColor, visitorName: name });
    sendEmail(siteId, { to: email, ...tmpl }).catch((e) => console.error("[email] inquiry:", e));
  }

  return NextResponse.json({ ok: true });
}
