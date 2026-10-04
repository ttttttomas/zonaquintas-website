"use client";
import Bedroom from "../icons/Bedroom";
import Amb from "../icons/Amb";
import FiltersIcon from "../icons/Filters";
import Bathroom from "../icons/Bathroom";
import Arrow from "../Arrow";
import { useEffect, useRef, useState } from "react";
import { useFilters } from "@/app/context/ContextFilters";
import AllFilters from "./AllFilters";

export default function Filters() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const { filters, setFilters } = useFilters();

  const [habs, setHabs] = useState<number>(0);
  const [ambs, setAmbs] = useState<number>(0);
  const [baths, setBaths] = useState<number>(0);

  const habsRef = useRef<HTMLDivElement>(null);
  const ambsRef = useRef<HTMLDivElement>(null);
  const bathsRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (habsRef.current && !habsRef.current.contains(e.target as Node)) {
        setOpen1(false);
      }
      if (ambsRef.current && !ambsRef.current.contains(e.target as Node)) {
        setOpen2(false);
      }
      if (bathsRef.current && !bathsRef.current.contains(e.target as Node)) {
        setOpen3(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen1 = () => setOpen1(!open1);
  const handleOpen2 = () => setOpen2(!open2);
  const handleOpen3 = () => setOpen3(!open3);
  const handleOpen4 = () => setOpen4(!open4);

  useEffect(() => {
    handleChangeFilters({
      target: {
        name: "habs",
        value: String(habs),
      },
    });
    handleChangeFilters({
      target: {
        name: "ambs",
        value: String(ambs),
      },
    });
    handleChangeFilters({
      target: {
        name: "baths",
        value: String(baths),
      },
    });
  }, [habs, ambs, baths]);

  const handleChangeFilters = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="relative flex flex-wrap justify-center items-center gap-6 md:gap-12 lg:gap-16 lg:gap-y-10 text-sm md:text-base mb-7 mt-3 w-full max-w-4xl mx-auto px-4">
      {/* Habitaciones */}
      <div ref={habsRef} className="flex relative items-center rounded-xl gap-2 py-1 px-2">
        <Bedroom />
        <p className="underline">Min: {habs}</p>
        <p>Habitaciones</p>
        <Arrow handleClick={handleOpen1} />
        {open1 && (
          <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 z-50 w-[260px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Habitaciones</p>
                <p className="text-xs text-gray-400">¿Cuántas?</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHabs((prev) => Math.max(0, prev - 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors disabled:opacity-30"
                  disabled={habs <= 0}
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                  {habs}
                </span>
                <button
                  type="button"
                  onClick={() => setHabs((prev) => Math.min(30, prev + 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ambientes */}
      <div ref={ambsRef} className="flex relative items-center rounded-xl gap-2 py-1 px-2">
        <Amb />
        <p className="underline">Min: {filters.amb}</p>
        <p>Ambientes</p>
        <Arrow handleClick={handleOpen2} />
        {open2 && (
          <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 z-50 w-[260px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Ambientes</p>
                <p className="text-xs text-gray-400">¿Cuántos?</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAmbs((prev) => Math.max(0, prev - 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors disabled:opacity-30"
                  disabled={ambs <= 0}
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                  {ambs}
                </span>
                <button
                  type="button"
                  onClick={() => setAmbs((prev) => Math.min(30, prev + 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Baños */}
      <div ref={bathsRef} className="flex relative items-center rounded-xl gap-2 py-1 px-2">
        <Bathroom />
        <p className="underline">Min: {baths}</p>
        <p>Baños</p>
        <Arrow handleClick={handleOpen3} />
        {open3 && (
          <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 z-50 w-[260px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Baños</p>
                <p className="text-xs text-gray-400">¿Cuántos?</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBaths((prev) => Math.max(0, prev - 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors disabled:opacity-30"
                  disabled={baths <= 0}
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                  {baths}
                </span>
                <button
                  type="button"
                  onClick={() => setBaths((prev) => Math.min(30, prev + 1))}
                  className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Todos los filtros */}
      <div
        onClick={handleOpen4}
        className="flex cursor-pointer hover:bg-black/10 py-1.5 px-3 transition-all rounded-lg items-center gap-2"
      >
        <FiltersIcon />
        <p className="font-medium">Todos los filtros</p>
      </div>

      {open4 && (
        <AllFilters handleClick={() => setOpen4(false)} />
      )}
    </section>
  );
}
