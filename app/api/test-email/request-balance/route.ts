import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import RequestBalance from "@/app/components/emails/RequestBalance";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: 'totobarajas124@gmail.com',
      subject: "Nuevo pedido de transferencia",
      react: RequestBalance({
        clientName: data.client.name,
        totalUsd: data.property.totalUsd,
        totalArs: data.property.totalArs,
        bankAccount: data.property.bank_account,
      }),
    });

    return NextResponse.json({ ok: true, message: "Email enviado correctamente" });
  } catch (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}