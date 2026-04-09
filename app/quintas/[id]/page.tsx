"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Heart from "@/app/components/icons/Heart";
import {
  Check,
  Star,
  StarHalf,
  MapPin,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Separator } from "@/app/components/ui/Separator";
// import CategorySection from "@/app/components/CategorySection";
import BookingSection from "@/app/components/BookingSection";
import { ProductsServices } from "@/app/services/ProductsServices";
import Link from "next/link";
import SecondSeparator from "@/app/components/SecondSeparator";
import StaticMap from "@/app/components/StaticMap";
import ImageGallery from "@/app/components/quintas/ImageGallery";
import { Quintas, Users } from "@/types";
interface QuintaIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuintaIdPage({ params }: QuintaIdPageProps) {
  const { id } = await params;
  const res = await ProductsServices.getQuintaById(id);
  const owner: Users | null = await ProductsServices.getOwnerById(res.owner_id);
  console.log(owner);

  const quinta: Quintas = res;
  const formatedPrice = quinta.price.toLocaleString("es-AR", {
    style: "currency",
    currency: quinta.currency_price,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const costOfService = () => {
    const res = quinta.price * 0.06;
    const formated = res.toLocaleString("es-AR", {
      style: "currency",
      currency: quinta.currency_price,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formated;
  };
  const total = (cost: number) => {
    const res = quinta.price + cost;
    return res;
  };
  const costOfServiceFromTotal = () => {
    const res = quinta.price * 0.06;
    return res;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="px-4 md:px-10 lg:mx-20 mb-10" id="hero">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <h1 className="font-semibold text-xl md:text-2xl">{quinta.title}</h1>
          <ul className="flex gap-5 items-center">
            <button
              onClick={handleShare}
              className="flex items-center cursor-pointer gap-3 font-medium text-sm md:text-base">
              <p>Compartir</p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.61 21C15.9473 21 15.385 20.7683 14.923 20.305C14.4617 19.841 14.231 19.2777 14.231 18.615C14.231 18.515 14.275 18.2627 14.363 17.858L7.166 13.585C6.95 13.8343 6.68567 14.03 6.373 14.172C6.06033 14.314 5.72467 14.385 5.366 14.385C4.70867 14.385 4.15 14.151 3.69 13.683C3.23 13.215 3 12.654 3 12C3 11.346 3.23 10.785 3.69 10.317C4.15 9.849 4.70867 9.615 5.366 9.615C5.724 9.615 6.05967 9.686 6.373 9.828C6.68633 9.97 6.95067 10.166 7.166 10.416L14.364 6.161C14.3173 6.03167 14.2837 5.90333 14.263 5.776C14.2417 5.648 14.231 5.51733 14.231 5.384C14.231 4.722 14.4633 4.159 14.928 3.695C15.3927 3.23167 15.9567 3 16.62 3C17.2833 3 17.846 3.23233 18.308 3.697C18.77 4.16167 19.0007 4.72567 19 5.389C18.9993 6.05233 18.7677 6.615 18.305 7.077C17.8423 7.539 17.279 7.76967 16.615 7.769C16.2537 7.769 15.9203 7.695 15.615 7.547C15.3097 7.399 15.0497 7.2 14.835 6.95L7.636 11.223C7.68267 11.3523 7.71633 11.481 7.737 11.609C7.75833 11.7363 7.769 11.8667 7.769 12C7.769 12.1333 7.75833 12.2637 7.737 12.391C7.71567 12.5183 7.68233 12.647 7.637 12.777L14.835 17.05C15.0503 16.8 15.3103 16.601 15.615 16.453C15.9203 16.305 16.2537 16.231 16.615 16.231C17.2777 16.231 17.841 16.463 18.305 16.927C18.7683 17.3923 19 17.9567 19 18.62C19 19.2833 18.7677 19.846 18.303 20.308C17.8383 20.77 17.2733 21.0007 16.61 21Z"
                  fill="#28A728"
                />
              </svg>
            </button>
            <li className="flex items-center gap-3 font-medium text-sm md:text-base">
              <p>Agregar a favoritos</p>
              <Heart className={"w-5 cursor-pointer"} />
            </li>
          </ul>
        </div>
        <ImageGallery
          mainImage={quinta.main_image}
          images={quinta.images}
          title={quinta.title}
        />
        <div className="flex flex-col gap-2 mt-3">
          <h2 className="text-lg md:text-xl">{quinta.address}</h2>
          <p className="text-sm md:text-lg font-light">
            {`${quinta.guests} huéspedes - ${quinta.bedrooms} dormitorios - ${quinta.bathrooms} baños - ${quinta.environments} ambientes`}
          </p>
        </div>
      </section>
      <SecondSeparator />

      <BookingSection
        quinta={quinta}
        formatedPrice={formatedPrice}
        costOfService={costOfService()}
        totalPrice={total(costOfServiceFromTotal()).toLocaleString()}
        maxGuests={quinta.guests}>
        {/* Calificaciones y anfitrión */}
        <div className="flex flex-col items-start md:pr-10 lg:pr-20 gap-6 md:gap-10">
          {owner?.opinions && owner.opinions.length > 0 ? (
            <div className="flex items-center px-10 py-2 rounded-3xl bg-primaryDark">
              <div className="flex flex-col items-center space-x-2 px-7">
                <span className="text-white">
                  {owner.average_opinions.toLocaleString()}
                </span>
                <div className="flex gap-1 items-center">
                  {Array.from({
                    length: Math.floor(owner.average_opinions),
                  }).map((_, i) => (
                    <Star
                      className="w-3 text-white fill-yellow-500 stroke-yellow-500"
                      key={i}
                    />
                  ))}
                  {owner.average_opinions % 1 !== 0 && (
                    <StarHalf className="w-3 text-white fill-yellow-500 stroke-yellow-500" />
                  )}
                </div>
              </div>
              <p className="text-gray-500">|</p>
              <div className="text-white flex flex-col items-center px-7">
                <p>{owner.opinions.length} opiniones</p>
                <Link
                  href="#opinions"
                  className="underline text-xs cursor-pointer">
                  Ver opiniones
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center md:justify-start justify-center md:w-max w-full px-6 py-2 rounded-3xl border border-primaryDark text-primaryDark font-semibold text-sm">
              ✨ Nuevo en ZonaQuintas
            </div>
          )}
          <div className="flex items-center space-x-2">
            <img
              src="/avatar.png"
              alt="Avatar anfitrión"
              className="rounded-full w-10 h-10"
            />
            <div className="text-sm">
              <p className="font-semibold">{`Anfitrión: ${owner?.name}`}</p>
              <p className="text-gray-500">
                {owner?.owner_time} como anfitrión
              </p>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <Separator color="bg-gray-300" />
          <p className="text-sm text-gray-700 py-5">{owner?.description}</p>
          <Separator color="bg-gray-300" />
        </div>

        {/* Servicios */}
        <div className="pr-30">
          <h3 className="font-semibold mb-4">¿Qué ofrece este hospedaje?</h3>

          {/* Habitaciones */}
          {!!quinta.sabanas ||
            !!quinta.mantas ||
            (!!quinta.almohadas && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Habitaciones
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.sabanas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Sábanas
                    </span>
                  )}
                  {!!quinta.mantas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Mantas
                    </span>
                  )}
                  {!!quinta.almohadas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Almohadas
                    </span>
                  )}
                </div>
              </>
            ))}

