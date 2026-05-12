"use client";
import Bedroom from "../icons/Bedroom";
import Amb from "../icons/Amb";
import FiltersIcon from "../icons/Filters";
import Bathroom from "../icons/Bathroom";
import Arrow from "../Arrow";
import { useState } from "react";
import { useFilters } from "@/app/context/ContextFilters";
import AllFilters from "./AllFilters";

export default function Filters() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const { filters, setFilters } = useFilters();
  const handleOpen1 = () => {
    setOpen1(!open1);
  };

  const handleOpen2 = () => {
    setOpen2(!open2);
  };

  const handleOpen3 = () => {
    setOpen3(!open3);
  };

  const handleOpen4 = () => {
    setOpen4(!open4);
  };

  const handleChangeFilters = (e: any) => {
    const { name, value } = e.target;
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <section className="relative flex flex-col items-start md:flex-row mb-7 mt-3 w-max md:gap-32 md:text-md text-sm gap-5 mx-auto">

      <div className="flex items-center rounded-xl gap-2">
        <Bedroom />
        <p className="underline">Min: {filters.bedrooms}</p>
        <p>Habitaciones</p>
        <Arrow handleClick={handleOpen1} />
        {open1 && (
          <ul className="flex gap-4 absolute text-white font-semibold px-3 rounded-xl bg-[#28A728] md:top-10 top-8 left-12 text-lg">
            {[1, 2, 3, 4, 5].map((num) => (
              <li
                key={num}
                onClick={() => (
                  setFilters((prev: any) => ({
                    ...prev,
                    bedrooms: num,
                  })),
                  setOpen1(false)
                )}
                className={`cursor-pointer hover:scale-115 ${filters.bedrooms === num ? "font-semibold text-black" : ""
                  }`}>
                {num}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex relative items-center gap-2">
        <Amb />
        <p className="underline">Min: {filters.amb}</p>
        <p>Ambientes</p>
        <Arrow handleClick={handleOpen2} />
        {open2 && (
          <ul className="flex gap-4 absolute text-white font-semibold px-3 rounded-xl bg-[#28A728] md:top-10 top-8 left-12 text-lg">
            {[1, 2, 3, 4, 5].map((num) => (
              <li
                key={num}
                onClick={() => (
                  setFilters((prev: any) => ({
                    ...prev,
                    amb: num,
                  })),
                  setOpen2(false)
                )}
                className={`cursor-pointer hover:scale-115 ${filters.amb === num ? "font-semibold text-black" : ""
                  }`}>
                {num}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex relative items-center gap-2">
        <Bathroom />
        <p className="underline">Min: {filters.bathrooms}</p>
        <p>Baños</p>
        <Arrow handleClick={handleOpen3} />
        {open3 && (
          <ul className="flex gap-4 absolute text-white font-semibold px-3 rounded-xl bg-[#28A728] md:top-10 top-8 left-12 text-lg">
            {[1, 2, 3, 4, 5].map((num) => (
              <li
                key={num}
                onClick={() => (
                  setFilters((prev: any) => ({
                    ...prev,
                    bathrooms: num,
                  })),
                  setOpen3(false)
                )}
                className={`cursor-pointer hover:scale-115 ${filters.bathrooms === num ? "font-semibold text-black" : ""
                  }`}>
                {num}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        onClick={handleOpen4}
        className="flex cursor-pointer hover:bg-black/10 py-2 transition-all rounded-lg items-center gap-2">
        <FiltersIcon />
        <p>Todos los filtros</p>
      </div>
      {open4 && (
        <AllFilters handleClick={() => setOpen4(false)} />
      )}
    </section>
  );
}
