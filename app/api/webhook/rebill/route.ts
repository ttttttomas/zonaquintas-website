// app/api/webhooks/rebill/route.ts
import { NextRequest, NextResponse } from 'next/server';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "http://localhost:8000";

function getNextMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Rebill webhook recibido:", JSON.stringify(body, null, 2));

  const event = body.webhook?.event;
  const payment = body.data?.payment;
  const planId = body.data?.planId

  // ── Membresía fallida (cobro rechazado) ──────────────────────────────────
  if (event === 'payment.created' && payment?.status === 'rejected' && planId) {
    const user_id = payment?.metadata?.user_id;
    if (user_id) {
      await fetch(`${API_URL}/users/${user_id}/membership`, {
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
  if (event !== 'payment.created' || payment?.status !== 'approved') {
    console.log("Evento ignorado:", event, payment?.status);
    return NextResponse.json({ received: true });
  }

  const { payment_id, booking_id, payment_type, user_id } = payment.metadata;

  if (planId && user_id) {
    await fetch(`${API_URL}/users/${user_id}/membership`, {
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
      const depositPaymentResult = await fetch(`${API_URL}/booking-payments/${payment_id}`, {
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
      const balancePaymentResult = await fetch(`${API_URL}/booking-payments/${payment_id}`, {
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
