/* eslint-disable @next/next/no-img-element */

"use client";

// import Heart from "../icons/Heart";
// import HeartGreen from "../icons/HeartGreen";
// import Location from "../icons/Location";
import { useState } from "react";
import Link from "next/link";
import { Quintas } from "@/types";
import Amb from "../icons/Amb";
import Bedroom from "../icons/Bedroom";

export default function QuintaCard({ product }: { product: Quintas }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const formatedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: product.currency_price,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <Link
      href={`/quintas/${product.id}`}
      className="w-64 relative border hover:scale-110 z-1 transition-all border-black/60 shadow-md shadow-black/25 my-5 text-black flex flex-col items-center rounded-xl">
      <div onClick={handleClick}>
        {/* {isFavorite ? (
          <HeartGreen
            className={
              "absolute top-2 right-2 hover:scale-110 transition-all cursor-pointer"
            }
          />
        ) : (
          <Heart
            className={
              "absolute top-2 right-2 hover:scale-110 transition-all cursor-pointer"
            }
          />
        )} */}
      </div>
      <img
        className="object-cover h-52 w-full rounded-t-xl"
        src={product.main_image}
        alt="foto de la quinta"
      />
      <div className="bg-white w-full py-4 flex items-center justify-center flex-col gap-1 rounded-b-xl">
        <div className="flex gap-1">
          <p className="text-lg text-center">{product.title}</p>
        </div>
        <div className="flex">
          <p className="text-black/50 text-md truncate max-w-[200px] overflow-hidden text-ellipsis">
            {product.description}
          </p>
        </div>
        <ul className="flex text-sm justify-around gap-14 px-5">
          <li className="text-black/50 gap-2 flex">
            <Amb w={24} h={24} />
            <p className="self-center">{product.bedrooms}</p>
          </li>
          <li className="text-black/50 gap-2 flex">
            <Bedroom w={24} h={24} />
            <p className="self-center">{product.bathrooms}</p>
          </li>
        </ul>
        <div className="flex justify-between items-center gap-1">
          {product.currency_price === "ARS" && <p className="font-bold">ARS</p>}
          <p className="font-bold text-lg text-center">{formatedPrice}</p>
        </div>
      </div>
    </Link>
  );
}
