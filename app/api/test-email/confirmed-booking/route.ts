import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { LinkPagoEmail } from "@/app/components/emails/LinkPayEmail";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "totobarajas124@gmail.com",
      subject: "Link de pago ZonaQuintas",
      react: LinkPagoEmail({
        nombreHuesped: data.owner.name,
        nombrePropiedad: data.property.title,
        fechaIngreso: data.property.check_in,
        fechaEgreso: data.property.check_out,
        monto: data.property.total,
        linkPago: data.linkPago,
        currency: data.property.currency,
      }),
    });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, err }, { status: 500 });
  }
}
