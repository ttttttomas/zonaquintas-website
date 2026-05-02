"use client";
import Heart from "./icons/Heart";
import HeartGreen from "./icons/HeartGreen";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Separator } from "./ui/Separator";
import Amb from "./icons/Amb";
import Bed from "./icons/Bedroom";
import Bath from "./icons/Bathroom";

export default function QuintaSearchCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: product.currency_price,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const costOfService = () => {
    const res = product.price * 0.05;
    const formated = res.toLocaleString("es-AR", {
      style: "currency",
      currency: product.currency_price,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formated;
  };
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };
  return (
    <div className="flex flex-col md:flex-row rounded-2xl p-3 shadow-md bg-white overflow-hidden w-full">
      {/* Imágenes */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={product.main_image}
            alt={product.title}
            className="w-60 h-full p-2 object-cover rounded-l-2xl"
          />
          <div
            onClick={handleClick}
            className="absolute cursor-pointer hover:scale-110 transition-all top-3 left-3 rounded-full p-1"
          >
            {isFavorite ? <HeartGreen /> : <Heart />}
          </div>
        </div>

        <div className="md:flex grid grid-cols-2 gap-2 md:gap-0 grid-rows-2 place-items-center flex-col justify-between pl-1 py-2">
          {product.images.slice(0, 4).map((_, i) => (
            <img
              key={i}
              src={product.images[i]}
              alt={`mini-${i}`}
              className="size-16 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h2 className="text-lg text-center md:text-start font-semibold">
            {product.title}
          </h2>
          <p className="text-sm text-center md:text-start text-black">
            {product.address}
          </p>

          {/* Opiniones */}
          <div className="flex justify-center md:justify-start items-center text-sm my-2 gap-1">
            <span>4,5</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-500 stroke-yellow-500"
                />
              ))}
            </div>
            <span className="text-gray-400">| 72 opiniones</span>
          </div>
          <ul className="flex md:grid grid-cols-2 place-items-center py-2 flex-row md:flex-col gap-2 text-sm justify-between">
            <li className="flex items-center gap-2">
              <Bath />
              {product.bathrooms}
            </li>
            <li className="flex items-center gap-2">
              <Amb />
              {product.ambients}
            </li>
            <li className="flex items-center gap-2">
              <Bed />
              {product.bedrooms}
            </li>
            <li className="flex items-center gap-2">
              <p>Ciudad:</p>
              {product.city}
            </li>
          </ul>
        </div>
        <Separator color="bg-gray-400" />
        {/* Precio */}
        <div className="mt-4 flex items-center justify-between md:gap-10">
          <div className="flex flex-col items-start justify-center">
            <p className="text-green-600 text-3xl font-semibold">
              {formatedPrice}
            </p>
            <p className="text-xs text-gray-500">
              {costOfService()} costo por servicio
            </p>
          </div>
          <Link
            href={`/quintas/${product.id}`}
            className="bg-primaryDark text-white text-sm px-8 py-1.5 rounded-md hover:bg-green-700"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}
