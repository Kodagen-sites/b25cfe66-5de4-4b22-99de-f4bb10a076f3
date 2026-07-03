import type { Metadata } from "next";
import { Suspense } from "react";
import OrderConfirmation from "@/components/cart/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-parchment" />}>
      <OrderConfirmation />
    </Suspense>
  );
}
