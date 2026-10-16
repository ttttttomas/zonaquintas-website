"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { GuestServices, type GuestOverview } from "@/app/services/GuestServices";

const button = "inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark disabled:opacity-60";
const money = (amount: number, currency: string) => new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount || 0));

function FavoritesSkeleton() {
  return <main aria-busy="true" aria-label="Cargando tus favoritos" className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-10"><div className="h-12 w-56 animate-pulse rounded-xl bg-gray-200" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map(item => <div key={item} className="h-80 animate-pulse rounded-xl bg-gray-200" />)}</div></main>;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [data, setData] = useState<GuestOverview | null>(null);
  const [loadedUser, setLoadedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { router.replace("/login"); return; }
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    GuestServices.overview(controller.signal)
      .then(result => {
        if (!controller.signal.aborted) { setData(result); setLoadedUser(user.id); }
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, user?.id, router, revision]);

  if (authLoading || !user || loading) return <FavoritesSkeleton />;
  if (error || !data || loadedUser !== user.id) {
    return <main className="mx-auto max-w-7xl px-4 py-8 md:px-10"><div role="alert" className="rounded-2xl border border-gray-200 p-6"><p>No pudimos cargar tus favoritos.</p><button type="button" className={`${button} mt-4`} onClick={() => setRevision(value => value + 1)}>Reintentar</button></div></main>;
  }

  const removeFavorite = async (quintaId: string) => {
    setRemoving(quintaId);
    setActionError("");
    try {
      await GuestServices.removeFavorite(user.id, quintaId);
      setData(current => current ? { ...current, favorites: current.favorites.filter(item => item.id !== quintaId) } : current);
    } catch {
      setActionError("No pudimos quitar esta quinta de tus favoritos. Intentá de nuevo.");
    } finally {
      setRemoving(null);
    }
  };

  return <main className="mx-auto max-w-7xl px-4 py-8 text-gray-900 md:px-10">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold">Mis favoritos</h1><p className="mt-2 text-sm text-gray-500">Quintas que guardaste para volver a encontrar.</p></div>
        <span className="text-sm text-gray-500">{data.favorites.length} {data.favorites.length === 1 ? "quinta" : "quintas"}</span>
      </header>
      {actionError && <p role="alert" className="mb-4 text-sm text-red-700">{actionError}</p>}
      {data.favorites.length ? <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {data.favorites.map(favorite => <article key={favorite.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <Link href={`/quintas/${favorite.id}`} className="block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark">
            <img src={favorite.main_image || "/quinta.jpg"} alt={favorite.title} className="aspect-[4/3] w-full object-cover" />
            <div className="p-5"><h2 className="font-semibold">{favorite.title}</h2><p className="mt-1 text-sm text-gray-500">{favorite.city}</p><p className="mt-3 text-sm">{money(favorite.price, favorite.currency_price)} <span className="text-gray-500">/ noche</span></p></div>
          </Link>
          <div className="px-5 pb-5"><button type="button" className={button} disabled={removing !== null} onClick={() => removeFavorite(favorite.id)}>{removing === favorite.id ? "Quitando…" : "Quitar de favoritos"}</button></div>
        </article>)}
      </div> : <section className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
        <h2 className="text-lg font-semibold">Todavía no guardaste quintas</h2><p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Cuando encuentres una que te guste, tocá “Agregar a favoritos” en su página y aparecerá acá.</p><Link href="/quintas" className={`${button} mt-5`}>Explorar quintas</Link>
      </section>}
  </main>;
}
