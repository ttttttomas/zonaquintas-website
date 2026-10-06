import type { BookingReview } from "./GuestServices";
import { apiClient } from "@/lib/axios";
import type { Balances, Booking, Currency, Quintas, Users } from "@/types";

export type OwnerProperty = Pick<Quintas, "id" | "title" | "address" | "city" | "price" | "currency_price" | "guests" | "bedrooms" | "bathrooms" | "rental_start_date" | "rental_end_date" | "created_at"> & { status: string; main_image: string | null };
export type OwnerBooking = Omit<Booking, "id" | "status"> & { id: string; status: string };
export type OwnerPayment = { id: string; booking_id: string; payment_type: string; amount: number; currency: Currency; status: string; created_at: string; paid_at: string | null };
export type OwnerMovement = { id: string; booking_id: string | null; amount: number; currency: Currency; status: string; date: string; description: string | null; quinta_name: string | null; transfer_date_estimate: string | null };
export type OwnerOverview = {
  owner: Pick<Users, "id" | "name" | "email" | "phone" | "address" | "description" | "created_at" | "owner_location" | "average_opinions" | "pictures">;
  properties: OwnerProperty[];
  bookings: OwnerBooking[];
  payments: OwnerPayment[];
  transactions: OwnerMovement[];
  reviews: BookingReview[];
  balances: Balances;
};

export const AdminServices = {
  async getOwnerOverview(id: string, signal?: AbortSignal): Promise<OwnerOverview> {
    const response = await apiClient.get<OwnerOverview>(`/admin/owners/${encodeURIComponent(id)}/overview`, { signal });
    return response.data;
  },
};
