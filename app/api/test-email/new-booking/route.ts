import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import NewBookingEmail from "@/app/components/emails/NewBookingEmail";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: 'totobarajas124@gmail.com',
      subject: "Hey! Llegó un pedido de reserva en ZonaQuintas",
      react: NewBookingEmail({
        ownerName: data.owner.name,
        guestName: data.guest.name,
        propertyTitle: data.property.title,
        checkIn: data.property.check_in,
        checkOut: data.property.check_out,
        guests: data.property.guests,
        total: data.property.total,
        currency: data.property.currency,
        message: data.property.message,
      }),
    });

    return NextResponse.json({ ok: true, message: "Email enviado correctamente" });
  } catch (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}