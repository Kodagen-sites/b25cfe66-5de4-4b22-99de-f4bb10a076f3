// lib/db-scope.ts
//
// Controls whether this site uses Kodagen's shared DB (DB2) or a dedicated
// per-tenant Supabase project. Set NEXT_PUBLIC_DB_MODE in .env:
//
//   NEXT_PUBLIC_DB_MODE=dedicated  (default)
//     → each tenant has its own Supabase project
//     → FK column is "tenant_id"
//     → scope ID comes from NEXT_PUBLIC_TENANT_ID (set at provisioning)
//
//   NEXT_PUBLIC_DB_MODE=shared
//     → all tenants share one Supabase project (Kodagen DB2)
//     → FK column is "site_id"
//     → scope ID resolved at runtime: NEXT_PUBLIC_SITE_SLUG → sites table
//     → additional Postgres schemas: "kodagen", "booking"

export type DbMode = 'dedicated' | 'shared';

export const DB_MODE: DbMode =
  (process.env.NEXT_PUBLIC_DB_MODE as DbMode | undefined) ?? 'dedicated';

// FK column name used on every site_* table and related tables
export const FK_COL = DB_MODE === 'shared' ? 'site_id' : 'tenant_id';

// Postgres schema names — null in dedicated mode (everything in public schema)
export const KODAGEN_SCHEMA: string | null = DB_MODE === 'shared' ? 'kodagen' : null;
export const BOOKING_SCHEMA:  string | null = DB_MODE === 'shared' ? 'booking'  : null;

const TENANT_ID_ENV = process.env.NEXT_PUBLIC_TENANT_ID ?? '';
const SITE_SLUG_ENV = process.env.NEXT_PUBLIC_SITE_SLUG ?? '';

/**
 * Returns the FK value for scoping all DB queries to this site.
 *
 * Dedicated: reads NEXT_PUBLIC_TENANT_ID from env (zero DB hits).
 * Shared:    looks up site_id via NEXT_PUBLIC_SITE_SLUG → sites table.
 *
 * Pass an existing Supabase client to avoid creating a second one.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getScopeId(supabase?: any): Promise<string> {
  if (DB_MODE === 'dedicated') return TENANT_ID_ENV;

  const { createServiceClient } = await import('@/lib/supabase/server');
  const client = supabase ?? createServiceClient();
  const { data } = await client
    .from('sites')
    .select('id')
    .eq('slug', SITE_SLUG_ENV)
    .maybeSingle();
  return data?.id ?? '';
}

/**
 * Optionally applies a named Postgres schema to a Supabase client.
 * Returns the client unchanged when schema is null (dedicated mode).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withSchema(client: any, schema: string | null): any {
  return schema ? client.schema(schema) : client;
}
