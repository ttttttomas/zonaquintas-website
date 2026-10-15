import { apiClient } from "@/lib/axios";
import type { OwnerOverview, OwnerBooking } from "./AdminServices";

export type MyOwnerOverview = Omit<OwnerOverview, "bookings"> & {
  bookings: (OwnerBooking & { can_review: boolean; guest_name?: string })[];
};

export const OwnerServices = {
  async overview(signal?: AbortSignal) {
    return (await apiClient.get<MyOwnerOverview>("/owner/overview", { signal })).data;
  },
};
