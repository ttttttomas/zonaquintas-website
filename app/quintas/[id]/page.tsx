/* eslint-disable @next/next/no-img-element */

import Heart from "@/app/components/icons/Heart";
import { CalendarDays, Check, Star, StarHalf, MessageCircle, MapPin, DollarSign, Key, Sparkles, CalendarCheck, Globe, ShieldCheck } from "lucide-react";
import { Separator } from "@/app/components/ui/Separator";
import CategorySection from "@/app/components/CategorySection";
import Calendar from "@/app/components/Calendar";

export default function QuintaIdPage() {
const categorias = [
      { nombre: "Limpieza", valor: 5.0, icono: <Sparkles className="" /> },
      { nombre: "Veracidad", valor: 5.0, icono: <CalendarCheck className="" /> },
      { nombre: "Check-in", valor: 4.5, icono: <Key className="" /> },
      { nombre: "Comunicación", valor: 4.8, icono: <MessageCircle className="" /> },
      { nombre: "Ubicación", valor: 4.8, icono: <MapPin className="" /> },
      { nombre: "Precio según calidad", valor: 5.0, icono: <DollarSign className="" /> },
    ];
const reseñas = [
  {
    nombre: "Camila",
    fecha: "Hace 3 semanas",
    noches: 6,
    texto: "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  },
  {
    nombre: "Nazario",
    fecha: "Hace 4 meses",
    noches: 6,
    texto: "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  },
  {
    nombre: "Leandro",
    fecha: "Hace 3 meses",
    noches: 5,
    texto: "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  },
  {
    nombre: "Kauan",
    fecha: "Hace 3 años",
    noches: 2,
    texto: "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  },
  {
    nombre: "Rodrigo",
    fecha: "Hace 3 semanas",
    noches: 4,
    texto: "Me encantó el ambiente, muy reservado y con una vista muy hermosa. Un lugar muy tranquilo para pasar la semana y alejarse de las prisas. Marcela siempre fue muy atenta, inclus…",
  },
  {
    nombre: "Gabriel",
    fecha: "Hace 2 semanas",
    noches: 3,
    texto: "Mi esposa y yo elegimos esta casa de campo para pasar nuestra luna de miel, y no podría ser un lugar más perfecto, un lugar súper privado y totalmente equipado para poder…",
  },
];
  return (
    <main>
       <section className="ml-30 mr-50 pr-30" id="hero">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl">
            Casa quinta en Ezeiza, Buenos Aires
          </h1>
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
              src={"/quinta.jpg"}
              alt="Casa quinta principal"
              className="w-full h-[500px] object-cover rounded-l-xl"
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            <img
              src={"/quinta.jpg"}
              alt={`Vista 1`}
              className="w-96 h-full object-cover"
            />
            <img
              src={"/quinta.jpg"}
              alt={`Vista 2`}
              className="w-96 h-full object-cover rounded-tr-xl"
            />
            <img
              src={"/quinta.jpg"}
              alt={`Vista 3`}
              className="w-96 h-full object-cover"
            />
            <img
              src={"/quinta.jpg"}
              alt={`Vista 4`}
              className="w-96 h-full object-cover rounded-br-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">Galvez 657, Barrio cerrado, Los Rosales</h2>
            <p className="text-lg font-light">
              10 huéspedes - 4 dormitorios - 8 camas - 3 baños
            </p>
          </div>
        </div>
      </section>
      <div className="mx-5 mt-5">
        <Separator color="bg-gray-300" />
      </div>
      <section className="mx-30 flex justify-between gap-20 py-6" id="quinta_info">
        <div className="w-1/2 space-y-6">
          {/* Calificaciones y anfitrión */}
          <div className="flex flex-col items-start pr-30 gap-10">
            <div className="flex items-center px-10 py-2 rounded-3xl bg-green-600">
              <div className="flex flex-col items-center space-x-2 px-7">
                <span className="text-white">4,5</span>
                <div className="flex gap-1 items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star className="w-3 text-white" key={i} />
                  ))}
                </div>
              </div>
              <p className="text-gray-500">|</p>
              <div className="text-white cursor-pointer flex flex-col items-center px-7">
                <p>72 opiniones</p>
                <small className="underline cursor-pointer">
                  Ver opiniones
                </small>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/avatar.png"
                alt="Avatar anfitrión"
                className="rounded-full w-10 h-10"
              />
              <div className="text-sm">
                <p className="font-semibold">Anfitrión: Valentín</p>
                <p className="text-gray-500">1 año como anfitrión</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="pr-30">
            <Separator color="bg-gray-300" />
            <p className="text-sm text-gray-700 py-10">
              Lorem ipsum dolor sit amet consectetur. Vitae nibh velit vel
              tortor. Condimentum consequat mauris faucibus sit et sed nec
              varius justo. Massa sed malesuada egestas habitant proin id
              aliquam pellentesque. Ac natoque eros maecenas purus dui dui.
            </p>
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

          {/* Calendario (maquetado estático) */}
          <div>
            <h3 className="font-semibold mb-2">
              Modificar tu ingreso y salida
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Estadía mínima 2 noches
            </p>
            <Calendar />
          </div>
        </div>
        {/* Reservar derecha */}
        <div className="rounded-xl bg-white shadow-md shadow-black/50 py-6 px-12 flex top-22 flex-col md:sticky h-fit">
          <p className="text-2xl text-center font-semibold mb-5">
            USD 1.000 <span className="text-sm font-normal">por noche</span>
          </p>

          <div className="border-t border-x border-black/40 rounded-t-md divide-x grid grid-cols-2 overflow-hidden">
            <div className="flex flex-col justify-center items-center py-1 px-10 text-sm">
              <p className="text-black text-sm font-semibold">
                Fecha de ingreso
              </p>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-medium text-gray-700">11/03/2025</p>
                <CalendarDays className="w-4" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center py-1 px-10 text-sm">
              <p className="text-black text-sm font-semibold">
                Fecha de salida
              </p>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-medium text-gray-700">13/03/2025</p>
                <CalendarDays className="w-4" />
              </div>
            </div>
          </div>

          <div className="border border-black/40 rounded-b-md p-2 text-sm">
            <p className="text-black font-semibold">Cantidad de Huéspedes</p>
            <select className="w-1/2" name="huespedes">
                <option value="1">1 Huesped</option>
                <option value="2">2 Huespedes</option>
                <option value="3">3 Huespedes</option>
            </select>
          </div>

          <div className="text-sm space-y-1 flex flex-col gap-2 my-5 text-gray-700">
            <div className="flex justify-between">
              <span>USD 1.000 por 1 noche</span>
              <span className="text-black font-semibold">USD 1.000</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de servicio</span>
              <span className="text-black font-semibold">USD 119</span>
            </div>
            <div className="flex justify-between font-semibold py-5 border-t border-gray-400">
              <span>Total</span>
              <span className="text-black">USD 1.119</span>
            </div>
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Reservar
          </button>
        </div>
      </section>
      <div className="mx-5">
        <Separator color="bg-gray-300" />
      </div>
        <section className="mx-30 px-4 py-8 space-y-8" id="opinions">
      {/* Puntuación general */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center text-yellow-500">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className="w-5 h-5" />
          ))}
          <StarHalf className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold">4,5</p>
      </div>

      {/* Categorías */}
      <CategorySection categorias={categorias} />

      {/* Reseñas */}
      <div className="grid md:grid-cols-2 place-items-center gap-6">
        {reseñas.map((resena, i) => (
          <div key={i} className="border-b pb-4 max-w-xl space-y-1 text-sm text-gray-800">
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
                    <p className=" text-gray-500"> Estadia de {resena.noches} noches</p>
                </div>
              </div>
            </div>
            <p className="text-black">{resena.texto}</p>
            <button className="text-black font-semibold text-sm underline mt-1">Mostrar más</button>
          </div>
        ))}
      </div>

      <div className="text-start">
        <button className="border border-gray-400 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100">
          Ver más de lo que ofrece
        </button>
      </div>
      </section>
      <div className="mx-5">
        <Separator color="bg-gray-300" />
      </div>
      <div className="mx-5">
        <Separator color="bg-gray-300" />
      </div>
      <section className="mx-30 my-5" id="map">
        <div>
            <h3>Ubicación del hospedaje</h3>
            <p className="text-gray-500">Ezeiza, Buenos Aires</p>
        </div>
        <img src="/map.png" alt="mapa de zona" className="w-full mx-auto max-w-7xl mt-5 h-full object-cover rounded-xl" />
      </section>
      <div className="mx-5">
        <Separator color="bg-gray-300" />
      </div>
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
                <p className="font-semibold">Anfitrión: Valentín</p>
            </div>
          <div className="flex flex-col justify-between gap-10 text-center">
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
          </div>
        </div>

        {/* Información y contacto */}
        <div className="flex-1 flex flex-col justify-center gap-10 text-sm text-gray-800">
          <div className="flex items-start flex-col gap-2">
            <h3 className="font-semibold">Valentín es un gran Anfitrión</h3>
            <p>
              Esto lo confirma que su puntuación es superior a 4,00, un promedio por alto de la media que se asegura que los huéspedes tengan una experiencia gratificante en su estadía.
            </p>
          </div>

          <div className="flex items-start flex-col gap-2">
            <h3 className="font-semibold">Contacto con el Anfitrión</h3>
            <p>Índice de respuesta: <span className="font-medium">100%</span></p>
            <p>Responde en el mismo día de la consulta</p>
          </div>

          <button className="bg-green-600 max-w-xs cursor-pointer hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition">
            Ponerse en contacto
          </button>
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
                Por seguridad, recomendamos siempre usar la página oficial de ZonaQuintas a la hora de transferir dinero y comunicarte con los anfitriones.
            </p>
        </div>
      </div>
      </section>
      <div className="mx-5">
        <Separator color="bg-gray-300" />
      </div>
      <section className="mx-30 px-4 py-8 space-y-6 text-sm text-gray-800" id="norms">
      <h2 className="text-xl font-semibold">Qué tenés que saber</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Normas de la casa */}
        <div className="space-y-2">
          <h3 className="font-semibold">Normas de la casa</h3>
          <ul className="space-y-1">
            <li>Check-in a partir de las 4:00 p. m.</li>
            <li>Check-out antes de las 1:00 p. m.</li>
            <li>2 huéspedes como máximo</li>
          </ul>
          <button className="text-black underline flex items-center hover:text-gray-700">
            Mostrar más <span className="ml-1">›</span>
          </button>
        </div>

        {/* Seguridad y propiedad */}
        <div className="space-y-2">
          <h3 className="font-semibold">Sobre la seguridad y la propiedad</h3>
          <ul className="space-y-1">
            <li>No hay un detector de monóxido de carbono</li>
            <li>No hay un detector de humo</li>
            <li>Pileta/jacuzzi sin rejas ni puerta con llave</li>
          </ul>
          <button className="text-black underline flex items-center hover:text-gray-700">
            Mostrar más <span className="ml-1">›</span>
          </button>
        </div>

        {/* Política de cancelación */}
        <div className="space-y-2">
          <h3 className="font-semibold">Política de cancelación</h3>
          <ul className="space-y-1">
            <li>Esta reserva no es reembolsable.</li>
            <li>
              Consultá la política completa del anfitrión para obtener más
              información.
            </li>
          </ul>
          <button className="text-black underline flex items-center hover:text-gray-700">
            Mostrar más <span className="ml-1">›</span>
          </button>
        </div>
      </div>
      </section>
    </main>
  );
}
