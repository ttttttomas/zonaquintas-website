import type { QuintaAvailability } from "@/types";

export function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function argentinaToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function dateFromISO(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const utc = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((utc(checkOut) - utc(checkIn)) / 86400000);
}

export function stayAvailable(availability: QuintaAvailability, checkIn: string, checkOut: string): boolean {
  if (checkOut <= checkIn) return false;
  if (availability.rental_start_date && checkIn < availability.rental_start_date) return false;
  if (availability.rental_end_date && checkOut > availability.rental_end_date) return false;
  return !availability.blocked.some((booking) => booking.check_in < checkOut && booking.check_out > checkIn);
}
