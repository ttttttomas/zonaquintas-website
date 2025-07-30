/* eslint-disable @next/next/no-img-element */

'use client'

import Heart from "../icons/Heart";
import HeartGreen from "../icons/HeartGreen";
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
        <div className="bg-white w-full flex flex-col rounded-b-xl">
        <p className="text-lg text-center">Ezeiza, Buenos Aires</p>
        <small className="text-black/50 text-center">Galvez 657, Los Rosales</small>
        <ul className="flex text-sm justify-between px-5">
            <li className="text-black/50">IN 14/3 </li>
            <li className="text-black/50"> OUT 17/3</li>
        </ul>
        <p className="font-bold my-2 text-center">$760.000.-</p>
        </div>
    </Link>
  )
}
