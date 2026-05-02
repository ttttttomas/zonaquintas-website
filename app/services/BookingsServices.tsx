import { apiClient } from "@/lib/axios";
import { Booking } from "@/types";
export const BookingsServices = {
  createBooking: async (payload: Booking) => {
    const r = await apiClient.post("/bookings", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return r.data;
  },
  getOwnerBookings: async (id: string) => {
    const r = await apiClient.get(`/bookings/owner/${id}`);
    return r.data;
  },
  bookingAction: async (bookingId: string, action: string) => {
    const r = await apiClient.patch(
      `/bookings/${bookingId}/status`,
      { status: action },
      { headers: { "Content-Type": "application/json" } },
    );
    return r.data;
  },

  createBookingPayments: async (bookingId: string, payload: any) => {
    const r = await apiClient.post(
      `/bookings/${bookingId}/payments`,
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
    return r.data;
  },

  updateBookingPayment: async (bookingId: string, payload: any) => {
    const r = await apiClient.patch(
      `/booking-payments/${bookingId}`,
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
    return r.data;
  },
}