import { PaymentLink, PriceInput } from "@/types";

export async function createPaymentLinkRebill(data: {
  prices: PriceInput;
  reservaId: string;
  paymentId: string;
  paymentType: string;
  ownerId: string;
}): Promise<PaymentLink> {
  const response = await fetch("/api/rebill/payment-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo crear el link de pago");
  }

  return result;
}
