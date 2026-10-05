import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { BalanceConfirmed } from "@/app/components/emails/BalanceConfirmed";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.guest?.email) {
            return NextResponse.json({ ok: false, error: "Falta el email del huésped" }, { status: 400 });
        }

        await resend.emails.send({
            from: "reservas@zonaquintas.com",
            to: data.guest.email,
            subject: "¡Reserva Confirmada! 🎉",
            react: BalanceConfirmed({
                nombreHuesped: data.guest.name,
                nombrePropiedad: data.property.title,
                linkPago: data.linkPago,
                currency: data.property.currency,
            }),
        });

        return NextResponse.json({ ok: true, data });
    } catch (err) {
        return NextResponse.json({ ok: false, err }, { status: 500 });
    }
}
