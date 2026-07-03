import { FK_COL, KODAGEN_SCHEMA, BOOKING_SCHEMA, withSchema } from '@/lib/db-scope';
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import { loadSiteConfigFromDB } from "@/lib/load-site-config";
import { getSidebarCounts } from "@/lib/admin-counts";
import TeamView, { type TeamMember } from "./team-view";

export const revalidate = 0;

export default async function TeamPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect("/admin/login");

  const supabase = createServiceClient();
  const [{ data: mappings }, config, counts, { data: auditRows }] = await Promise.all([
    withSchema(supabase, KODAGEN_SCHEMA).from("user_sites")
      .select("user_id, role, display_name, active, permissions, created_at")
      .eq(FK_COL, ctx.siteId)
      .order("created_at"),
    loadSiteConfigFromDB(ctx.site.slug),
    getSidebarCounts(ctx.siteId),
    withSchema(supabase, KODAGEN_SCHEMA).from("audit_log")
      .select("user_email, user_name, action, entity_type, entity_id, details, created_at")
      .eq(FK_COL, ctx.siteId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  // Look up auth emails for each user
  const { data: authUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const authById = new Map((authUsers?.users ?? []).map((u: any) => [u.id, u] as [string, any]));

  const members: TeamMember[] = (mappings ?? []).map((m) => {
    const auth = authById.get(m.user_id as string);
    return {
      userId: m.user_id as string,
      email: auth?.email ?? "unknown",
      name: (m.display_name as string) || auth?.email?.split("@")[0] || "Unknown",
      role: (m.role as string) || "viewer",
      active: Boolean(m.active ?? true),
      isCurrentUser: m.user_id === ctx.user.id,
      createdAt: m.created_at as string,
    };
  });

  const audit = (auditRows ?? []).map((a) => ({
    userEmail: (a.user_email as string) ?? "",
    userName: (a.user_name as string) ?? "",
    action: a.action as string,
    entityType: (a.entity_type as string) ?? "",
    entityId: (a.entity_id as string) ?? "",
    details: (a.details as Record<string, unknown>) ?? {},
    createdAt: a.created_at as string,
  }));

  return <TeamView members={members} audit={audit} currentRole={ctx.role} config={config} counts={counts} />;
}
