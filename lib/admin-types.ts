export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  /** UUID of the assigned resource (room) — used for the floor-plan picker / reassignment */
  resourceId: string;
  /** Human-readable room number (e.g. "101", "Penthouse") — what guests / staff actually say out loud */
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show";
  /** Payment status from the transactions table */
  paymentStatus: "paid" | "unpaid" | "pending_payment";
  /** Which provider handled the payment */
  paymentProvider?: string;
  /** "room" or "event" — determines which admin section it belongs to */
  bookingType: "room" | "event";
  specialRequests?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  section: "gallery" | "rooms" | "hero" | "about";
  createdAt: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  checkedInGuests: number;
  totalRevenue: number;
  newInquiries: number;
  pageViews: number;
  conversionRate: number;
}

export type IndustryModule = "bookings" | "rentals" | "appointments" | "catalog" | "crm" | "tickets";

export function getIndustryModule(templateId: string): IndustryModule {
  switch (templateId) {
    case "hospitality-v1": return "bookings";
    case "auto-v1": return "rentals";
    case "realestate-v1": return "appointments";
    case "fashion-v1":
    case "fashion-v2":
    case "pharmacy-v1":
    case "agriculture-v1":
    case "interior-v1":
    case "logistics-v1":
      return "catalog";
    case "insurance-v1":
    case "realestate-v1":
      return "crm";
    case "tech-v1":
    case "events-v1":
    case "church-v1":
      return "tickets";
    default: return "bookings";
  }
}

export function getIndustryLabel(mod: IndustryModule): string {
  switch (mod) {
    case "bookings": return "Bookings";
    case "rentals": return "Rentals";
    case "appointments": return "Appointments";
    case "catalog": return "Orders";
    case "crm": return "Deals";
    case "tickets": return "Tickets";
  }
}

// ─── Team & Auth ───────────────────────────────────────

export type TeamRole = "owner" | "admin" | "manager" | "staff";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  status: "active" | "invited" | "deactivated";
  permissions: ModulePermission[];
  lastActive?: string;
  createdAt: string;
}

export type ModulePermission =
  | "dashboard"
  | "bookings"
  | "rentals"
  | "appointments"
  | "inquiries"
  | "content"
  | "media"
  | "settings"
  | "team";

export const roleConfig: Record<TeamRole, { label: string; color: string; bg: string; description: string }> = {
  owner: { label: "Owner", color: "text-purple-700", bg: "bg-purple-100", description: "Full access to everything. Cannot be removed." },
  admin: { label: "Admin", color: "text-blue-700", bg: "bg-blue-100", description: "Full access except team ownership transfer." },
  manager: { label: "Manager", color: "text-green-700", bg: "bg-green-100", description: "Can manage bookings, content, and inquiries." },
  staff: { label: "Staff", color: "text-gray-600", bg: "bg-gray-100", description: "View-only access to bookings and inquiries." },
};

export const defaultPermissions: Record<TeamRole, ModulePermission[]> = {
  owner: ["dashboard", "bookings", "rentals", "appointments", "inquiries", "content", "media", "settings", "team"],
  admin: ["dashboard", "bookings", "rentals", "appointments", "inquiries", "content", "media", "settings", "team"],
  manager: ["dashboard", "bookings", "rentals", "appointments", "inquiries", "content", "media"],
  staff: ["dashboard", "bookings", "rentals", "appointments", "inquiries"],
};

export const allModules: { id: ModulePermission; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "bookings", label: "Bookings / Rentals / Appointments" },
  { id: "inquiries", label: "Inquiries & Messages" },
  { id: "content", label: "Content Management" },
  { id: "media", label: "Media Library" },
  { id: "settings", label: "Settings" },
  { id: "team", label: "Team Management" },
];
