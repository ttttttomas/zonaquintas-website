'use client'
import EstadiaCard from "@/app/components/EstadiaCard";
import QuintaCard from "@/app/components/home/QuintaCard";
import QuintaSearchCard from "@/app/components/QuintaSearchCard";
import { BookingsServices } from "@/app/services/BookingsServices";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Booking, Quintas } from "@/types";
import { useEffect, useState } from "react";

interface Props {
    bookings: Booking[]
}

export default function MisEstadiasPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [favorites, setFavorites] = useState<Quintas[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        setError(null)

        ProductsServices.getQuintas()
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    setFavorites(response || [])
                }
            })
        BookingsServices.getBookingById('c68018a5-b449-4153-8cdf-036f981f4b5b')
            .then(response => {
                if (response.error) {
                    setError(response.error)
                } else {
                    setBookings(response.bookings || [])
                }
            })
            .catch(err => {
                console.error("Error obteniendo estadias:", err)
                setError("Error al cargar las estadias")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])



    return (
        <main className="flex justify-around items-start gap-4 mb-10 mx-20">
            <section className="flex flex-col justify-center items-center">
                <h3 className="text-2xl mb-10 font-semibold">Estadias</h3>
                <div className="flex flex-col gap-4">
                    <EstadiaCard />
                    <EstadiaCard />
                    <EstadiaCard />
                </div>
            </section>
            <section className="flex flex-col items-center justify-center">
                <h3 className="text-2xl mb-10 font-semibold">Favoritos</h3>
                <div className="flex flex-col gap-4">
                    {favorites.map(favorite => (
                        <>
                            <QuintaCard key={favorite.id} product={favorite} />
                            <QuintaCard key={favorite.id} product={favorite} />
                        </>
                    ))}
                </div>
            </section>

        </main>
    )
}
