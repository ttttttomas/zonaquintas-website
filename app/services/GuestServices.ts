import { apiClient } from "@/lib/axios";
import type { Booking } from "@/types";
export type BookingReview = { id: string; booking_id: string; quinta_id?: string; stars: number; review_text: string | null; created_at: string; quinta_title: string | null; guest_name?: string };
export type GuestPayment = { id: string; payment_type: string; amount: number; currency: string; status: string; rebill_payment_link_url: string | null; payment_expire: string | null; paid_at: string | null };
export type GuestBooking = Omit<Booking, "id" | "status"> & { id: string; status: string; quinta_status: string | null; can_review: boolean; payments: GuestPayment[] };
export type GuestFavorite = { id: string; title: string; city: string; price: number; currency_price: string; main_image: string | null };
export type GuestOverview = { bookings: GuestBooking[]; favorites: GuestFavorite[]; reviews: BookingReview[]; received_reviews: BookingReview[] };
type FavoriteReference = { id: string; quinta_id?: string };
const favoriteCache = new Map<string, FavoriteReference[]>();
const favoriteRequests = new Map<string, Promise<FavoriteReference[]>>();

export const GuestServices = {
  async overview(signal?: AbortSignal) { return (await apiClient.get<GuestOverview>("/guest/overview", { signal })).data; },
  async favorites(userId: string, signal?: AbortSignal) {
    const cached = favoriteCache.get(userId);
    if (cached) return cached;
    const pending = !signal ? favoriteRequests.get(userId) : undefined;
    if (pending) return pending;

    const request = apiClient.get<FavoriteReference[]>(`/favorites/${encodeURIComponent(userId)}`, { signal })
      .then(({ data }) => {
        favoriteCache.set(userId, data);
        return data;
      });
    if (!signal) {
      favoriteRequests.set(userId, request);
      void request.then(
        () => favoriteRequests.delete(userId),
        () => favoriteRequests.delete(userId),
      );
    }
    return request;
  },
  async review(booking_id: string, stars: number, review_text: string) { await apiClient.post("/reviews", { booking_id, stars, review_text }); },
  async favorite(user_id: string, quinta_id: string) {
    await apiClient.post("/favorites", { user_id, quinta_id });
    const cached = favoriteCache.get(user_id);
    if (cached && !cached.some(item => item.id === quinta_id || item.quinta_id === quinta_id)) {
      favoriteCache.set(user_id, [...cached, { id: quinta_id, quinta_id }]);
    }
  },
  async removeFavorite(userId: string, quintaId: string) {
    await apiClient.delete(`/favorites/${encodeURIComponent(userId)}/${encodeURIComponent(quintaId)}`);
    const cached = favoriteCache.get(userId);
    if (cached) favoriteCache.set(userId, cached.filter(item => item.id !== quintaId && item.quinta_id !== quintaId));
  },
};
