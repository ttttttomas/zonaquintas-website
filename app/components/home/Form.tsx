'use client'
import Lupa from "../icons/Lupa";

export default function Form() {

    const handleSubmit = () => {
    console.log();
  };

  return (
    <form className="flex md:flex-row flex-col justify-center items-center gap-5 md:gap-8 mb-5 md:mb-10">
      <section className="flex md:flex-row flex-col border-black/30 border cursor-pointer w-max bg-white rounded-4xl">
        <div className="hover:bg-black/10 rounded-4xl flex flex-col focus:bg-black md:pl-10 py-5 items-center md:items-start">
          <p className="font-medium">Lugar</p>
          <input
            type="text"
            className="text-black/40 md:text-start text-center focus:outline-0"
            placeholder="Elegi aca tu destino"
          />
        </div>

        <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl items-center md:items-start">
          <p className="font-medium">Fecha de ingreso</p>
          <input
            type="text"
            className="text-black/40 md:text-start text-center focus:outline-0"
            placeholder="¿Desde cuando?"
          />
        </div>

        <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl items-center md:items-start">
          <p className="font-medium">Fecha de egreso</p>
          <input
            type="text"
            className="text-black/40 md:text-start text-center focus:outline-0"
            placeholder="¿Hasta cuando?"
          />
        </div>

        <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl pr-5 items-center md:items-start">
          <p className="font-medium">Huespedes</p>
          <input
            type="text"
            className="text-black/40 md:text-start text-center focus:outline-0"
            placeholder="Cantidad de personas"
          />
        </div>
      </section>
      <button
      onSubmit={handleSubmit}
        className="border-black/30 bg-white border p-2 rounded-4xl cursor-pointer"
        type="submit">
        <Lupa />
      </button>
    </form>
  );
}
