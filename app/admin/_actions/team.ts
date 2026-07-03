"use server";
import { FK_COL, KODAGEN_SCHEMA, BOOKING_SCHEMA, withSchema } from '@/lib/db-scope';
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import { logAudit, type Role, ROLE_DEFAULTS } from "@/lib/audit";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Create a new team member — creates a Supabase auth user + maps them to the site.
 */
export async function createTeamMember(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (ctx.role !== "owner" && ctx.role !== "admin") return { ok: false, error: "Only owners and admins can manage team." };

  const email    = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "").trim();
  const name     = String(fd.get("name") ?? "").trim();
  const role     = String(fd.get("role") ?? "receptionist").trim() as Role;

  if (!email || !password) return { ok: false, error: "Email and password are required." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  const validRoles = ["owner", "admin", "general_manager", "front_office_manager", "supervisor", "receptionist", "night_auditor", "concierge", "housekeeping", "accountant", "viewer"];
  if (!validRoles.includes(role)) {
    return { ok: false, error: "Invalid role." };
  }

  const supabase = createServiceClient();

  // Check if user already exists in auth
  const { data: existingUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = existingUsers?.users?.find((u) => u.email?.toLowerCase() === email);

  let userId: string;

  if (existing) {
    // User exists in auth — check if already mapped to this site
    const { data: mapping } = await withSchema(supabase, KODAGEN_SCHEMA).from("user_sites")
      .select("user_id").eq("user_id", existing.id).eq(FK_COL, ctx.siteId).maybeSingle();
    if (mapping) return { ok: false, error: "This user is already on your team." };
    userId = existing.id;
    // Update their password to what the admin entered
    await supabase.auth.admin.updateUserById(userId, { password, email_confirm: true });
    console.log(`[team] Existing user ${email} — password updated`);
  } else {
    // Create new auth user
    console.log(`[team] Creating user: ${email} with password length: ${password.length}`);
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, kodagen_role: role, kodagen_site_id: ctx.siteId },
    });
    if (createErr) {
      console.error(`[team] Create error:`, createErr.message);
      return { ok: false, error: createErr.message };
    }
    userId = newUser.user.id;
    console.log(`[team] User created: ${userId} — password set OK`);
  }

  // Data masking preferences
  const unmaskEmail = String(fd.get("unmask_email") ?? "false") === "on";
  const unmaskPhone = String(fd.get("unmask_phone") ?? "false") === "on";
  const unmaskName  = String(fd.get("unmask_name") ?? "true") === "on";
  const seeRevenue  = String(fd.get("see_revenue") ?? "false") === "on";

  // Map to site
  const { error: mapErr } = await withSchema(supabase, KODAGEN_SCHEMA).from("user_sites").insert({
    user_id: userId,
    site_id: ctx.siteId,
    role,
    display_name: name || email.split("@")[0],
    permissions: {
      permissions: ROLE_DEFAULTS[role],
      masking: { unmaskEmail, unmaskPhone, unmaskName, seeRevenue },
    },
    active: true,
  });
  if (mapErr) return { ok: false, error: mapErr.message };

  logAudit({ action: "team.create", entityType: "team", entityId: email, details: { name, role } });
  revalidatePath("/admin/team");
  return { ok: true };
}

/**
 * Update a team member's role and permissions.
 */
export async function updateTeamMember(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (ctx.role !== "owner" && ctx.role !== "admin") return { ok: false, error: "No permission." };

  const userId = String(fd.get("userId") ?? "");
  const role   = String(fd.get("role") ?? "") as Role;
  const name   = String(fd.get("name") ?? "").trim();
  const active = String(fd.get("active") ?? "true") === "true";

  if (!userId) return { ok: false, error: "Missing user." };

  // Can't change own role
  if (userId === ctx.user.id) return { ok: false, error: "You can't change your own role." };

  const unmaskEmail = String(fd.get("unmask_email") ?? "false") === "on";
  const unmaskPhone = String(fd.get("unmask_phone") ?? "false") === "on";
  const unmaskName  = String(fd.get("unmask_name") ?? "false") === "on";
  const seeRevenue  = String(fd.get("see_revenue") ?? "false") === "on";

  const supabase = createServiceClient();
  const { error } = await withSchema(supabase, KODAGEN_SCHEMA).from("user_sites")
    .update({
      role,
      display_name: name || undefined,
      permissions: {
        permissions: ROLE_DEFAULTS[role],
        masking: { unmaskEmail, unmaskPhone, unmaskName, seeRevenue },
      },
      active,
    })
    .eq("user_id", userId)
    .eq(FK_COL, ctx.siteId);
  if (error) return { ok: false, error: error.message };

  logAudit({ action: "team.update", entityType: "team", entityId: userId, details: { role, name, active } });
  revalidatePath("/admin/team");
  return { ok: true };
}

/**
 * Remove a team member from the site (doesn't delete their auth account).
 */
export async function removeTeamMember(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (ctx.role !== "owner" && ctx.role !== "admin") return { ok: false, error: "No permission." };

  const userId = String(fd.get("userId") ?? "");
  if (!userId) return { ok: false, error: "Missing user." };
  if (userId === ctx.user.id) return { ok: false, error: "You can't remove yourself." };

  const supabase = createServiceClient();
  const { error } = await withSchema(supabase, KODAGEN_SCHEMA).from("user_sites")
    .delete().eq("user_id", userId).eq(FK_COL, ctx.siteId);
  if (error) return { ok: false, error: error.message };

  logAudit({ action: "team.remove", entityType: "team", entityId: userId });
  revalidatePath("/admin/team");
  return { ok: true };
}

/**
 * Reset a team member's password.
 */
export async function resetTeamPassword(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (ctx.role !== "owner" && ctx.role !== "admin") return { ok: false, error: "No permission." };

  const userId   = String(fd.get("userId") ?? "");
  const password = String(fd.get("password") ?? "").trim();
  if (!userId || !password) return { ok: false, error: "Missing fields." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = createServiceClient();

  // Membership guard — the target MUST be a team member of THIS site before we
  // touch their (shared, global) auth password. Without this an owner/admin of
  // site A could reset any user's password by id, including another tenant's
  // owner → cross-tenant account takeover. removeTeamMember/updateTeamMember
  // already constrain by (user_id, FK_COL); this one skipped the check.
  const { data: membership } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("user_sites")
    .select("user_id")
    .eq("user_id", userId)
    .eq(FK_COL, ctx.siteId)
    .maybeSingle();
  if (!membership) return { ok: false, error: "That user isn't a member of this site." };

  const { error } = await supabase.auth.admin.updateUserById(userId, { password });
  if (error) return { ok: false, error: error.message };

  logAudit({ action: "team.reset_password", entityType: "team", entityId: userId });
  return { ok: true };
}
