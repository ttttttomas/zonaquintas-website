'use client'
import { Separator } from '@/app/components/ui/Separator'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/app/context/UserContext'
import { ProductsServices } from '@/app/services/ProductsServices'
import { Quintas } from '@/types'
import { ChevronRight, Settings, Plus } from 'lucide-react'

export default function PublicationsPage() {
  const { user } = useUser() || {};
  const [quintas, setQuintas] = useState<Quintas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const quintasByOwnerId = async () => {
      try {
        const res = await ProductsServices.getQuintas()
        const quintaFilters = res?.filter((quinta: any) => quinta?.owner_id === user?.id);
        setQuintas(quintaFilters || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (user?.id) quintasByOwnerId()
  }, [user])

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="/logo.png" width={80} height={80} alt="Cargando..." />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-4 md:mx-10 py-10 min-h-[70vh]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis publicaciones</h1>
          <p className="text-gray-500">Gestioná tus propiedades y consultá su estado.</p>
        </div>
        <Link
          href="/publicar-quinta/paso-1"
          className="flex items-center gap-2 bg-primaryDark text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
        >
          <Plus size={20} />
          Publicar nueva
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Columna Principal: Grilla de Publicaciones */}
        <section className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {quintas.length > 0 ? (
            quintas.map((quinta: Quintas) => (
              <div key={quinta.id} className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden flex flex-col hover:border-primaryDark/30 transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={quinta.main_image}
                    alt={quinta.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    {quinta.status === 'active' && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Activo</span>
                    )}
                    {quinta.status === 'pending' && (
                      <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">En revisión</span>
                    )}
                    {quinta.status === 'cancelled' && (
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Cancelada</span>
                    )}
                    {quinta.status === 'rejected' && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Rechazada</span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{quinta.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {quinta.address}
                    </p>
                  </div>

                  <Separator color="bg-gray-100" />

                  <div className="my-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">Precio por día</span>
                      <span className="font-bold text-primaryDark">
                        {quinta.currency_price} ${quinta.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                    {quinta.status === 'rejected' && (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                        <p className="text-xs font-bold text-red-800 uppercase">Motivo de rechazo:</p>
                        <p className="text-xs text-red-600">No se especificó un motivo.</p>
                      </div>
                    )}
                  </div>

                  {quinta.status === 'rejected' ? (
                    <Link
                      href={`/support#form`}
                      className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all text-sm"
                    >
                      Contactarse con ZonaQuintas
                    </Link>
                  ) : (
                    <Link
                      href={`/quintas/${quinta.id}`}
                      className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all text-sm"
                    >
                      Ver detalle
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">Aún no tienes publicaciones.</p>
              <Link href="/publicar-quinta/paso-1" className="text-primaryDark font-bold underline mt-2 inline-block">Comenzar ahora</Link>
            </div>
          )}
        </section>

        {/* Sidebar Lateral */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl p-6">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={18} className="text-primaryDark" />
                Configuración
              </h4>
              <Link
                href="/my-account"
                className="group flex flex-col bg-gray-50 hover:bg-primaryDark transition-all rounded-2xl p-5 border border-transparent hover:border-primaryDark shadow-sm"
              >
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 group-hover:text-white/60 mb-1">Tu Perfil</span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 group-hover:text-white text-lg transition-colors">Mis datos</span>
                  <ChevronRight size={20} className="text-primaryDark group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>

            <div className="bg-primaryDark/5 border border-primaryDark/10 rounded-3xl p-6">
              <p className="text-sm text-primaryDark font-medium">¿Necesitas ayuda con tus publicaciones?</p>
              <Link href="/support" className="text-xs font-bold text-primaryDark underline mt-1 inline-block">Contactar a soporte</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
