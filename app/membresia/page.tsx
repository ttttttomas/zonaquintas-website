"use client";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { createSubscriptionLinkRebill } from "@/lib/rebill";
import toast from "react-hot-toast";

import {
  CheckCircle,
  Star,
  ShieldCheck,
  Infinity,
  Zap,
  Headphones,
  Calendar,
  Gift,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Arrow from "../components/Arrow";

export default function MembershipPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleSuscripcionPremium() {
    setLoading(true);
    try {
      const res = await fetch("/api/memberships/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          firstName: user?.name.split(" ")[0],
          lastName: user?.name.split(" ")[1] ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      // Redirigir al checkout de Rebill
      window.location.href = data.url;

    } catch {
      toast.error("Error al procesar la suscripción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-20 px-4 md:px-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Impulsá tu Quinta con <span className="text-primaryDark">ZonaQuintas</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Unite a la comunidad más grande de alquileres temporarios y maximizá tus ingresos con nuestras herramientas exclusivas para propietarios.
        </p>
      </section>

      {/* Promotion Banner */}
      <section className="bg-primaryDark/10 border-2  border-primaryDark rounded-3xl p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Gift size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-primaryDark text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              <Calendar size={16} />
              PROMOCIÓN LIMITADA
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Lanzamiento Especial para Propietarios!</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Desde el <span className="font-bold">20/08 hasta el 20/09</span>, los primeros 15 Propietarios Básicos recibirán la publicación de sus quintas <span className="font-bold text-primaryDark">SIN PAGO DE COMISIONES por 6 meses</span>. ¡Una oportunidad única para conocer la página!
            </p>
            <Link href='#planes' className="flex items-center hover:translate-x-4 transition-all gap-2 text-primaryDark font-semibold">
              <span>Aprovechá esta oportunidad hoy mismo</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-primaryDark/20 text-center min-w-[200px]">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Cupos Restantes</p>
            <p className="text-5xl font-black text-primaryDark">15/15</p>
          </div>
        </div>
      </section>
      <div className="flex items-center scale-150 animate-bounce justify-center mb-20 mt-50">
        <Arrow handleClick={() => window.location.href = '#planes'} />
      </div>
      {/* Tiers Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Nuestros Planes
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Elegí el plan que mejor se adapta a tus necesidades y comenzá a publicar tus quintas en ZonaQuintas.
        </p>
      </section>
      <section className="flex justify-around gap-8 mb-20">
        {/* Tier Gratis */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gratis</h3>
            <p className="text-gray-500">Ideal para empezar</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-500">/mes</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-primaryDark mt-1 shrink-0" size={18} />
              <span>Publicá tu <span className="font-bold">Primera Quinta</span> totalmente gratis</span>
            </li>
            <li className="flex items-start text-black gap-3 opacity-50">
              <CheckCircle className="text-primaryDark mt-1 shrink-0" size={18} />
              <span>Comisión por reserva</span>
            </li>
          </ul>
          <Link href='/publicar-quinta' className="w-full py-4 text-center rounded-xl cursor-pointer border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Empezar ahora
          </Link>
        </div>
        {/* Tier Premium */}
        <div id='planes' className="bg-gray-900 rounded-3xl hover:-translate-y-4 p-8 shadow-2xl flex flex-col text-white hover:shadow-primaryDark/20 transition-all duration-300">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">Premium</h3>
              <Star className="text-yellow-400 fill-yellow-400" size={18} />
            </div>
            <p className="text-gray-400">Máxima exposición y beneficios</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold">$30.000</span>
            <span className="text-gray-500">/mes</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-start gap-3">
              <Infinity className="text-primaryDark mt-1 shrink-0" size={18} />
              <span className="font-bold underline">SIN LÍMITE de Propiedades</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="text-primaryDark mt-1 shrink-0" size={18} />
              <span className="ftont-bold underline">SIN COMISIONES</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="text-primaryDark mt-1 shrink-0" size={18} />
              <span className="text-gray-300">Mejor posicionamiento en la web</span>
            </li>
            <li className="flex items-start gap-3">
              <Headphones className="text-primaryDark mt-1 shrink-0" size={18} />
              <span className="text-gray-300">Soporte personalizado 24/7</span>
            </li>
          </ul>
          <button
            disabled={loading}
            onClick={handleSuscripcionPremium}
            className="w-full py-4 rounded-xl cursor-pointer bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Pasar a Premium"}
          </button>
        </div>
      </section>

      {/* More Info */}
      <section className="text-center max-w-2xl mx-auto">
        <h4 className="text-2xl font-bold mb-4">¿Tenés dudas?</h4>
        <p className="text-gray-600 mb-8">
          Nuestro equipo está listo para ayudarte a elegir la mejor opción para tu negocio.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/support" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-primaryDark transition-colors">
            Contactar Soporte
          </a>
          <a href="/faq" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-primaryDark transition-colors">
            Preguntas Frecuentes
          </a>
        </div>
      </section>
    </main>
  );
}
