import { apiClient } from "@/lib/axios";

export type ReviewItem = {
  id: string; booking_id: string; author_id: string; recipient_id: string;
  direction: "guest_to_owner" | "owner_to_guest"; stars: number;
  review_text: string | null; created_at: string; reveal_at: string;
  moderation_status: "visible" | "hidden"; quinta_id: string;
  quinta_title: string | null; author_name: string; author_avatar_url: string | null;
};
export type ReviewSummary = { count: number; average: number | null; distribution: Record<string, number> };
export type BookingReviewState = {
  booking_id: string; quinta_title: string | null; check_in: string; check_out: string; recipient_id: string;
  recipient_name: string; recipient_avatar_url: string | null;
  direction: ReviewItem["direction"]; can_review: boolean; review_reason: string | null;
  review_opens_at: string | null; review_deadline_at: string | null;
  written: ReviewItem | null; received: ReviewItem | null;
};
export type PublicReview = Pick<ReviewItem, "id" | "stars" | "review_text" | "created_at" | "author_name" | "author_avatar_url">;
export type ReviewReport = { id: string; review_id: string; reporter_id: string; reason: string; detail: string | null; status: string; created_at: string; resolved_at: string | null };
export type ModerationEvent = { id: string; admin_id: string; action: string; old_status: string; new_status: string; reason: string; created_at: string };
export function utcDate(value: string) { return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`); }

export const ReviewsServices = {
  async booking(bookingId: string) {
    return (await apiClient.get<BookingReviewState>(`/reviews/booking/${encodeURIComponent(bookingId)}`)).data;
  },
  async create(bookingId: string, stars: number, reviewText: string) {
    return (await apiClient.post("/reviews", { booking_id: bookingId, stars, review_text: reviewText })).data;
  },
  async mine(limit = 20, offset = 0, quintaId?: string) {
    return (await apiClient.get<{ items: ReviewItem[]; host_summary: ReviewSummary; guest_summary: ReviewSummary }>("/reviews/me", { params: { limit, offset, quinta_id: quintaId } })).data;
  },
  async quinta(quintaId: string, limit = 10, offset = 0, stars?: number) {
    return (await apiClient.get<{ items: PublicReview[]; summary: ReviewSummary; total_matching: number }>(`/quintas/${encodeURIComponent(quintaId)}/reviews`, { params: { limit, offset, stars } })).data;
  },
  async hostSummary(ownerId: string) {
    return (await apiClient.get<ReviewSummary>(`/reviews/host/${encodeURIComponent(ownerId)}/summary`)).data;
  },
  async report(reviewId: string, reason: string, details?: string) {
    return (await apiClient.post(`/reviews/${encodeURIComponent(reviewId)}/reports`, { reason, detail: details })).data;
  },
  async adminList(limit = 20, offset = 0) {
    return (await apiClient.get<{ items: ReviewItem[]; reports: ReviewReport[] }>("/admin/reviews", { params: { limit, offset } })).data;
  },
  async moderate(reviewId: string, action: "hide" | "restore", reason: string) {
    return (await apiClient.patch(`/admin/reviews/${encodeURIComponent(reviewId)}/moderation`, { action, reason })).data;
  },
  async moderationEvents(reviewId: string) {
    return (await apiClient.get<ModerationEvent[]>(`/admin/reviews/${encodeURIComponent(reviewId)}/moderation-events`)).data;
  },
};
