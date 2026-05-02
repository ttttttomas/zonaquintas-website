// app/api/webhooks/rebill/route.ts
import { NextRequest, NextResponse } from 'next/server';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Rebill webhook recibido:", JSON.stringify(body, null, 2));

  const event = body.webhook?.event;
  const payment = body.data?.payment;

  if (event !== 'payment.created' || payment?.status !== 'approved') {
    console.log("Evento ignorado:", event, payment?.status);
    return NextResponse.json({ received: true });
  }

  const { payment_id, booking_id, payment_type } = payment.metadata;

  if (!payment_id || !booking_id || !payment_type) {
    console.error("Faltan datos en metadata:", payment.metadata);
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  try {
    if (payment_type === 'deposit') {
      // --- PAGO DE SEÑA ---

      // 1. Actualizar booking_payment a paid
      await fetch(`${API_URL}/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });

      // 2. Actualizar booking a deposit_paid
      await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });

      // 3. Mail confirmación seña
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/deposit-confirmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id })
      });

      console.log(`✅ Seña procesada - booking: ${booking_id}`);

    } else if (payment_type === 'balance') {
      // --- PAGO DE SALDO ---

      // 1. Actualizar booking_payment a paid
      await fetch(`${API_URL}/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });

      // 2. Actualizar booking a confirmed (pago completo)
      await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finished' })
      });

      // 3. Mail confirmación final
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/balance-confirmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id })
      });

      console.log(`✅ Saldo procesado - booking: ${booking_id}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}