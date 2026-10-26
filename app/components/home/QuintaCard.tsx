/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Quintas } from "@/types";
import Amb from "../icons/Amb";
import Bedroom from "../icons/Bedroom";
import { CardArc5 } from "@/components/ui/card-arc-5";
import { Heart, MapPin, Users } from "lucide-react";
import { GuestServices } from "@/app/services/GuestServices";
import { useUser } from "@/app/context/UserContext";
import toast from "react-hot-toast";

export default function QuintaCard({ product }: { product: Quintas }) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const images = [
    ...new Set(
      [product.main_image, ...(product.images ?? [])].filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      ),
    ),
  ].slice(0, 5);
  const mainImage = images[0] ?? "/quinta.jpg";
  // Amicro's middle slot (2) is the front card; keep the main photo there.
  const photos = [images[1], images[2], mainImage, images[3], images[4]].map(
    (image) => image ?? mainImage,
  );

  const formatedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: product.currency_price,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    if (userLoading) return;
    if (!user?.id) {
      setIsFavorite(false);
      setFavoriteLoading(false);
      return;
    }

    let active = true;
    setFavoriteLoading(true);
    GuestServices.favorites(user.id)
      .then((favorites) => {
        if (active) {
          setIsFavorite(favorites.some((favorite) => favorite.id === product.id || favorite.quinta_id === product.id));
        }
      })
      .catch(() => {
        if (active) setIsFavorite(false);
      })
      .finally(() => {
        if (active) setFavoriteLoading(false);
      });

    return () => {
      active = false;
    };
  }, [product.id, user?.id, userLoading]);

  const handleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userLoading || favoriteLoading) return;
    if (!user?.id) {
      router.push(`/login?next=${encodeURIComponent(`/quintas/${product.id}`)}`);
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await GuestServices.removeFavorite(user.id, product.id);
        setIsFavorite(false);
        toast.success("Quitaste la quinta de tus favoritos");
      } else {
        await GuestServices.favorite(user.id, product.id);
        setIsFavorite(true);
        toast.success("Quinta guardada en favoritos");
      }
    } catch {
      toast.error("No pudimos actualizar tus favoritos. Intentá de nuevo.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div
      className={`relative block w-[min(15rem,calc(100vw-3rem))] h-[420px] mb-10 ${
        hovered || focused ? "z-50" : "z-0"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      <div
        className="relative w-full flex items-center justify-center"
        role="img"
        aria-label={`Fotos de ${product.title}`}
      >
        {images.length > 1 ? (
          <MotionConfig reducedMotion="user">
            <CardArc5
              images={photos}
              cardHeight={420}
              hovered={!reduceMotion && (hovered || focused)}
            >
              {(hovered || focused) && (
                <div className="pointer-events-none absolute inset-0  overflow-hidden rounded-2xl border-2 border-white text-white">
                  <div
                    className="absolute inset-x-0 bottom-0 h-[60%] backdrop-blur-[20px]"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(10, 16, 28, 0) 0%, rgba(10, 16, 28, 0.08) 18%, rgba(10, 16, 28, 0.3) 42%, rgba(10, 16, 28, 0.76) 72%, rgba(10, 16, 28, 0.96) 100%)",
                      maskImage: "linear-gradient(to bottom, transparent 0%, black 22%)",
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 z-10 flex h-[58%] flex-col justify-end gap-0.5 px-4 pb-3">
                    <div className="w-fit max-w-full rounded-full border border-green-300/50 bg-green-800/60 px-3 py-1 shadow-sm backdrop-blur-md">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-white">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{product.city}</span>
                      </span>
                    </div>

                    <h3 className="line-clamp-1 text-sm font-bold leading-tight drop-shadow-md">
                      {product.title}
                    </h3>

                    <p className="line-clamp-2 text-[9px] leading-tight text-white/80">
                      {product.description}
                    </p>

                    <div className="mt-0.5 flex items-center justify-between border-b border-white/30 pb-1">
                      <div className="flex flex-1 flex-col items-center gap-0">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" aria-hidden="true" />
                          <span className="text-[11px] font-bold">{product.guests}</span>
                        </span>
                        <span className="text-[8px] text-white/75">Huéspedes</span>
                      </div>

                      <div className="h-8 w-px bg-white/35" />

                      <div className="flex flex-1 flex-col items-center gap-0">
                        <span className="flex items-center gap-1">
                          <Bedroom color="white" w={16} h={16} />
                          <span className="text-[11px] font-bold">{product.bedrooms}</span>
                        </span>
                        <span className="text-[8px] text-white/75">Habitaciones</span>
                      </div>

                      <div className="h-8 w-px bg-white/35" />

                      <div className="flex flex-1 flex-col items-center gap-0">
                        <span className="flex items-center gap-1">
                          <Amb color="white" w={16} h={16} />
                          <span className="text-[11px] font-bold">{product.bathrooms}</span>
                        </span>
                        <span className="text-[8px] text-white/75">Baños</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 pt-0.5">
                      <span className="text-base font-bold tracking-tight">{formatedPrice}</span>
                      <span className="text-[10px] text-white/75">/ noche</span>
                    </div>

                    <div className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-xl border border-green-300/60 bg-green-600/90 py-1.5 text-xs font-semibold text-white shadow-[0_4px_18px_rgba(34,197,94,0.35)]">
                      Ver más detalles
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              )}
            </CardArc5>
          </MotionConfig>
        ) : (
          <img
            className="h-full object- w-full rounded-xl"
            src={mainImage}
            alt=""
          />
        )}
      </div>
      <Link
        href={`/quintas/${product.id}`}
        aria-label={`Ver detalles de ${product.title}`}
        className="absolute -inset-x-2 -top-8 bottom-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark"
        onFocus={() => setFocused(true)}
      />

      {images.length > 1 && (hovered || focused) && (
        <button
          type="button"
          onClick={handleFavorite}
          disabled={userLoading || favoriteLoading}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={`absolute right-3 cursor-pointer z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 ${reduceMotion ? "top-4" : "-top-2"}`}
        >
          <Heart className={`h-6 w-6 ${isFavorite ? "fill-current text-rose-500" : ""}`} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
