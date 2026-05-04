import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { BalanceConfirmed } from "@/app/components/emails/BalanceConfirmed";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "totobarajas124@gmail.com",
            subject: "¡Reserva Confirmada! 🎉",
            react: BalanceConfirmed({
                nombreHuesped: data.owner.name,
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