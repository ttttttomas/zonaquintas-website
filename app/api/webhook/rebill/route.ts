//  Para que Rebill notifique a tu Next local, configurá en el panel de Rebill una URL pública que apunte a tu máquina,
//   por ejemplo un túnel de ngrok hacia http://localhost:3000/api/webhook/rebill. Después, en el entorno local, configurá
//   BACKEND_API_URL con la URL de FastAPI que usa tu app. El webhook actual todavía no está publicado, así que tampoco
//   verá esta corrección hasta que se despliegue.

//   whsec_a9a67296cb47ad1b63711857d02af3fbb6d4fc3750a01e25d780bfdabcf7601a

import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function backendFetch(path: string, init: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Backend ${init.method ?? "GET"} ${path} respondió ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  return response;
}

function getNextMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body.webhook?.event;
  const payment = body.data?.payment ?? body.data;
  const planId = body.data?.planId

  console.log("Rebill webhook recibido", {
    event,
    logId: body.webhook?.logId,
    paymentId: payment?.id,
    status: payment?.status,
    bookingId: payment?.metadata?.booking_id,
  });

  // ── Membresía fallida (cobro rechazado) ──────────────────────────────────
  if (event === 'payment.created' && payment?.status === 'rejected' && planId) {
    const user_id = payment?.metadata?.user_id;
    if (user_id) {
      await backendFetch(`/users/${user_id}/membership`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membership_status: 'failed' }),
      });
      console.log(`❌ Membresía fallida - user: ${user_id}`);
    }
    return NextResponse.json({ received: true });
  }

  // ── Ignorar eventos que no son payment.created approved ──────────────────
  if (!['payment.created', 'payment.updated'].includes(event) || payment?.status !== 'approved') {
    console.log("Evento ignorado:", event, payment?.status);
    return NextResponse.json({ received: true });
  }

  const { payment_id, booking_id, payment_type, user_id } = payment.metadata ?? {};

  if (planId && user_id) {
    await backendFetch(`/users/${user_id}/membership`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        membership_status: 'active',
        rebill_subscription_id: body.data?.subscriptionId ?? null,
        rebill_customer_id: body.data?.customerId ?? body.data?.customer?.id ?? null,
        membership_expires_at: getNextMonth(),
      }),
    });

    console.log(`✅ Membresía activada - user: ${user_id}`);
    return NextResponse.json({ received: true });
  }

  if (!payment_id || !booking_id || !payment_type) {
    console.error("Faltan datos en metadata:", payment.metadata);
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  try {
    if (payment_type === 'deposit') {
      // --- PAGO DE SEÑA ---

      // 1. Actualizar booking_payment a paid
      const depositPaymentResult = await backendFetch(`/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });
      if (!depositPaymentResult.ok) throw new Error(`No se pudo confirmar la seña: ${depositPaymentResult.status}`);

      // 2. Actualizar booking a deposit_paid
      const depositBookingResult = await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });
      if (depositBookingResult.status === 409) {
        console.error("Pago de seña recibido para reserva sin disponibilidad; requiere conciliación", booking_id);
        return NextResponse.json({ received: true, reconciliation_required: true });
      }
      if (!depositBookingResult.ok) throw new Error(`No se pudo actualizar la reserva: ${depositBookingResult.status}`);

      // 3. Mail confirmación seña
      await fetch(`${API_URL}/api/emails/deposit-confirmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id })
      });

      console.log(`✅ Seña procesada - booking: ${booking_id}`);

    } else if (payment_type === 'balance') {
      // --- PAGO DE SALDO ---

      // 1. Actualizar booking_payment a paid
      const balancePaymentResult = await backendFetch(`/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'finished',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });
      if (!balancePaymentResult.ok) throw new Error(`No se pudo confirmar el saldo: ${balancePaymentResult.status}`);

      // 2. Actualizar booking a confirmed (pago completo)
      const balanceBookingResult = await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finished' })
      });
      if (balanceBookingResult.status === 409) {
        console.error("Pago de saldo recibido para reserva sin disponibilidad; requiere conciliación", booking_id);
        return NextResponse.json({ received: true, reconciliation_required: true });
      }
      if (!balanceBookingResult.ok) throw new Error(`No se pudo actualizar la reserva: ${balanceBookingResult.status}`);

      // 3. Mail confirmación final
      await fetch(`${API_URL}/api/emails/balance-confirmed`, {
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
