"use client";
import Link from "next/link";
// import { useState } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Paso3Page() {
  //   const [startDate, setStartDate] = useState(new Date());
  //   const [endDate, setEndDate] = useState(null);
  //   const onChange = (dates) => {
  //     const [start, end] = dates;
  //     setStartDate(start);
  //     setEndDate(end);
  //   };
  return (
    <main className="flex items-center justify-between mx-20">
      <section className="flex flex-col items-start justify-center w-1/3">
        <h1 className="font-semibold text-xl mb-5">
          Brindanos la ultima información para tu publicación
        </h1>
        <form className="w-full flex flex-col gap-5 rounded-xl">
          {/* <input
            placeholder="Marca la disponibilidad de tu quinta*"
            className="bg-white p-2 rounded-lg"
            type="text"
          />
          <div className="flex justify-between">
            <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            withPortal

          />
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            withPortal
          />
          </div> */}
          <div className="w-full flex bg-white rounded-lg">
            <input
              placeholder="Ponele precio a tu quinta (Precio por dia)*"
              className=" p-2 flex-1"
              type="text"
            />
            <select name="" id="">
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div className="w-full flex bg-white rounded-lg">
            <input
              placeholder="Precio por quincena (opcional)*"
              className=" p-2 flex-1"
              type="text"
            />
            <select name="" id="">
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div className="w-full flex bg-white rounded-lg">
          <input
            placeholder="Precio por mes (opcional)*"
              className=" p-2 flex-1"
            type="text"
          />
          <select name="" id="">
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
          </div>
          <Link
            href={"/publicar-quinta/paso-4"}
            className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">
            Continuar
          </Link>
        </form>
      </section>
      <img src="/paso3.png" className="h-90" alt="paso 3" />
    </main>
  );
}
