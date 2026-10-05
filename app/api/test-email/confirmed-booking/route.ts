import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { LinkPagoEmail } from "@/app/components/emails/LinkPayEmail";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.guest?.email) {
      return NextResponse.json({ ok: false, error: "Falta el email del huésped" }, { status: 400 });
    }

    await resend.emails.send({
      from: "pagos@zonaquintas.com",
      to: data.guest.email,
      subject: "Link de pago ZonaQuintas",
      react: LinkPagoEmail({
        nombreHuesped: data.guest.name,
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
