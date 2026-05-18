import { NextRequest, NextResponse } from "next/server";

const REBILL_API_URL = "https://api.rebill.com/v3";
const REBILL_API_KEY = process.env.REBILL_API_KEY!;
const REBILL_PLAN_ID = process.env.REBILL_PLAN_ID;
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
    try {
        const { userId, email, firstName, lastName } = await req.json();

        if (!userId || !email || !firstName || !lastName) {
            return NextResponse.json(
                { error: "Faltan datos del propietario" },
                { status: 400 }
            );
        }

        // Crear payment link de tipo subscription
        const res = await fetch(`${REBILL_API_URL}/payment-links`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": REBILL_API_KEY,
            },
            body: JSON.stringify({
                type: "plan",                    // ← "plan" no "subscription"
                title: [
                    { language: "es", text: "Membresía Mensual ZonaQuintas" }
                ],
                plan: {
                    id: REBILL_PLAN_ID,
                },
                paymentMethods: [                // ← array obligatorio
                    {
                        methods: ["card"],
                        currency: "ARS",
                    }
                ],
                isSingleUse: true,
                redirectUrls: {
                    approved: `${BASE_URL}/membership/success`,
                    rejected: `${BASE_URL}/membership/failed`,
                    pending: `${BASE_URL}/membership/pending`,
                },
                metadata: {
                    user_id: userId,
                },
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Rebill payment link error:", err);
            return NextResponse.json(
                { error: "Error al crear link de suscripción", detail: err },
                { status: 502 }
            );
        }

        const paymentLink = await res.json();

        // Guardar el payment link id en DB mientras esperamos el webhook
        await fetch(`${FASTAPI_URL}/users/${userId}/membership`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                membership_status: "pending",
                rebill_payment_link_id: paymentLink.id,
            }),
        });

        return NextResponse.json({
            ok: true,
            url: paymentLink.url,
        });

    } catch (err) {
        console.error("Error en subscribe:", err);
        return NextResponse.json(
            { error: "Error interno", detail: String(err) },
            { status: 500 }
        );
    }
}