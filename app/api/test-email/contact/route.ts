import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { ContactoEmail } from "@/app/components/emails/ContactoEmail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.email || !body.role || !body.phone || !body.message) {
            return NextResponse.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: 'totobarajas124@gmail.com',
            replyTo: body.email,
            subject: `Contacto ZonaQuintas — Consulta de ${body.name} - ${body.role}`,
            react: ContactoEmail({
                name: body.name,
                email: body.email,
                role: body.role,
                message: body.message,
                phone: body.phone,
            }),
        });

        if (error) {
            return NextResponse.json({ ok: false, error }, { status: 500 });
        }

        return NextResponse.json({ ok: true });

    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}