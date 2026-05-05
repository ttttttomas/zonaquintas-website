import { NextRequest, NextResponse } from "next/server";

const REBILL_API_URL = "https://api.rebill.com/v3";
const REBILL_API_KEY = "sk_2ca4dc4cdece4f178010dcf0f7b6d0fe";
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const { userId, subscriptionId } = await req.json();

        if (!subscriptionId || !userId) {
            return NextResponse.json(
                { error: "Faltan userId o subscriptionId" },
                { status: 400 }
            );
        }

        // 1. Cancelar en Rebill
        const res = await fetch(`${REBILL_API_URL}/subscriptions/${subscriptionId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": REBILL_API_KEY,
            },
            body: JSON.stringify({ status: "cancelled" }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Rebill cancel error:", err);
            return NextResponse.json(
                { error: "Error al cancelar en Rebill", detail: err },
                { status: 502 }
            );
        }

        // 2. Actualizar en tu DB
        await fetch(`${FASTAPI_URL}/users/${userId}/membership`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ membership_status: "cancelled" }),
        });

        return NextResponse.json({ ok: true, status: "cancelled" });

    } catch (err) {
        console.error("Error en cancel:", err);
        return NextResponse.json(
            { error: "Error interno", detail: String(err) },
            { status: 500 }
        );
    }
}