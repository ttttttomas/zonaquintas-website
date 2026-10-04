/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Quintas } from "@/types";
import Amb from "../icons/Amb";
import Bedroom from "../icons/Bedroom";
import { CardArc5 } from "@/components/ui/card-arc-5";
import User from "../icons/User";

export default function QuintaCard({ product }: { product: Quintas }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const images = [...new Set([product.main_image, ...(product.images ?? [])]
    .filter((image): image is string => typeof image === "string" && image.trim().length > 0))]
    .slice(0, 5);
  const mainImage = images[0] ?? "/quinta.jpg";
  // Amicro's middle slot (2) is the front card; keep the main photo there.
  const photos = [images[1], images[2], mainImage, images[3], images[4]]
    .map((image) => image ?? mainImage);

  const formatedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: product.currency_price,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <Link
      href={`/quintas/${product.id}`}
      className={`relative block w-[15rem] mb-10 h-[15rem] ${hovered || focused ? "z-50" : "z-0"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center" role="img" aria-label={`Fotos de ${product.title}`}>
        {images.length > 1 ? (
          <MotionConfig reducedMotion="user">
            <CardArc5 images={photos} hovered={!reduceMotion && (hovered || focused)}>
              {hovered && (
                <div className="w-full h-full backdrop-blur-lg px-4 flex items-center justify-center flex-col gap-6">
                  <div className="flex gap-1">
                    <p className="text-sm text-white text-center">{product.title}</p>
                  </div>
                  <div className="flex">
                    <p className="text-white/70 text-xs truncate max-w-[220px] overflow-hidden text-ellipsis">
                      {product.description}
                    </p>
                  </div>
                  <ul className="flex text-xs justify-between w-full">
                    <li className="text-white/70 gap-1 flex">
                      <Amb color="white" w={18} h={18} />
                      <p className="self-center">{product.bedrooms}</p>
                    </li>
                    <li className="text-white/70 gap-1 flex">
                      <Bedroom color="white" w={22} h={22} />
                      <p className="self-center">{product.bathrooms}</p>
                    </li>
                    <li className="text-white/70 gap-1 flex">
                      <User />
                      <p className="self-center">{product.guests}</p>
                    </li>
                  </ul>
                  <div className="flex justify-between items-center gap-1">
                    {product.currency_price === "ARS" && <p className="font-bold text-white text-lg">ARS</p>}
                    <p className="font-bold text-lg text-white text-center">{formatedPrice}</p>
                  </div>
                </div>
              )}
            </CardArc5>
          </MotionConfig>
        ) : (
          <img className="object-cover h-full w-full rounded-xl" src={mainImage} alt="" />
        )}
      </div>
    </Link>
  );
}
