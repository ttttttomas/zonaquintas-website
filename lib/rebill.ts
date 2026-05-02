import { PriceInput } from "@/types";

const REBILL_API_URL = "https://api.rebill.com/v3";
// const REBILL_API_KEY = process.env.REBILL_API_KEY!;
const REBILL_API_KEY = "sk_2ca4dc4cdece4f178010dcf0f7b6d0fe";

const headers = {
  "x-api-key": REBILL_API_KEY,
  "Content-Type": "application/json",
};

// Crea o recupera un cliente en Rebill
export async function crearClienteRebill(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const res = await fetch(`${REBILL_API_URL}/customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? "",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Rebill crearCliente error: ${JSON.stringify(err)}`);
  }

  return res.json();
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
        approved: `{https://www.zonaquintas.com/pay_ticket_rebill_success?id=${data.ownerId}}`,
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
