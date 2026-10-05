import { NextRequest, NextResponse } from "next/server";
import type { PriceInput } from "@/types";
import { getRebillApiKey } from "@/lib/rebill-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!request.cookies.get("access_token")?.value) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = getRebillApiKey();
  if (!apiKey) {
    console.error("Falta configurar la clave Rebill para el entorno de Next.js");
    return NextResponse.json(
      { error: "La integración de pagos no está configurada" },
      { status: 500 },
    );
  }

  try {
    const data = (await request.json()) as {
      prices?: PriceInput;
      reservaId?: string;
      paymentId?: string;
      paymentType?: string;
      ownerId?: string;
    };

    if (
      !data.reservaId ||
      !data.paymentId ||
      !data.paymentType ||
      !data.ownerId ||
      !data.prices?.currency ||
      typeof data.prices.amount !== "number"
    ) {
      return NextResponse.json({ error: "Datos de pago inválidos" }, { status: 400 });
    }

    const response = await fetch("https://api.rebill.com/v3/payment-links", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: [{ text: `Pago de Reserva - ZonaQuintas. ID: ${data.reservaId}`, language: "es" }],
        paymentMethods: [{ methods: ["card"], currency: data.prices.currency }],
        prices: [{ amount: data.prices.amount, currency: data.prices.currency, isDefault: true }],
        installmentsSettings: [{ currency: data.prices.currency, enabledInstallments: [1, 3, 6, 12] }],
        isSingleUse: true,
        redirectUrls: {
          approved: `https://www.zonaquintas.com/pay_ticket_rebill_success?id=${encodeURIComponent(data.ownerId)}`,
          rejected: "https://www.zonaquintas.com/pay_ticket_rebill_rejected",
          pending: "https://www.zonaquintas.com/pay_ticket_rebill_pending",
        },
        metadata: {
          payment_id: data.paymentId,
          booking_id: data.reservaId,
          payment_type: data.paymentType,
        },
      }),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Rebill payment link request failed", { status: response.status });
      return NextResponse.json(
        { error: "Rebill no pudo crear el link de pago" },
        { status: 502 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creando el link de pago con Rebill", error);
    return NextResponse.json(
      { error: "No se pudo crear el link de pago" },
      { status: 500 },
    );
  }
}
