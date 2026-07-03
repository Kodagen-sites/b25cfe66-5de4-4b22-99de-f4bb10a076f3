// Local booking engine — shared DB2 (Kodagen) implementation.
// Replaces the @kodagen/booking-engine monorepo package during tenant builds.
// Only the read surface the shared admin dashboard needs is implemented; on a
// catalog site these tables are simply empty for this site_id.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FK_COL, BOOKING_SCHEMA, withSchema } from "@/lib/db-scope";

type Db = any;

export type BookingState =
  | "pending" | "confirmed" | "active" | "completed" | "cancelled" | "no_show";

export interface Resource {
  id: string;
  type: string;
  name: string | null;
  description: string | null;
  attributes: Record<string, unknown>;
  base_price_cents: number;
  active: boolean;
}

export interface Customer {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
}

export interface Booking {
  id: string;
  resource_id: string;
  customer_id: string | null;
  reference: string;
  start_at: string;
  end_at: string;
  state: BookingState;
  guest_count: number;
  total_cents: number;
  fields: Record<string, unknown>;
  created_at: string;
}

async function listBookings(
  supabase: Db, siteId: string, opts?: { limit?: number },
): Promise<Booking[]> {
  const { data } = await withSchema(supabase, BOOKING_SCHEMA).from("bookings")
    .select("*").eq(FK_COL, siteId)
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 500);
  return (data ?? []).map((b: any): Booking => ({
    id: b.id,
    resource_id: b.resource_id,
    customer_id: b.customer_id ?? null,
    reference: b.reference ?? String(b.id).slice(0, 8).toUpperCase(),
    start_at: b.start_at,
    end_at: b.end_at,
    state: (b.state ?? "pending") as BookingState,
    guest_count: Number(b.guest_count ?? 1),
    total_cents: Number(b.total_cents ?? 0),
    fields: (b.fields ?? {}) as Record<string, unknown>,
    created_at: b.created_at,
  }));
}

async function listResources(supabase: Db, siteId: string): Promise<Resource[]> {
  const { data } = await withSchema(supabase, BOOKING_SCHEMA).from("resources")
    .select("*").eq(FK_COL, siteId).order("sort_order", { ascending: true });
  return (data ?? []).map((r: any): Resource => ({
    id: r.id,
    type: r.type ?? "",
    name: r.name ?? null,
    description: r.description ?? null,
    attributes: (r.attributes ?? {}) as Record<string, unknown>,
    base_price_cents: Number(r.base_price_cents ?? 0),
    active: r.active !== false,
  }));
}

async function listCustomers(
  supabase: Db, siteId: string, opts?: { limit?: number },
): Promise<Customer[]> {
  const { data } = await withSchema(supabase, BOOKING_SCHEMA).from("customers")
    .select("*").eq(FK_COL, siteId)
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 500);
  return (data ?? []).map((c: any): Customer => ({
    id: c.id,
    email: c.email ?? null,
    phone: c.phone ?? null,
    full_name: c.full_name ?? null,
  }));
}

export const services = {
  listBookings,
  listResources,
  listCustomers,
};
