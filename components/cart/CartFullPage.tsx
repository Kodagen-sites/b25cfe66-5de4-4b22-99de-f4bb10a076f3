"use client";

/**
 * CartFullPage (variant C4) — full-page cart at /cart.
 *
 * Replaces the slide-in drawer entirely. The CartIcon in the header
 * navigates to /cart instead of opening a drawer; this component renders
 * the cart contents as a dedicated page with a sticky checkout summary on
 * desktop.
 *
 * Best for high-volume commerce, large baskets (>10 items), and any site
 * where the cart deserves real estate (bundled offers, gift wrap toggles,
 * estimated shipping). Combine with CartProvider but DO NOT mount
 * CartDrawer — they conflict.
 *
 * Drop into app/cart/page.tsx (the skill copies this file there).
 */

import Link from "next/link";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartFullPage() {
  const { items, subtotalCents, formatPrice, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-parchment px-6 py-20">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone/5 flex items-center justify-center mb-6">
            <ShoppingBag size={20} className="text-stone/40" />
          </div>
          <h1 className="font-display font-light text-stone text-3xl mb-3">Your cart is empty</h1>
          <p className="text-stone/60 text-sm mb-8 leading-relaxed">Browse the shop and add a few things you love.</p>
          <Link href="/shop" className="inline-block bg-stone text-cream px-8 py-3.5 rounded-sm text-sm font-medium tracking-wide hover:bg-bark transition-colors">
            Browse the shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-parchment py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="mb-8">
          <Link href="/shop" className="text-xs uppercase tracking-widest text-stone/50 hover:text-stone">
            ← Continue browsing
          </Link>
          <h1 className="mt-3 font-display font-light text-stone text-3xl lg:text-4xl">Your cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
          {/* Item list */}
          <ul className="divide-y divide-stone/10">
            {items.map((item) => (
              <li key={`${item.id}::${item.variant ?? ""}`} className="flex gap-5 py-6">
                {item.imageUrl ? (
                  <Link href={item.href ?? "#"} className="block w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 overflow-hidden rounded-sm bg-stone/5">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  </Link>
                ) : (
                  <div className="w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 rounded-sm bg-stone/5" aria-hidden />
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <Link href={item.href ?? "#"} className="text-base font-medium text-stone leading-snug hover:text-bark transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-base text-stone whitespace-nowrap">{formatPrice(item.priceCents * item.quantity)}</p>
                    </div>
                    {item.variant && <p className="text-xs text-stone/50 mt-1">{item.variant}</p>}
                    <p className="text-xs text-stone/50 mt-0.5">{formatPrice(item.priceCents)} each</p>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="inline-flex items-center border border-stone/15 rounded-sm">
                      <button onClick={() => updateQty(item.id, item.variant, item.quantity - 1)} aria-label="Decrease" className="w-9 h-9 flex items-center justify-center text-stone/60 hover:text-stone transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm text-stone">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.variant, item.quantity + 1)} aria-label="Increase" className="w-9 h-9 flex items-center justify-center text-stone/60 hover:text-stone transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id, item.variant)} className="text-xs text-stone/50 hover:text-stone underline underline-offset-4 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="bg-cream/40 rounded-sm p-6 lg:sticky lg:top-6">
            <h2 className="text-xs uppercase tracking-widest text-stone/50 mb-4">Summary</h2>
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-stone/65">
                <span>Subtotal</span>
                <span className="text-stone">{formatPrice(subtotalCents)}</span>
              </div>
              <p className="text-[11px] text-stone/40 leading-relaxed pt-1">Taxes &amp; shipping calculated at checkout.</p>
            </div>
            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 bg-stone text-cream py-3.5 rounded-sm text-sm font-medium tracking-wide hover:bg-bark transition-colors"
            >
              Checkout
              <ArrowRight size={14} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
