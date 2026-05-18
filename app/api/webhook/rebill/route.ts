import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const WEBHOOK_SECRET = process.env.REBILL_WEBHOOK_SECRET;

// ── Idempotency store (en memoria, válido mientras el proceso viva) ──────────
// En producción con múltiples instancias, migrar a Redis/DB.
const processedPayments = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000; // 5 minutos

function isAlreadyProcessed(paymentId: string): boolean {
  const ts = processedPayments.get(paymentId);
  if (!ts) return false;
  if (Date.now() - ts > IDEMPOTENCY_TTL_MS) {
    processedPayments.delete(paymentId);
    return false;
  }
  return true;
}

function markProcessed(paymentId: string): void {
  processedPayments.set(paymentId, Date.now());
}

// ── Verificación de firma HMAC ──────────────────────────────────────────────
function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) {
    // Si no hay secret configurado, loguear advertencia pero aceptar
    // (útil para desarrollo local donde Rebill no puede alcanzarnos)
    console.warn("⚠️  REBILL_WEBHOOK_SECRET no configurado — saltando verificación de firma");
    return true;
  }

  try {
    const expected = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody, 'utf8')
      .digest('hex');

    // Comparación en tiempo constante para evitar timing attacks
    const received = signatureHeader.startsWith('sha256=')
      ? signatureHeader.slice(7)
      : signatureHeader;

    if (received.length !== expected.length) return false;

    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch (err) {
    console.error("Error verificando firma HMAC:", err);
    return false;
  }
}

function getNextMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  // Leer body como texto crudo para verificación HMAC
  const rawBody = await req.text();

  // ── Verificar firma ──────────────────────────────────────────────────────
  const signature = req.headers.get("x-rebill-signature");
  if (!verifySignature(rawBody, signature)) {
    console.error("❌ Firma de webhook inválida");
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Parsear body después de verificar
  const body = JSON.parse(rawBody);
  console.log("Rebill webhook recibido:", JSON.stringify(body, null, 2));

  const event = body.webhook?.event;
  const payment = body.data?.payment;
  const planId = body.data?.planId;

  // ── Membresía fallida (cobro rechazado) ──────────────────────────────────
  if (event === 'payment.created' && payment?.status === 'rejected' && planId) {
    const user_id = payment?.metadata?.user_id;
    if (user_id) {
      await fetch(`${API_URL}/users/${user_id}/membership`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
  const rebillPaymentId = payment.id;

  // ── Idempotency: evitar procesar el mismo pago dos veces ────────────────
  if (rebillPaymentId && isAlreadyProcessed(rebillPaymentId)) {
    console.log(`⏭️  Pago ya procesado (idempotency): ${rebillPaymentId}`);
    return NextResponse.json({ received: true, idempotent: true });
  }

  // ── Membresía aprobada ───────────────────────────────────────────────────
  if (planId && user_id) {
    await fetch(`${API_URL}/users/${user_id}/membership`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        membership_status: 'active',
        rebill_subscription_id: body.data?.subscriptionId ?? null,
        rebill_customer_id: body.data?.customerId ?? body.data?.customer?.id ?? null,
        membership_expires_at: getNextMonth(),
      }),
    });

    console.log(`✅ Membresía activada - user: ${user_id}`);
    if (rebillPaymentId) markProcessed(rebillPaymentId);
    return NextResponse.json({ received: true });
  }

  if (!payment_id || !booking_id || !payment_type) {
    console.error("Faltan datos en metadata:", payment.metadata);
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  try {
    if (payment_type === 'deposit') {
      // --- PAGO DE SEÑA ---

      await fetch(`${API_URL}/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });

      await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });

      await fetch(`${API_URL}/api/emails/deposit-confirmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id })
      });

      console.log(`✅ Seña procesada - booking: ${booking_id}`);

    } else if (payment_type === 'balance') {
      // --- PAGO DE SALDO ---

      await fetch(`${API_URL}/booking-payments/${payment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'finished',
          rebill_transaction_id: payment.id,
          paid_at: new Date().toISOString(),
        })
      });

      await fetch(`${API_URL}/bookings/${booking_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finished' })
      });

      await fetch(`${API_URL}/api/emails/balance-confirmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id })
      });

      console.log(`✅ Saldo procesado - booking: ${booking_id}`);
    }

    if (rebillPaymentId) markProcessed(rebillPaymentId);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
