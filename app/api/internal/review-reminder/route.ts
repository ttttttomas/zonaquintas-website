import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import ReviewReminder from "@/app/components/emails/ReviewReminder";

type ReminderPayload = {
  job_id: string; booking_id: string; email: string; recipient_name: string;
  person_to_review: string; quinta_title: string; check_out: string;
  role: "guest" | "owner";
};

function authorized(supplied: string | null, expected: string | undefined) {
  if (!supplied || !expected) return false;
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const token = process.env.REVIEW_INTERNAL_TOKEN;
  if (!authorized(request.headers.get("x-review-internal-token"), token)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const backendUrl = process.env.REVIEW_BACKEND_URL;
  const publicUrl = process.env.REVIEW_PUBLIC_URL;
  const testMode = process.env.REVIEW_TEST_MODE === "1";
  const testRecipient = process.env.REVIEW_TEST_RECIPIENT;
  if (!backendUrl || !publicUrl || !process.env.RESEND_API_KEY || (testMode && !testRecipient)) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  let body: { job_id?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (typeof body.job_id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.job_id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const apiResponse = await fetch(`${backendUrl.replace(/\/$/, "")}/internal/review-reminders/${body.job_id}`, {
      headers: { "x-review-internal-token": token! }, cache: "no-store",
    });
    if (!apiResponse.ok) return NextResponse.json({ ok: false }, { status: 409 });
    const job = await apiResponse.json() as ReminderPayload;
    if (job.job_id !== body.job_id || !job.email || !["guest", "owner"].includes(job.role)) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    const route = job.role === "guest" ? "/estadias" : "/reservations";
    const href = new URL(route, publicUrl);
    href.searchParams.set("booking", job.booking_id);
    href.searchParams.set("action", "review");
    const checkOut = new Date(`${job.check_out.slice(0, 10)}T12:00:00Z`);
    const deadline = new Date(checkOut.getTime() + 14 * 86400000);
    const format = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" });
    const { data, error } = await resend.emails.send({
      from: "ZonaQuintas <reservas@zonaquintas.com>", to: testMode ? testRecipient! : job.email,
      subject: "Contanos cómo fue tu experiencia en ZonaQuintas",
      react: ReviewReminder({
        name: job.recipient_name, person: job.person_to_review,
        quinta: job.quinta_title, checkOut: format.format(checkOut), deadline: format.format(deadline),
        href: href.toString(), role: job.role
      }),
    }, { idempotencyKey: `review-reminder-${job.job_id}` });
    if (error || !data?.id) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
