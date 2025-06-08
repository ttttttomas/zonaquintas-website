'use client'
import Heart from "./icons/Heart"
import HeartGreen from "./icons/HeartGreen"
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Separator } from "./ui/Separator";

export default function QuintaSearchCard() {
      const [isFavorite, setIsFavorite] = useState(false);
      const handleClick = () => {
        setIsFavorite(!isFavorite);
        console.log("Is Favorite!");
        
      };
  return (
    <section className="flex rounded-2xl shadow-md bg-white overflow-hidden w-full">
      {/* Imágenes */}
      <div className="flex">
        <div className="relative">
          <img
            src="/quinta.jpg"
            alt="principal"
            className="w-40 h-full p-2 object-cover rounded-l-2xl"
          />
          <div onClick={handleClick} className="absolute top-1 left-12 rounded-full p-1">
           {isFavorite ? <HeartGreen /> : <Heart />}
          </div>
        </div>

        <div className="flex flex-col gap-1 px-2 py-2">
          {[1, 2, 3].map((_, i) => (
            <img
              key={i}
              src={`/quinta.jpg`}
              alt={`mini-${i}`}
              className="w-14 h-14 object-cover rounded"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h2 className="text-lg font-semibold">Ezeiza, Buenos Aires</h2>
          <p className="text-sm text-black">Galvez 657, Los Rosales</p>

          {/* Opiniones */}
          <div className="flex items-center text-sm my-2 gap-1">
            <span>4,5</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
              ))}
            </div>
            <span className="text-gray-400">| 72 opiniones</span>
          </div>
        <Separator color="bg-gray-400" />
          {/* Fechas */}
          <div className="flex items-center justify-between px-5 text-sm my-2 gap-4">
            <span>IN: 11/03/2025</span>
            <span>OUT: 12/03/2025</span>
          </div>
        </div>
        <Separator color="bg-gray-400" />
        {/* Precio */}
        <div className="mt-4 flex items-center justify-around gap-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-green-600 text-3xl font-semibold">U$S 1.000</p>
            <p className="text-xs text-gray-500">U$S 110 costo por servicio</p>
          </div>
          <Link href="/" className="bg-green-600 text-white text-sm px-8 py-1.5 rounded-md hover:bg-green-700">
            Ver más
          </Link>
        </div>
      </div>
    </section>
  )
}
