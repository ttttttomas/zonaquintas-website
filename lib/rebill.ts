import { PriceInput } from "@/types";

const REBILL_API_URL = "https://api.rebill.com/v3";
const REBILL_API_KEY = process.env.REBILL_API_KEY!;

const headers = {
  "x-api-key": REBILL_API_KEY,
  "Content-Type": "application/json",
}

// Crea un payment link para una reserva
export async function createPaymentLinkRebill(data: {
  prices: PriceInput; // en centavos (ej: 85000 ARS = 8500000)
  reservaId: string;
  paymentId: string;
  paymentType: string; // 'deposit' o 'balance'
  ownerId: string;
}) {
  const res = await fetch(`${REBILL_API_URL}/payment-links`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: [
        {
          text: "Pago de Reserva - ZonaQuintas. ID: " + data.reservaId,
          language: "es",
        },
      ],
      paymentMethods: [
        {
          methods: ["card"],
          currency: data?.prices.currency ?? "ARS",
        },
      ],
      prices: [
        {
          amount: data.prices.amount,
          currency: data?.prices?.currency,
          isDefault: true,
        },
      ],
      installmentsSettings: [
        {
          currency: data.prices.currency,
          enabledInstallments: [1, 3, 6, 12],
        },
      ],
      isSingleUse: true, // 👈 importante si querés que se use una sola vez
      redirectUrls: {
        approved: `https://www.zonaquintas.com/pay_ticket_rebill_success?id=${data.ownerId}`,
        rejected: "https://www.zonaquintas.com/pay_ticket_rebill_rejected",
        pending: "https://www.zonaquintas.com/pay_ticket_rebill_pending",
        // approved: "http://localhost:3000/pay_ticket_rebill_success",
        // rejected: "http://localhost:3000/pay_ticket_rebill_rejected",
        // pending: "http://localhost:3000/pay_ticket_rebill_pending",
      },
      metadata: {
        payment_id: data.paymentId, // lo pasás al llamar la función
        booking_id: data.reservaId,
        payment_type: data.paymentType,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Rebill crearPaymentLink error: ${JSON.stringify(err)}`);
  }

  return res.json();
}

// Crea un payment link para una suscripción de membresía
export async function createSubscriptionLinkRebill(data: {
  amount: number; // en centavos o valor nominal según configuración de Rebill
  currency: string;
  userId: string;
  email: string;
}) {
  const res = await fetch(`${REBILL_API_URL}/payment-links`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: [
        {
          text: "Suscripción Membresía Premium - ZonaQuintas",
          language: "es",
        },
      ],
      paymentMethods: [
        {
          methods: ["card"],
          currency: data.currency,
        },
      ],
      prices: [
        {
          amount: data.amount,
          currency: data.currency,
          isDefault: true,
        },
      ],
      isSingleUse: false, // Las suscripciones suelen permitir múltiples usos o son reutilizables
      redirectUrls: {
        approved: `https://www.zonaquintas.com/membership_success?id=${data.userId}`,
        rejected: "https://www.zonaquintas.com/membership_rejected",
        pending: "https://www.zonaquintas.com/membership_pending",
      },
      metadata: {
        user_id: data.userId,
        payment_type: "membership",
        plan: "premium",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Rebill crearSubscriptionLink error: ${JSON.stringify(err)}`);
  }

  return res.json();
}

export async function getPaymentLinkRebill(data: { paymentId: string }) {
  const res = await fetch(`${REBILL_API_URL}/payment-links/${data.paymentId}`, {
    method: "GET",
    headers: {
      "x-api-key": REBILL_API_KEY,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Rebill getPaymentLink error: ${JSON.stringify(err)}`);
  }

  return res.json();
}
