"use client";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import {
  Star,
  Calendar,
  CreditCard,
  ShieldCheck,
  Zap,
  Infinity,
  Headphones,
  AlertTriangle,
  ArrowLeft,
  XCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MyMembershipPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tu membresía</h1>
        <Link href="/login" className="bg-primaryDark text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const isActive = user.membership_status === "active";

  async function handleCancelar() {
    setLoading(true);
    try {
      const res = await fetch("/api/memberships/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          subscriptionId: user?.rebill_subscription_id,
        }),
      });

      if (res.ok) {
        toast.success("Suscripción cancelada correctamente");
        window.location.reload();
      } else {
        const error = await res.json();
        toast.error(error.message || "Error al cancelar la suscripción");
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
      setShowCancelConfirm(false);
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primaryDark transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Mi Membresía</h1>
            <p className="text-gray-500">Gestioná los detalles de tu suscripción y beneficios.</p>
          </div>

          {isActive ? (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold border border-green-200">
              <ShieldCheck size={20} />
              <span>ESTADO: ACTIVA</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold border border-yellow-200 text-sm">
              <AlertTriangle size={18} />
              <span>ESTADO: {user.membership_status?.toUpperCase() || "INACTIVA"}</span>
            </div>
          )}
        </div>

        {isActive ? (
          <div className="grid gap-8">
            {/* Main Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                <Star size={180} fill="currentColor" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primaryDark p-2 rounded-xl">
                    <Star size={24} className="fill-white" />
                  </div>
                  <h2 className="text-2xl font-bold italic tracking-wider">PREMIUM PLAN</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Próximo Cobro</p>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-primaryDark" size={24} />
                        <span className="text-xl font-semibold">{formatDate(user.membership_expires_at)}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Monto Mensual</p>
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-primaryDark" size={24} />
                        <span className="text-xl font-semibold">$20.000 ARS</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-primaryDark" />
                      Tus Beneficios Activos:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm">
                        <Infinity size={16} className="text-primaryDark" />
                        <span>Publicaciones ilimitadas de quintas</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <ShieldCheck size={16} className="text-primaryDark" />
                        <span>0% de comisión por reserva</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <Star size={16} className="text-primaryDark" />
                        <span>Posicionamiento prioritario en búsquedas</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <Headphones size={16} className="text-primaryDark" />
                        <span>Soporte preferencial vía WhatsApp</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Area */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">¿Necesitás ayuda con tu plan?</h3>
                <p className="text-gray-500 text-sm">Podés cambiar tu método de pago o consultar dudas en nuestro centro de soporte.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Link href="/support" className="flex-1 md:flex-none text-center px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Soporte
                </Link>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex-1 cursor-pointer md:flex-none px-6 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancelar Suscripción
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No tenés una membresía activa</h2>
              <p className="text-gray-600 mb-8">
                Unite al Plan Premium para disfrutar de publicaciones ilimitadas, cero comisiones y soporte 24/7.
              </p>
              <Link href="/membership" className="inline-flex items-center justify-center bg-primaryDark text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primaryDark/30 transition-all">
                Ver Planes Disponibles
              </Link>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black mb-4">¿Estás seguro?</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Si cancelás tu membresía, perderás el posicionamiento prioritario y volverás a pagar comisiones por reserva a partir del próximo ciclo de facturación.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  disabled={loading}
                  onClick={handleCancelar}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Sí, cancelar mi plan"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="w-full py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  No, mantener beneficios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
