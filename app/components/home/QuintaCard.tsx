/* eslint-disable @next/next/no-img-element */

'use client'

import Heart from "../icons/Heart";
import HeartGreen from "../icons/HeartGreen";
import Ubi from "../icons/Ubi";
import IN from "../icons/IN";
import OUT from "../icons/OUT";
import Location from "../icons/Location";
import { useState } from "react";
import Link from "next/link";


export default function QuintaCard() {
  const [isFavorite, setIsFavorite] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };
  return (
    <Link href="/quintas/1" className="w-64 relative border hover:scale-110 transition-all border-black/60 shadow-md shadow-black/25 my-5 text-black flex flex-col items-center rounded-xl">
        <div onClick={handleClick}>
          {isFavorite ? <HeartGreen className={"absolute top-2 right-2 hover:scale-110 transition-all cursor-pointer"} /> : <Heart className={"absolute top-2 right-2 hover:scale-110 transition-all cursor-pointer"} />}
        </div>
        <img className="object-cover h-52 w-full rounded-t-xl" src="/quinta.jpg" alt="foto de la quinta" />
        <div className="bg-white w-full py-4 flex items-center justify-center flex-col gap-1 rounded-b-xl">
        <div className="flex gap-1">
          <Location />
          <p className="text-lg text-center">Ezeiza, Buenos Aires</p>
        </div>
        <div className="flex">
          <Ubi />
          <p className="text-black/50 text-md text-center">Galvez 657, Los Rosales</p>
        </div>
        <ul className="flex text-sm justify-around gap-14 px-5">
            <li className="text-black/50 flex">
              <IN />
              <p>IN 14/3</p>
            </li>
            <li className="text-black/50 flex">
              <OUT />
              <p>OUT 17/3</p>
            </li>
        </ul>
        <p className="font-bold text-lg text-center">$760.000.-</p>
        </div>
    </Link>
  )
}
