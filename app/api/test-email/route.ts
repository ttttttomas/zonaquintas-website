import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { LinkPagoEmail } from "@/app/components/emails/LinkPayEmail";

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "totobarajas124@gmail.com",
      subject: "Test — Link de pago ZonaQuintas",
      react: LinkPagoEmail({
        nombreHuesped: "Valentín",
        nombrePropiedad: "Quinta Los Aromos",
        fechaIngreso: "20 de abril de 2026",
        fechaEgreso: "23 de abril de 2026",
        monto: 85000,
        linkPago: "https://zonaquintas.com/pago/test-123",
      }),
    });

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, err }, { status: 500 });
  }
}