          {/* Artículos de limpieza personal */}
          {!!quinta.toilettes ||
            !!quinta.shampoo ||
            !!quinta.toallas ||
            (!!quinta.secador_pelo && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Limpieza personal
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.toilettes && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Toilettes
                    </span>
                  )}
                  {!!quinta.shampoo && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Shampoo
                    </span>
                  )}
                  {!!quinta.toallas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Toallas
                    </span>
                  )}
                  {!!quinta.secador_pelo && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Secador de pelo
                    </span>
                  )}
                </div>
              </>
            ))}

          {/* Artículos de limpieza general */}
          {!!quinta.lavarropas ||
            (!!quinta.cambio_toallas && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Limpieza general
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.lavarropas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Lavarropas
                    </span>
                  )}
                  {!!quinta.cambio_toallas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cambio de toallas
                    </span>
                  )}
                </div>
              </>
            ))}

          {/* Cocina */}
          {!!quinta.utensillos_cocina ||
            !!quinta.vajilla ||
            (!!quinta.freezer && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Cocina
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.utensillos_cocina && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Utensilios para cocinar
                    </span>
                  )}
                  {!!quinta.vajilla && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Vajilla
                    </span>
                  )}
                  {!!quinta.freezer && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Freezer
                    </span>
                  )}
                </div>
              </>
            ))}

          {/* Entretenimiento */}
          {!!quinta.televisor ||
            !!quinta.radio ||
            !!quinta.tv ||
            !!quinta.cable ||
            !!quinta.internet ||
            !!quinta.jacuzzi ||
            quinta.playroom ||
            (quinta.sofas && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Entretenimiento
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.televisor && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Televisor
                    </span>
                  )}
                  {!!quinta.radio && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Radio
                    </span>
                  )}
                  {!!quinta.tv && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> TV
                    </span>
                  )}
                  {!!quinta.cable && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cable
                    </span>
                  )}
                  {!!quinta.internet && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Internet
                    </span>
                  )}
                  {!!quinta.jacuzzi && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Jacuzzi
                    </span>
                  )}
                  {!!quinta.playroom && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Playroom
                    </span>
                  )}
                  {!!quinta.sofas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Sofás
                    </span>
                  )}
                </div>
              </>
            ))}

          {/* Estacionamiento */}
          {!!quinta.estacionamiento_techado && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Estacionamiento
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                <span className="flex items-center space-x-2">
                  <Check className="w-4 h-4" /> Estacionamiento techado
                </span>
              </div>
            </>
          )}

          {/* Otras características */}
          {!!quinta.parrilla ||
            !!quinta.estufa_gas ||
            !!quinta.hogar ||
            !!quinta.hamacas_paraguayas ||
            !!quinta.arboleda ||
            !!quinta.cancha_futbol ||
            !!quinta.piscina ||
            !!quinta.cancha_basquet ||
            !!quinta.cancha_tenis ||
            !!quinta.cancha_padel ||
            !!quinta.hamacas ||
            (!!quinta.parlantes && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Otras características
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
                  {!!quinta.parrilla && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Parrilla
                    </span>
                  )}
                  {!!quinta.estufa_gas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Estufa a gas
                    </span>
                  )}
                  {!!quinta.hogar && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Hogar
                    </span>
                  )}
                  {!!quinta.hamacas_paraguayas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Hamacas paraguayas
                    </span>
                  )}
                  {!!quinta.arboleda && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Arboleda con buena sombra
                    </span>
                  )}
                  {!!quinta.cancha_futbol && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cancha de fútbol
                    </span>
                  )}
                  {!!quinta.piscina && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Piscina
                    </span>
                  )}
                  {!!quinta.cancha_basquet && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cancha de basquet
                    </span>
                  )}
                  {!!quinta.cancha_tenis && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cancha de tenis
                    </span>
                  )}
                  {!!quinta.cancha_padel && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Cancha de padel
                    </span>
                  )}
                  {!!quinta.hamacas && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Hamacas
                    </span>
                  )}
                  {!!quinta.parlantes && (
                    <span className="flex items-center space-x-2">
                      <Check className="w-4 h-4" /> Parlantes
                    </span>
                  )}
                </div>
              </>
            ))}
        </div>
        <div className="pr-30">
          <Separator color="bg-gray-300" />
        </div>
      </BookingSection>
      {/* <SecondSeparator /> */}

      {owner?.opinions && owner.opinions.length > 0 && (
        <>
          <section
            className="px-4 md:px-10 lg:mx-20 py-8 space-y-8"
            id="opinions">
            <h3 className="text-xl font-semibold">Reseñas de los huéspedes</h3>
            {/* Aquí iría el mapeo de reseñas reales cuando existan */}
          </section>
          <SecondSeparator />
        </>
      )}
      <SecondSeparator />
      <section className="px-4 md:px-10 lg:mx-20 my-5" id="map">
        <div>
          <h3 className="font-semibold text-lg">Ubicación del hospedaje</h3>
          <p className="text-gray-500">{quinta.address}</p>
        </div>
        <div className="mt-5">
          <StaticMap lat={quinta.latitude} lng={quinta.length} />
        </div>
      </section>
      <SecondSeparator />

      {/* Información del anfitrión */}
      <section
        className="px-4 md:px-10 lg:mx-20 pt-10 space-y-6"
        id="owner_info">
        <h4 className="font-semibold text-center md:text-start">
          Información del anfitrión
        </h4>
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 lg:gap-32">
          <div className="bg-white flex max-w-xl rounded-xl shadow-sm py-6 px-6 md:px-12 gap-6 md:gap-10 text-sm text-center">
            <div className="flex flex-col gap-3 mx-auto justify-center items-center">
              <img
                src={
                  owner?.picture ||
                  "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <p className="font-semibold">Anfitrión: {owner?.name}</p>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <p>Vive en {owner?.owner_location}</p>
              </div>
            </div>
            {owner?.opinions && owner.opinions.length > 0 && (
              <div className="flex flex-col justify-between gap-10 text-center">
                <div>
                  <p className="text-xl font-semibold">
                    {owner.opinions.length}
                  </p>
                  <p className="text-gray-500">Opiniones</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {owner.average_opinions}
                    <span className="text-yellow-500">★</span>
                  </p>
                  <p className="text-gray-500">Puntuación</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{owner.owner_time}</p>
                  <p className="text-gray-500">Anfitrión</p>
                </div>
              </div>
            )}
          </div>

          {/* Información y contacto */}
          <div className="flex-1 flex flex-col justify-between gap-10 text-sm text-gray-800">
            {owner?.opinions && owner.opinions.length > 0 ? (
              <div className="flex items-start flex-col gap-2">
                <h3 className="font-semibold">
                  {owner.name} es un gran Anfitrión
                </h3>
                <p>
                  Esto lo confirma que su puntuación es superior a 4,00, un
                  promedio por alto de la media que se asegura que los huéspedes
                  tengan una experiencia gratificante en su estadía.
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-start gap-5">
                <h3 className="font-semibold">
                  Este es el inmueble de {owner?.name}
                </h3>
                <p>
                  {owner?.name} es un nuevo anfitrión en ZonaQuintas. Estamos
                  seguros de que hará todo lo posible para que tengas una
                  estadía inolvidable en su propiedad.
                </p>
                <b className="text-primaryDark underline">
                  En ZonaQuintas nos encargamos de verificar la identidad del
                  anfitrión y de que su propiedad cumpla con nuestros estándares
                  de calidad.
                </b>
              </div>
            )}

            {owner?.opinions && owner.opinions.length > 0 && (
              <div className="flex items-start flex-col gap-2">
                <h3 className="font-semibold">Contacto con el Anfitrión</h3>
                <p>
                  Índice de respuesta: <span className="font-medium">100%</span>
                </p>
                <p>Responde en el mismo día de la consulta</p>
              </div>
            )}
          </div>
        </div>

        {/* Idiomas y ubicación */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32 mt-8">
          <div className="flex flex-col max-w-xl items-start gap-4 text-base md:text-xl text-black pt-4">
            {owner?.languages && owner.languages.length > 0 && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <p>Se comunica en {owner.languages.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <SecondSeparator />

      <section
        className="px-4 md:px-10 lg:mx-20 py-8 space-y-6 text-sm text-gray-800"
        id="norms">
        <h2 className="text-xl font-semibold text-center">
          Qué tenés que saber
        </h2>
        <div className="flex md:flex-row flex-col md:gap-0 gap-5 justify-between w-full">
          {/* Política de cancelación */}
          <div className="space-y-2">
            <h3 className="font-semibold">Política de cancelación</h3>
            <ul className="space-y-1">
              <li>Esta reserva no es reembolsable.</li>
              <li>
                Consultá la políticas completas para obtener más información.
              </li>
            </ul>
            <Link
              href="/terms"
              className="text-black cursor-pointer underline flex items-center hover:text-gray-700">
              Mostrar más <span className="ml-1">›</span>
            </Link>
          </div>
          {/* Advertencia */}
          <div className="border-gray-400 flex items-center gap-2 text-sm text-black">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.3701 7.39818L14.2163 3.32741C14.1489 3.29573 14.0754 3.2793 14.0009 3.2793C13.9264 3.2793 13.8529 3.29573 13.7855 3.32741L4.63167 7.39818C4.53702 7.43947 4.45624 7.50711 4.39895 7.59304C4.34167 7.67896 4.31031 7.77954 4.30859 7.8828V10.7689C4.30859 16.0674 7.47475 22.4859 13.8071 24.7043C13.9328 24.747 14.069 24.747 14.1947 24.7043C20.5271 22.4859 23.6932 16.0674 23.6932 10.7689V7.8828C23.6915 7.77954 23.6601 7.67896 23.6028 7.59304C23.5456 7.50711 23.4648 7.43947 23.3701 7.39818ZM19.0495 10.9628L13.3634 18.2019C13.2807 18.3062 13.177 18.392 13.059 18.4536C12.941 18.5152 12.8113 18.5513 12.6784 18.5594L12.6224 18.5616C12.3721 18.5611 12.132 18.4616 11.9547 18.2848L9.02552 15.3556C8.84886 15.1785 8.74979 14.9385 8.75009 14.6883C8.7504 14.4382 8.85005 14.1985 9.02713 14.0218C9.20422 13.8451 9.44422 13.7461 9.69435 13.7464C9.94448 13.7467 10.1842 13.8463 10.3609 14.0234L12.5384 16.2009L17.5677 9.79864C17.7249 9.61022 17.9494 9.49048 18.1934 9.46484C18.4375 9.43919 18.6819 9.50965 18.8749 9.66127C19.0678 9.81289 19.1941 10.0337 19.2269 10.2769C19.2597 10.5201 19.1965 10.7665 19.0506 10.9639L19.0495 10.9628Z"
                fill="#28A728"
              />
            </svg>

            <p className="text-xs md:text-medium">
              Por seguridad, recomendamos siempre usar la página oficial de
              ZonaQuintas a la hora de transferir dinero y comunicarte con los
              anfitriones.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
