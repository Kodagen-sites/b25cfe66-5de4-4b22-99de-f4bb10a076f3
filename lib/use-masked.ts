"use client";

import { useRole } from "@/app/admin/role-context";
import { maskEmail, maskPhone, maskName, maskAmount } from "@/lib/audit-shared";

/**
 * Hook that returns masking functions based on the current user's permissions.
 * Use in any admin view that displays guest data.
 *
 * Usage:
 *   const m = useMasked();
 *   <p>{m.name(booking.guestName)}</p>
 *   <p>{m.email(booking.guestEmail)}</p>
 *   <p>{m.phone(booking.guestPhone)}</p>
 *   <p>{m.money(booking.totalPrice, "NGN")}</p>
 */
export function useMasked() {
  const { canUnmaskEmail, canUnmaskPhone, canUnmaskName, canSeeRevenue } = useRole();

  return {
    name:  (v: string) => (!v ? "—" : canUnmaskName ? v : maskName(v)),
    email: (v: string) => (!v ? "—" : canUnmaskEmail ? v : maskEmail(v)),
    phone: (v: string) => (!v ? "—" : canUnmaskPhone ? v : maskPhone(v)),
    money: (amount: number | string, currency = "NGN") => {
      if (!canSeeRevenue) return maskAmount();
      if (typeof amount === "number") {
        return `₦${amount.toLocaleString()}`;
      }
      return String(amount);
    },
    canSeeRevenue,
    canUnmaskEmail,
    canUnmaskPhone,
    canUnmaskName,
  };
}
