/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Heart from "@/app/components/icons/Heart";
import {
  CalendarDays,
  Check,
  Star,
  StarHalf,
  MessageCircle,
  MapPin,
  DollarSign,
  Key,
  Sparkles,
  CalendarCheck,
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
import { Users } from "@/types";
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

  const quinta = res;
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
  // const categorias = [
  //   { nombre: "Limpieza", valor: 5.0, icono: <Sparkles className="" /> },
  //   { nombre: "Veracidad", valor: 5.0, icono: <CalendarCheck className="" /> },
  //   { nombre: "Check-in", valor: 4.5, icono: <Key className="" /> },
  //   {
  //     nombre: "Comunicación",
  //     valor: 4.8,
  //     icono: <MessageCircle className="" />,
  //   },
  //   { nombre: "Ubicación", valor: 4.8, icono: <MapPin className="" /> },
  //   {
  //     nombre: "Precio según calidad",
  //     valor: 5.0,
  //     icono: <DollarSign className="" />,
  //   },
  // ];
  // const reseñas = [
  //   {
  //     nombre: "Camila",
  //     fecha: "Hace 3 semanas",
  //     noches: 6,
  //     texto:
  //       "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  //   },
  //   {
  //     nombre: "Nazario",
  //     fecha: "Hace 4 meses",
  //     noches: 6,
  //     texto:
  //       "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  //   },
  //   {
  //     nombre: "Leandro",
  //     fecha: "Hace 3 meses",
  //     noches: 5,
  //     texto:
  //       "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  //   },
  //   {
  //     nombre: "Kauan",
  //     fecha: "Hace 3 años",
  //     noches: 2,
  //     texto:
  //       "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  //   },
  //   {
  //     nombre: "Rodrigo",
  //     fecha: "Hace 3 semanas",
  //     noches: 4,
  //     texto:
  //       "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  //   },
  //   {
  //     nombre: "Gabriel",
  //     fecha: "Hace 2 semanas",
  //     noches: 3,
  //     texto:
  //       "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  //   },
  // ];
  return (
    <main className="flex flex-col">
      <section className="ml-30 mb-10 mr-50 pr-30" id="hero">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl">{quinta.title}</h1>
          <ul className="flex gap-5 items-center">
            <li className="flex items-center gap-3 font-medium">
              <p>Compartir</p>
              <Heart className={"w-5 cursor-pointer"} />
            </li>
            <li className="flex items-center gap-3 font-medium">
              <p>Agregar a favoritos</p>
              <Heart className={"w-5 cursor-pointer"} />
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <img
              src={quinta.main_image}
              alt="Casa quinta principal"
              className="w-full h-[500px] object-cover rounded-l-xl"
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            {quinta.images.slice(0, 3).map((image: string) => (
              <img
                key={image}
                src={image}
                alt={`Vista ${quinta.images.indexOf(image) + 1}`}
                className="w-96 h-full object-cover"
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">{quinta.address}</h2>
            <p className="text-lg font-light">
              {`${quinta.guests} huéspedes - ${quinta.bedrooms} dormitorios - ${quinta.bathrooms} camas - ${quinta.ambients} baños`}
            </p>
          </div>
        </div>
      </section>
      <SecondSeparator />

      <BookingSection
        formatedPrice={formatedPrice}
        costOfService={costOfService()}
        totalPrice={total(costOfServiceFromTotal()).toLocaleString()}
        maxGuests={quinta.guests}>
        {/* Calificaciones y anfitrión */}
        <div className="flex flex-col items-start pr-30 gap-10">
          <div className="flex items-center px-10 py-2 rounded-3xl bg-primaryDark">
            <div className="flex flex-col items-center space-x-2 px-7">
              <span className="text-white">4,5</span>
              <div className="flex gap-1 items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star
                    className="w-3 text-white fill-yellow-500 stroke-yellow-500"
                    key={i}
                  />
                ))}
                <StarHalf className="w-3 text-white fill-yellow-500 stroke-yellow-500" />
              </div>
            </div>
            <p className="text-gray-500">|</p>
            <div className="text-white flex flex-col items-center px-7">
              <p>72 opiniones</p>
              <Link
                href="#opinions"
                className="underline text-xs cursor-pointer">
                Ver opiniones
              </Link>
            </div>
          </div>
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
        <div className="pr-30">
          <Separator color="bg-gray-300" />
          <p className="text-sm text-gray-700 py-10">{owner?.description}</p>
          <Separator color="bg-gray-300" />
        </div>

        {/* Servicios */}
        <div className="pr-30">
          <h3 className="font-semibold mb-2">¿Qué ofrece este hospedaje?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Heladera
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Cocina
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Wifi estable
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Botiquín
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> A.C. Frío/Calor
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Estufa Hogar
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Estacionamiento
            </span>
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4" /> Parrilla
            </span>
          </div>
          <button className="mt-4 border px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            Ver más de lo que ofrece
          </button>
        </div>
        <div className="pr-30">
          <Separator color="bg-gray-300" />
        </div>
      </BookingSection>
      {/* <SecondSeparator /> */}

      <section className="mx-30 px-4 py-8 space-y-8" id="opinions">
        {/* Puntuación general */}
        {/* <div id="opinions" className="text-center space-y-2">
          <div className="flex justify-center items-center text-yellow-500">
            {[...Array(4)].map((_, i) => (
              <Star
                key={i}
                className="w-10 fill-yellow-500 stroke-yellow-500"
              />
            ))}
            <StarHalf className="w-10 fill-yellow-500 stroke-yellow-500" />
          </div>
          <p className="text-3xl font-bold">4,5</p>
        </div> */}

        {/* Categorías */}
        {/* <CategorySection categorias={categorias} /> */}

        {/* Reseñas */}
        {/* <div className="grid md:grid-cols-2 place-items-center gap-6">
          {reseñas.map((resena, i) => (
            <div
              key={i}
              className="border-b pb-4 max-w-xl space-y-1 text-sm text-gray-800">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://i.pravatar.cc/40?img=${i + 1}`}
                  alt={resena.nombre}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{resena.nombre}</p>
                  <p>Hace algunos meses alquila en ZonaQuintas</p>
                  <div className="flex items-center gap-2">
                    <p className="text-black font-bold">{resena.fecha}</p>
                    <p className=" text-gray-500">
                      {" "}
                      Estadia de {resena.noches} noches
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-black">{resena.texto}</p>
              <button className="text-black font-semibold text-sm underline mt-1">
                Mostrar más
              </button>
            </div>
          ))}
        </div>

        <div className="text-start">
          <button className="border border-gray-400 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100">
            Ver más de lo que ofrece
          </button>
        </div> */}
      </section>
      <SecondSeparator />
      <section className="mx-30 my-5" id="map">
        <div>
          <h3 className="font-semibold text-lg">Ubicación del hospedaje</h3>
          <p className="text-gray-500">{quinta.address}</p>
        </div>
        <div className="mt-5">
          <StaticMap lat={quinta.latitude} lng={quinta.longitude} />
        </div>
      </section>
      <SecondSeparator />

      <section className="mx-30 px-4 py-8 space-y-6" id="owner_info">
        <h4 className="font-semibold">Toda la información del anfitrión</h4>
        <div className="flex flex-col md:flex-row justify-between gap-32">
          {/* Tarjeta de anfitrión */}
          <div className="bg-white flex max-w-xl rounded-xl shadow-sm py-6 px-12 gap-10 text-sm text-center">
            <div className="flex flex-col gap-5 justify-center items-center">
              <img
                src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                alt="Avatar"
                className="w-30 mx-auto"
              />
              <p className="font-semibold">Anfitrión: {owner?.name}</p>
            </div>
            {/* <div className="flex flex-col justify-between gap-10 text-center">
              <div>
                <p className="text-xl font-semibold">72</p>
                <p className="text-gray-500">Opiniones de huéspedes</p>
              </div>
              <div>
                <p className="text-xl font-semibold">
                  4,5<span className="text-yellow-500">★</span>
                </p>
                <p className="text-gray-500">De puntuación</p>
              </div>
              <div>
                <p className="text-xl font-semibold">1 año</p>
                <p className="text-gray-500">Como anfitrión</p>
              </div>
            </div> */}
          </div>

          {/* Información y contacto */}
          <div className="flex-1 flex flex-col justify-center gap-10 text-sm text-gray-800">
            <div className="flex items-start flex-col gap-2">
              <h3 className="font-semibold">Valentín es un gran Anfitrión</h3>
              <p>
                Esto lo confirma que su puntuación es superior a 4,00, un
                promedio por alto de la media que se asegura que los huéspedes
                tengan una experiencia gratificante en su estadía.
              </p>
            </div>

            <div className="flex items-start flex-col gap-2">
              <h3 className="font-semibold">Contacto con el Anfitrión</h3>
              <p>
                Índice de respuesta: <span className="font-medium">100%</span>
              </p>
              <p>Responde en el mismo día de la consulta</p>
            </div>

            {/* <button className="bg-primaryDark max-w-xs cursor-pointer hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition">
              Ponerse en contacto
            </button> */}
          </div>
        </div>

        <div className="flex gap-32">
          {/* Idiomas y ubicación */}
          <div className="flex flex-col max-w-xl items-start gap-4 text-xl text-black pt-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <p>Se comunica en Español, Inglés y Portugués</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <p>Vive en Gerli, Buenos Aires, Argentina</p>
            </div>
          </div>

          {/* Advertencia */}
          <div className="border-t border-gray-400 pt-4 flex flex-1 items-start gap-2 text-sm text-black">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <p>
              Por seguridad, recomendamos siempre usar la página oficial de
              ZonaQuintas a la hora de transferir dinero y comunicarte con los
              anfitriones.
            </p>
          </div>
        </div>
      </section>
      <SecondSeparator />

      <section
        className="mx-30 px-4 py-8 space-y-6 text-sm text-gray-800"
        id="norms">
        <h2 className="text-xl font-semibold">Qué tenés que saber</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Normas de la casa */}
          {/* <div className="space-y-2">
            <h3 className="font-semibold">Normas de la casa</h3>
            <ul className="space-y-1">
              <li>Check-in a partir de las 4:00 p. m.</li>
              <li>Check-out antes de las 1:00 p. m.</li>
              <li>2 huéspedes como máximo</li>
            </ul>
            <button className="text-black underline flex items-center hover:text-gray-700">
              Mostrar más <span className="ml-1">›</span>
            </button>
          </div> */}

          {/* Seguridad y propiedad */}
          {/* <div className="space-y-2">
            <h3 className="font-semibold">Sobre la seguridad y la propiedad</h3>
            <ul className="space-y-1">
              <li>No hay un detector de monóxido de carbono</li>
              <li>No hay un detector de humo</li>
              <li>Pileta/jacuzzi sin rejas ni puerta con llave</li>
            </ul>
            <button className="text-black underline flex items-center hover:text-gray-700">
              Mostrar más <span className="ml-1">›</span>
            </button>
          </div> */}

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
        </div>
      </section>
    </main>
  );
}
