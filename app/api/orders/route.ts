import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

type OrderItem = {
  product_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  variant?: string;
  image_url?: string;
};

type StoredOrder = {
  id: string;
  status: "placed";
  customer: { full_name: string; email: string };
  items: { name: string; quantity: number; variant?: string }[];
  subtotal_cents: number;
  currency: string;
  created_at: string;
};

// In-memory store. Survives within a single server instance; the client also
// caches the order in localStorage so the confirmation page works regardless.
const orders = new Map<string, StoredOrder>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: OrderItem[] = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Cart is empty." },
        { status: 400 },
      );
    }

    const orderId = randomUUID();
    orders.set(orderId, {
      id: orderId,
      status: "placed",
      customer: {
        full_name: body?.customer?.full_name ?? "",
        email: body?.customer?.email ?? "",
      },
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        variant: i.variant,
      })),
      subtotal_cents: Number(body?.subtotal_cents ?? 0),
      currency: body?.currency ?? "USD",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, orderId });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not process the order." },
      { status: 400 },
    );
  }
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }
  const order = orders.get(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}
