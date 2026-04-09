const REBILL_API_URL = "https://api.rebill.com/v3";
const REBILL_API_KEY = process.env.REBILL_API_KEY!;

const headers = {
  "Content-Type": "application/json",
  "x-api-key": REBILL_API_KEY,
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
export async function crearPaymentLinkRebill(data: {
  customerId: string;
  monto: number; // en centavos (ej: 85000 ARS = 8500000)
  descripcion: string;
  reservaId: string;
  expiresInHours?: number;
}) {
  const res = await fetch(`${REBILL_API_URL}/payment-links`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customerId: data.customerId,
      currency: "ARS",
      amount: data.monto,
      description: data.descripcion,
      externalId: data.reservaId, // tu ID interno para rastrear en webhook
      expiresAt: new Date(
        Date.now() + (data.expiresInHours ?? 48) * 60 * 60 * 1000,
      ).toISOString(),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Rebill crearPaymentLink error: ${JSON.stringify(err)}`);
  }

  return res.json();
}
