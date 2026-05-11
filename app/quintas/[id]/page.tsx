"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Heart from "@/app/components/icons/Heart";
import {
  Star,
  StarHalf,
  MapPin,
  Globe,
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
import { use, useEffect, useState } from "react";
interface quintaIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function quintaIdPage({ params }: quintaIdPageProps) {
  const { id } = use(params);

  const [quinta, setQuinta] = useState<Quintas | null>(null);
  const [owner, setOwner] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuintaAndOwner = async () => {
      try {
        // Primero obtengo la quinta usando el id
        const quintaData = await ProductsServices.getQuintaById(id);
        setQuinta(quintaData);

        // Luego obtengo el owner, usando el owner_id de quintaData
        if (quintaData && quintaData.owner_id) {
          const ownerData = await ProductsServices.getOwnerById(
            quintaData.owner_id,
          );
          setOwner(ownerData);
        }
      } catch (error) {
        // Manejar error si alguna petición falla
        console.error("Error al obtener la quinta o el owner:", error);
      } finally {
        setLoading(false);
      }
    };

    getQuintaAndOwner();
  }, [id]);

  const currency = quinta?.currency_price ?? "ARS";
  const priceNum = quinta?.price ?? 0;
  const serviceCostNum = priceNum * 0.06;
  const totalNum = priceNum + serviceCostNum;
  const languagesMayus = owner?.languages.map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1));

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-AR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatedPrice = formatCurrency(priceNum);
  const costOfService = formatCurrency(serviceCostNum);
  const totalPrice = formatCurrency(totalNum);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };


  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="/logo.png" width={80} height={80} alt="" />
        </div>
      </main>
    );
  }

  if (!quinta) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-center font-semibold">No se encontro la quinta</p>
      </div>
    );
  }
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="px-4 md:px-10 lg:mx-20 mb-10" id="hero">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <h1 className="font-semibold text-xl md:text-2xl">{quinta?.title}</h1>
          {/* <ul className="flex gap-5 items-center">
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
          </ul> */}
        </div>
        {quinta && (
          <ImageGallery
            mainImage={quinta.main_image}
            images={quinta.images}
            title={quinta.title}
          />
        )}
        <div className="flex flex-col gap-2 mt-3">
          <h2 className="text-lg md:text-xl">{quinta?.address}</h2>
          <p className="text-sm md:text-lg font-light">
            {`${quinta?.guests} huéspedes - ${quinta?.bedrooms} dormitorios - ${quinta?.bathrooms} baños - ${quinta?.environments} ambientes`}
          </p>
        </div>
      </section>
      <SecondSeparator />

      <BookingSection
        quinta={quinta!}
        formatedPrice={formatedPrice}
        costOfService={String(serviceCostNum.toFixed(2))}
        totalPrice={totalPrice}
        maxGuests={quinta?.guests || 0}>
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
              ✨ Nuevo en Zonaquintas
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
          <h3 className="font-semibold text-xl mb-6">¿Qué ofrece este hospedaje?</h3>

          {/* ── Helper: bloque por categoría ──────────────────────────── */}
          {(() => {
            type AmenityItem = { key: keyof Quintas; label: string; icon: React.ReactNode };
            type Category = { title: string; items: AmenityItem[] };

            const Ico = ({ d }: { d: string }) => (
              <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </div>
            );

            const CATEGORIES: Category[] = [
              {
                title: "Habitaciones",
                items: [
                  { key: "sabanas", label: "Sábanas", icon: <Ico d="M3 7h18M3 12h18M3 17h18" /> },
                  { key: "mantas", label: "Mantas", icon: <Ico d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" /> },
                  { key: "almohadas", label: "Almohadas", icon: <Ico d="M5 10a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0v-4z" /> },
                ],
              },
              {
                title: "Limpieza personal",
                items: [
                  { key: "toilettes", label: "Toilettes", icon: <Ico d="M12 2C8 2 5 5 5 8v1h14V8c0-3-3-6-7-6zM5 9v2a7 7 0 0 0 14 0V9H5z" /> },
                  { key: "shampoo", label: "Shampoo", icon: <Ico d="M9 2h6l1 4H8L9 2zM8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6H8z" /> },
                  { key: "toallas", label: "Toallas", icon: <Ico d="M3 5h18M6 5v14h12V5" /> },
                  { key: "secador_pelo", label: "Secador de pelo", icon: <Ico d="M5 12a7 7 0 0 1 14 0M12 5v2M19 12h2M3 12h2M12 19v-2" /> },
                ],
              },
              {
                title: "Limpieza general",
                items: [
                  { key: "lavarropas", label: "Lavarropas", icon: <Ico d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /> },
                  { key: "cambio_toallas", label: "Cambio de toallas", icon: <Ico d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
                ],
              },
              {
                title: "Cocina",
                items: [
                  { key: "utensillos_cocina", label: "Utensilios de cocina", icon: <Ico d="M3 2v7c0 3 2 5 5 5v7M16 2v7c0 3 2 5 5 5v7M16 2a5 5 0 0 0-5 5" /> },
                  { key: "vajilla", label: "Vajilla", icon: <Ico d="M12 2a9 9 0 1 0 0 18A9 9 0 0 0 12 2zm0 0v18M3 12h18" /> },
                  { key: "freezer", label: "Heladera / Freezer", icon: <Ico d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 9h14M9 7v4M15 7v4" /> },
                ],
              },
              {
                title: "Entretenimiento",
                items: [
                  { key: "televisor", label: "Televisor", icon: <Ico d="M2 7h20v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7zm7 16h6M12 3l-3 4h6l-3-4z" /> },
                  { key: "tv", label: "Smart TV", icon: <Ico d="M2 7h20v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7zm7 16h6" /> },
                  { key: "cable", label: "TV por Cable", icon: <Ico d="M4 6h16M4 12h16M4 18h16" /> },
                  { key: "radio", label: "Radio", icon: <Ico d="M5 3h14a1 1 0 0 1 1 1v16H4V4a1 1 0 0 1 1-1zm7 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> },
                  { key: "internet", label: "WiFi / Internet", icon: <Ico d="M1.5 8.5a17 17 0 0 1 21 0M5 12a12 12 0 0 1 14 0M8.5 15.5a7 7 0 0 1 7 0M12 19v.5" /> },
                  { key: "jacuzzi", label: "Jacuzzi", icon: <Ico d="M2 12h20M2 8c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1M6 16h.01M10 16h.01M14 16h.01M18 16h.01" /> },
                  { key: "playroom", label: "Playroom", icon: <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-2 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm-4 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" /> },
                  { key: "sofas", label: "Sofás", icon: <Ico d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4H2V9zm0 4v3h2v2h3v-2h10v2h3v-2h2v-3" /> },
                ],
              },
              {
                title: "Estacionamiento",
                items: [
                  { key: "estacionamiento_techado", label: "Estacionamiento techado", icon: <Ico d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" /> },
                ],
              },
              {
                title: "Exterior y ocio",
                items: [
                  { key: "parrilla", label: "Parrilla", icon: <Ico d="M4 8h16M9 8V4m6 4V4M8 8c0 5 1 9 4 12 3-3 4-7 4-12M5 20h14" /> },
                  { key: "estufa_gas", label: "Estufa a gas", icon: <Ico d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" /> },
                  { key: "hogar", label: "Hogar / Chimenea", icon: <Ico d="M3 22V10L12 3l9 7v12M9 22V16h6v6" /> },
                  { key: "hamacas_paraguayas", label: "Hamacas paraguayas", icon: <Ico d="M4 8c4 4 12 4 16 0M4 16c4-4 12-4 16 0M4 8v8M20 8v8" /> },
                  { key: "arboleda", label: "Arboleda con sombra", icon: <Ico d="M12 2l4 8H8l4-8zm0 8v12M8 18h8" /> },
                  { key: "cancha_futbol", label: "Cancha de fútbol", icon: <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0v20M2 12h20" /> },
                  { key: "piscina", label: "Piscina", icon: <Ico d="M2 12h20M2 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M6 12V5a6 6 0 0 1 12 0v7" /> },
                  { key: "cancha_basquet", label: "Cancha de básquet", icon: <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c0 10-5 15-5 15M12 2c0 10 5 15 5 15M2 12h20" /> },
                  { key: "cancha_tenis", label: "Cancha de tenis", icon: <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-9 6h18M3 18h18M12 2v20" /> },
                  { key: "cancha_padel", label: "Cancha de pádel", icon: <Ico d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 0v18M3 12h18" /> },
                  { key: "hamacas", label: "Hamacas", icon: <Ico d="M4 6l16 12M4 18l16-12M8 12h8" /> },
                  { key: "parlantes", label: "Parlantes", icon: <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /> },
                ],
              },
            ];

            const anyActive = CATEGORIES.some((cat) =>
              cat.items.some((item) => !!quinta?.[item.key])
            );
            if (!anyActive) return null;

            return (
              <div className="flex flex-col gap-6">
                {CATEGORIES.map((cat) => {
                  const activeItems = cat.items.filter((item) => !!quinta?.[item.key]);
                  if (activeItems.length === 0) return null;
                  return (
                    <div key={cat.title}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        {cat.title}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {activeItems.map((item) => (
                          <div key={String(item.key)} className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
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
          <p className="text-gray-500">{quinta?.address}</p>
        </div>
        <div className="mt-5">
          {quinta && <StaticMap lat={quinta?.latitude} lng={quinta?.length} />}
        </div>
      </section>
      <SecondSeparator />

      {/* Información del anfitrión */}
      <section
        className="px-4 md:px-10 lg:mx-20 pt-10 mb-5 space-y-6"
        id="owner_info">
        <h4 className="font-semibold text-center md:text-start">
          Información del anfitrión
        </h4>
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 lg:gap-32">
          <div className="bg-white flex max-w-xl rounded-xl shadow-sm py-6 px-6 md:px-12 gap-6 md:gap-10 text-sm text-center">
            <div className="flex flex-col gap-3 mx-auto justify-center items-center">
              <img
                src={owner?.picture?.[0] || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <p className="font-semibold">Anfitrión: {owner?.name}</p>
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
          <div className="flex flex-col max-w-xl items-start gap-8 text-base md:text-xl text-black pt-4">
            {owner?.languages && owner.languages.length > 0 && (
              <div className="flex items-center space-x-2">
                <Globe className="w-10 h-10" />
                <p>Se comunica en {languagesMayus?.join(", ")}.</p>
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
              <li>Las cancelaciones se regirán por las Políticas de Cancelación y Reembolso vigentes en la plataforma.</li>
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
