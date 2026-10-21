import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!);
}

export async function POST(request: NextRequest) {
  let input: { name?: unknown; email?: unknown } & Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ detail: "El cuerpo del registro no es JSON válido." }, { status: 400 });
  }

  let backendResponse: Response;
  try {
    const base = `${API_URL.replace(/\/+$/, "")}/`;
    backendResponse = await fetch(new URL("register", base), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "No se pudo conectar con el servidor de registro." }, { status: 502 });
  }

  const body = await backendResponse.text();
  if (backendResponse.ok && !process.env.RESEND_API_KEY) {
    console.error("No se envió la notificación de registro: falta configurar RESEND_API_KEY.");
  }
  if (backendResponse.ok && process.env.RESEND_API_KEY) {
    const name = typeof input.name === "string" && input.name.trim() ? input.name.trim() : "Sin nombre informado";
    const email = typeof input.email === "string" ? input.email.trim() : "Sin correo informado";
    const date = new Intl.DateTimeFormat("es-AR", {
      dateStyle: "full", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date());
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    try {
      const { error } = await resend.emails.send({
        from: "ZonaQuintas <reservas@zonaquintas.com>",
        to: "contacto@zonaquintas.com",
        subject: "Nuevo registro en ZonaQuintas",
        html: `<h1>Se completó un registro en ZonaQuintas</h1><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Correo:</strong> ${safeEmail}</p><p><strong>Fecha:</strong> ${escapeHtml(date)}</p><p>El registro fue aceptado por la API.</p>`,
      });
      if (error) console.error("No se pudo enviar la notificación de registro a Resend.");
    } catch {
      // La entrega de la notificación no debe invalidar una cuenta ya creada.
      console.error("No se pudo enviar la notificación de registro a Resend.");
    }
  }

  return new NextResponse(body, {
    status: backendResponse.status,
    headers: { "Content-Type": backendResponse.headers.get("content-type") || "application/json" },
  });
}
