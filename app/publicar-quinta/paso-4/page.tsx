'use client'
import SecondSeparator from "@/app/components/SecondSeparator";
import { useState } from "react";

export default function Paso1Page() {
    const [popUp, setPopUp] = useState(false)
    const handleClick = () => {
        setPopUp(true)
    }

    const HandleReturn = () => {
        setPopUp(false)
    }

    const handleSubmit = () => {
        setPopUp(false)
        console.log("Publicación enviada.")
        
    }
  return (
    <main className="flex flex-col relative items-center pb-20 justify-center">
      <div className="absolute publicar2 h-1/2 z-0 w-full">
      <img className="mx-auto" src="/logo.png" alt="" />
      </div>
      <h1 className="text-center font-semibold text-xl">
        Previsualiza y confirmá todos tus datos
      </h1>
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          1
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Cantidad de ambientes: <b className="italic">5</b>
          </li>
          <li>
            Caracteristicas: <b className="italic">Limpieza, Cocina, Kitchen</b>
          </li>
          <li>
            Cantidad de m2: <b className="italic">40</b>
          </li>
          <li>
            Cantidad de huéspedes permitidos: <b className="italic">10</b>
          </li>
        </ul>
      </section>
      <SecondSeparator />
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          2
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Titulo:{" "}
            <b className="italic">Casa quinta en Ezeiza, Buenos Aires</b>
          </li>
          <li className="flex items-center gap-2">
            <p>Imagenes:</p>
            <div className="flex gap-3">
              <img
                src="/quinta.jpg"
                alt="foto de la quinta"
                className="size-14 object-cover rounded-xl"
              />
              <img
                src="/quinta.jpg"
                alt="foto de la quinta"
                className="size-14 object-cover rounded-xl"
              />
              <img
                src="/quinta.jpg"
                alt="foto de la quinta"
                className="size-14 object-cover rounded-xl"
              />
              <img
                src="/quinta.jpg"
                alt="foto de la quinta"
                className="size-14 object-cover rounded-xl"
              />
              <img
                src="/quinta.jpg"
                alt="foto de la quinta"
                className="size-14 object-cover rounded-xl"
              />
            </div>
          </li>
          <li>
            Ubicación: <b className="italic">Galvez 657, Los Rosales</b>
          </li>
        </ul>
      </section>
      <SecondSeparator />
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          3
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Precio por día: <b className="italic"> USD 1.000</b>
          </li>
          <li>
            Precio por semana: <b className="italic"> USD 5.000</b>
          </li>
          <li>
            Precio por mes: <b className="italic"> USD 10.000</b>
          </li>
        </ul>
      </section>
      <button onClick={handleClick} className={`bg-primaryDark w-8/10 z-20 py-2 text-white mx-30 text-xl font-bold rounded-lg cursor-pointer`}>
        Confimar publicación
      </button>
      {popUp && (
        <div className="top-0 justify-start z-20 items-center fixed bottom-0 left-0 right-0 bg-tertiary text-white rounded-2xl gap-8 flex flex-col my-auto w-[550px] h-70 mx-auto p-6 shadow-xl">
                <p className="text-black font-bold text-xl text-nowrap">¿Estás seguro de que deseas enviar tu publicación?</p>
                <small className="text-black text-center text-lg">Esta será enviada a revisión y próximamente se te notificará de si es aprobada o denegagada.</small>
                <small className="text-black text-center text-lg">Verifica que todos los datos sean correctos.</small>
                <div className="flex justify-between gap-5 w-full px-10">
                    <button onClick={HandleReturn} className="border-black cursor-pointer border py-1 rounded-xl bg-white text-primary w-1/2">Volver</button>
                    <button onClick={handleSubmit} className="border border-primaryDark cursor-pointer py-1 bg-primaryDark text-wheite rounded-xl w-1/2">Confirmar publicación</button>
                </div>
        </div>
)}
    </main>
  );
}
