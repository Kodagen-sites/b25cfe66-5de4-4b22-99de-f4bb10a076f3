// Local catalog engine — shared DB2 (Kodagen) implementation.
// Replaces the @kodagen/catalog-engine monorepo package during tenant builds.
// All product/category/variant/inventory tables live in the `catalog` Postgres
// schema; orders live in the public schema. Every query is scoped by site_id.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FK_COL } from "@/lib/db-scope";

type Db = any;

const CATALOG = "catalog";

export type ProductStatus = "draft" | "active" | "archived";
export type OrderState =
  | "pending" | "confirmed" | "processing" | "shipped"
  | "delivered" | "cancelled" | "refunded" | "paid";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[];
  base_price_cents: number;
  compare_at_price_cents: number | null;
  sku: string | null;
  category_id: string | null;
  status: ProductStatus;
  featured: boolean;
  attributes: Record<string, unknown>;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: string | null;
  active: boolean;
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price_cents: number | null;
  inventory_qty: number;
  low_stock_threshold: number;
  active: boolean;
  attributes: Record<string, unknown>;
}

export interface InventoryLogEntry {
  id: string;
  variant_id: string;
  adjustment: number;
  reason: string | null;
  created_at: string;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ref(id: string): string {
  return String(id).slice(0, 8).toUpperCase();
}

async function listProducts(supabase: Db, siteId: string): Promise<Product[]> {
  const { data } = await supabase.schema(CATALOG).from("products")
    .select("*").eq(FK_COL, siteId).order("created_at", { ascending: false });
  return (data ?? []).map((p: any): Product => ({
    id: p.id,
    name: p.name ?? "",
    slug: p.slug ?? "",
    description: p.description ?? null,
    images: Array.isArray(p.images) ? p.images : [],
    base_price_cents: Number(p.base_price_cents ?? 0),
    compare_at_price_cents: p.compare_at_price_cents ?? null,
    sku: p.sku ?? null,
    category_id: p.category_id ?? null,
    status: (p.status ?? "draft") as ProductStatus,
    featured: Boolean(p.featured),
    attributes: (p.attributes ?? {}) as Record<string, unknown>,
    created_at: p.created_at,
  }));
}

async function listCategories(supabase: Db, siteId: string): Promise<Category[]> {
  const { data } = await supabase.schema(CATALOG).from("categories")
    .select("*").eq(FK_COL, siteId).order("sort_order", { ascending: true });
  return (data ?? []).map((c: any): Category => ({
    id: c.id,
    name: c.name ?? "",
    slug: c.slug ?? "",
    description: c.description ?? null,
    image: c.image ?? null,
    parent_id: c.parent_id ?? null,
    active: c.active !== false,
  }));
}

async function listVariants(supabase: Db, siteId: string, productId: string): Promise<Variant[]> {
  const { data } = await supabase.schema(CATALOG).from("variants")
    .select("*").eq(FK_COL, siteId).eq("product_id", productId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((v: any): Variant => ({
    id: v.id,
    product_id: v.product_id,
    name: v.name ?? "",
    sku: v.sku ?? null,
    price_cents: v.price_cents ?? null,
    inventory_qty: Number(v.inventory_qty ?? 0),
    low_stock_threshold: Number(v.low_stock_threshold ?? 0),
    active: v.active !== false,
    attributes: (v.attributes ?? {}) as Record<string, unknown>,
  }));
}

async function getInventoryLog(
  supabase: Db, siteId: string, opts?: { limit?: number },
): Promise<InventoryLogEntry[]> {
  const { data } = await supabase.schema(CATALOG).from("inventory_log")
    .select("*").eq(FK_COL, siteId)
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 50);
  return (data ?? []).map((l: any): InventoryLogEntry => ({
    id: l.id,
    variant_id: l.variant_id,
    adjustment: Number(l.adjustment ?? 0),
    reason: l.reason ?? null,
    created_at: l.created_at,
  }));
}

async function createProduct(
  supabase: Db, siteId: string,
  input: {
    name: string; description?: string; category_id?: string;
    base_price_cents: number; compare_at_price_cents?: number; sku?: string;
    status: ProductStatus; featured: boolean; images: string[];
    attributes: Record<string, unknown>;
  },
): Promise<{ id: string }> {
  const { data, error } = await supabase.schema(CATALOG).from("products")
    .insert({
      [FK_COL]: siteId,
      name: input.name,
      slug: slugify(input.name),
      description: input.description ?? null,
      category_id: input.category_id ?? null,
      base_price_cents: input.base_price_cents,
      compare_at_price_cents: input.compare_at_price_cents ?? null,
      sku: input.sku ?? null,
      status: input.status,
      featured: input.featured,
      images: input.images,
      attributes: input.attributes,
    })
    .select("id").single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

async function updateProduct(
  supabase: Db, siteId: string, id: string, patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.schema(CATALOG).from("products")
    .update(patch).eq("id", id).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
}

async function deleteProduct(supabase: Db, siteId: string, id: string): Promise<void> {
  const { error } = await supabase.schema(CATALOG).from("products")
    .delete().eq("id", id).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
}

async function createCategory(
  supabase: Db, siteId: string,
  input: { name: string; description?: string; image?: string; parent_id?: string },
): Promise<{ id: string }> {
  const { data, error } = await supabase.schema(CATALOG).from("categories")
    .insert({
      [FK_COL]: siteId,
      name: input.name,
      slug: slugify(input.name),
      description: input.description ?? null,
      image: input.image ?? null,
      parent_id: input.parent_id ?? null,
      active: true,
    })
    .select("id").single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

async function updateCategory(
  supabase: Db, siteId: string, id: string, patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.schema(CATALOG).from("categories")
    .update(patch).eq("id", id).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
}

async function deleteCategory(supabase: Db, siteId: string, id: string): Promise<void> {
  const { error } = await supabase.schema(CATALOG).from("categories")
    .delete().eq("id", id).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
}

async function createVariant(
  supabase: Db, siteId: string,
  input: {
    product_id: string; name: string; sku?: string; price_cents?: number;
    attributes: Record<string, unknown>; inventory_qty: number; low_stock_threshold: number;
  },
): Promise<{ id: string }> {
  const { data, error } = await supabase.schema(CATALOG).from("variants")
    .insert({
      [FK_COL]: siteId,
      product_id: input.product_id,
      name: input.name,
      sku: input.sku ?? null,
      price_cents: input.price_cents ?? null,
      attributes: input.attributes,
      inventory_qty: input.inventory_qty,
      low_stock_threshold: input.low_stock_threshold,
      active: true,
    })
    .select("id").single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

async function deleteVariant(supabase: Db, siteId: string, variantId: string): Promise<void> {
  const { error } = await supabase.schema(CATALOG).from("variants")
    .delete().eq("id", variantId).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
}

async function adjustInventory(
  supabase: Db, siteId: string, variantId: string,
  adjustment: number, reason: string, _userId: string,
): Promise<void> {
  const { data: current } = await supabase.schema(CATALOG).from("variants")
    .select("inventory_qty").eq("id", variantId).eq(FK_COL, siteId).single();
  const next = Number(current?.inventory_qty ?? 0) + adjustment;
  const { error: upErr } = await supabase.schema(CATALOG).from("variants")
    .update({ inventory_qty: next }).eq("id", variantId).eq(FK_COL, siteId);
  if (upErr) throw new Error(upErr.message);
  await supabase.schema(CATALOG).from("inventory_log").insert({
    [FK_COL]: siteId,
    variant_id: variantId,
    adjustment,
    reason,
  });
}

async function transitionOrderState(
  supabase: Db, siteId: string, orderId: string, newState: OrderState, _reason?: string,
): Promise<{ reference: string }> {
  const { error } = await supabase.from("orders")
    .update({ status: newState, updated_at: new Date().toISOString() })
    .eq("id", orderId).eq(FK_COL, siteId);
  if (error) throw new Error(error.message);
  return { reference: ref(orderId) };
}

async function createOrder(
  supabase: Db, siteId: string,
  input: {
    customer: { full_name: string; email?: string; phone?: string };
    items: Array<{ product_id: string; variant_id?: string; quantity: number }>;
    shipping_cents: number; discount_cents: number; notes?: string;
    fields?: Record<string, unknown>;
  },
): Promise<{ reference: string }> {
  const productIds = [...new Set(input.items.map((i) => i.product_id))];
  const { data: products } = await supabase.schema(CATALOG).from("products")
    .select("id, base_price_cents, name").in("id", productIds).eq(FK_COL, siteId);
  const priceById = new Map<string, { price: number; name: string }>(
    (products ?? []).map((p: any) => [p.id, { price: Number(p.base_price_cents ?? 0), name: p.name ?? "" }]),
  );

  const lineItems = input.items.map((i) => {
    const info = priceById.get(i.product_id);
    const unit = info?.price ?? 0;
    return { name: info?.name ?? "Item", qty: i.quantity, price: unit / 100, variant: i.variant_id };
  });
  const subtotalCents = input.items.reduce(
    (sum, i) => sum + (priceById.get(i.product_id)?.price ?? 0) * i.quantity, 0,
  );
  const totalCents = subtotalCents + input.shipping_cents - input.discount_cents;

  const { data, error } = await supabase.from("orders")
    .insert({
      [FK_COL]: siteId,
      guest_name: input.customer.full_name,
      guest_email: input.customer.email ?? null,
      guest_phone: input.customer.phone ?? null,
      items: lineItems,
      subtotal: subtotalCents,
      total: totalCents,
      status: "pending",
      notes: input.notes ?? null,
    })
    .select("id").single();
  if (error) throw new Error(error.message);
  return { reference: ref(data.id) };
}

export const services = {
  listProducts,
  listCategories,
  listVariants,
  getInventoryLog,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createVariant,
  deleteVariant,
  adjustInventory,
  transitionOrderState,
  createOrder,
};
