"use client";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import Lupa from "../icons/Lupa";
import { Suspense, useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useFilters } from "@/app/context/ContextFilters";
import { ProductsServices } from "@/app/services/ProductsServices";
import FormSkeleton from "./FormSkeleton";

interface CityAddress {
  address: string;
  city: string;
}

export default function Form() {
  const { filters, setFilters } = useFilters();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Ciudad
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cities, setCities] = useState<CityAddress[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Huéspedes
  const [viewGuests, setViewGuests] = useState(false);
  const [guests, setGuests] = useState<number>(1);

  const cityRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sincronizar estado local con el contexto de filtros al montar o cambiar filtros
  useEffect(() => {
    if (filters.place) {
      setSelectedCity(filters.place);
      setCitySearch(filters.place);
    }
    if (filters.guests) {
      setGuests(filters.guests);
    }
    if (filters.startDate) {
      setStartDate(new Date(filters.startDate));
    }
    if (filters.endDate) {
      setEndDate(new Date(filters.endDate));
    }
  }, [filters]);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setViewGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar ciudades del endpoint
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const data = await ProductsServices.getAddressFromQuintas();
        if (data && Array.isArray(data)) {
          // Filtrar el primer elemento tipo placeholder {"address":"string","city":"string"}
          const validCities = data.filter(
            (item: CityAddress) =>
              item.city && item.city !== "string" && item.address !== "string"
          );
          // Deduplicar por city
          const unique = validCities.filter(
            (item: CityAddress, idx: number, arr: CityAddress[]) =>
              arr.findIndex((c: CityAddress) => c.city === item.city) === idx
          );
          setCities(unique);
        }
      } catch (err) {
        console.error("Error cargando ciudades:", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Ciudades filtradas según lo que escribe el usuario
  const filteredCities = cities.filter((c) =>
    c.city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setCityDropdownOpen(false);
  };

  const handleClearCity = () => {
    setSelectedCity(null);
    setCitySearch("");
    setCityDropdownOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (selectedCity) params.set("place", selectedCity);
    if (guests > 0) params.set("guests", String(guests));
    if (startDate) params.set("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) params.set("endDate", endDate.toISOString().split("T")[0]);

    // También actualizamos el contexto para que los filtros de la barra se sincronicen
    setFilters((prev: any) => ({
      ...prev,
      place: selectedCity || null,
      guests: guests > 0 ? guests : null,
    }));

    router.push(`/quintas?${params.toString()}`);
  };

  return (
    <Suspense fallback={<FormSkeleton />}>
      <form
        onSubmit={handleSubmit}
        className="flex xl:pl-20 md:flex-row flex-col justify-center items-center gap-5 md:gap-8 mb-5 md:mb-10"
      >
        <section
          className={`md:flex rounded-2xl divide-x divide-gray-200 flex-row border border-black/20 cursor-pointer bg-white md:rounded-full shadow-md hover:shadow-lg transition-shadow`}
        >
          {/* ── CIUDAD ─────────────────────────────────────────── */}
          <div ref={cityRef} className="relative">
            <div
              onClick={() => {
                setCityDropdownOpen((prev) => !prev);
                if (!cityDropdownOpen) {
                  setCitySearch(selectedCity || "");
                }
              }}
              className={`hover:bg-black/5 w-[220px] rounded-l-full flex md:items-start items-center flex-col px-6 py-4 transition-all ${cityDropdownOpen ? "bg-black/5" : ""
                }`}
            >
              <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                Lugar
              </span>
              {selectedCity ? (
                <div className="flex items-center justify-between w-full gap-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {selectedCity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearCity();
                    }}
                    className="text-gray-400 hover:text-gray-700 text-xs shrink-0 ml-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-400">¿Dónde vas?</span>
              )}
            </div>

            {/* Dropdown de ciudades */}
            {cityDropdownOpen && (
              <div className="absolute top-[calc(100%+12px)] md:left-0 -left-13 z-50 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Campo de búsqueda */}
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      autoFocus
                      type="text"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setSelectedCity(null);
                      }}
                      placeholder="Buscar ciudad..."
                      className="bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                    />
                    {citySearch && (
                      <button
                        type="button"
                        onClick={() => setCitySearch("")}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de ciudades */}
                <div className="max-h-[260px] overflow-y-auto px-2 pb-3">
                  {loadingCities ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span className="text-sm">Cargando ciudades...</span>
                    </div>
                  ) : filteredCities.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">
                      No se encontraron ciudades
                    </div>
                  ) : (
                    <>
                      {!citySearch && (
                        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Destinos disponibles
                        </p>
                      )}
                      <ul>
                        {filteredCities.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelectCity(item.city)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${selectedCity === item.city
                              ? "bg-gray-100 font-semibold"
                              : "hover:bg-gray-50"
                              }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-900 font-medium">{item.city}</p>
                            </div>
                            {selectedCity === item.city && (
                              <svg className="w-4 h-4 text-green-500 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── FECHA IDA ───────────────────────────────────────── */}
          <DatePicker
            autoComplete="off"
            placeholderText="Check-in"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            startDate={startDate}
            withPortal
            name="startDate"
            customInput={
              <div className="flex flex-col md:items-start items-center w-full px-6 py-4 md:w-[160px] hover:bg-black/5 transition-all cursor-pointer">
                <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  Check-in
                </span>
                <span className={`text-sm ${startDate ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                  {startDate ? startDate.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "Agregar fecha"}
                </span>
              </div>
            }
          />

          {/* ── FECHA VUELTA ────────────────────────────────────── */}
          <DatePicker
            autoComplete="off"
            placeholderText="Check-out"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            endDate={endDate}
            withPortal
            name="endDate"
            customInput={
              <div className="flex flex-col md:items-start items-center w-full px-6 py-4 md:w-[160px] hover:bg-black/5 transition-all cursor-pointer">
                <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  Check-out
                </span>
                <span className={`text-sm ${endDate ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                  {endDate ? endDate.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "Agregar fecha"}
                </span>
              </div>
            }
          />

          {/* ── HUÉSPEDES ───────────────────────────────────────── */}
          <div ref={guestsRef} className="relative">
            <div
              onClick={() => setViewGuests((prev) => !prev)}
              className={`hover:bg-black/5  items-center py-4 md:w-[170px] rounded-r-full flex flex-col transition-all ${viewGuests ? "bg-black/5" : ""
                }`}
            >
              <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                Huéspedes
              </span>
              <span className={`text-sm ${guests > 0 ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                {guests > 0 ? `${guests} huésped${guests > 1 ? "es" : ""}` : "Agregar"}
              </span>
            </div>

            {/* Dropdown huéspedes */}
            {viewGuests && (
              <div className="absolute top-[calc(100%+12px)] right-0 z-50 w-[260px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Huéspedes</p>
                    <p className="text-xs text-gray-400">¿Cuántos van?</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                      className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors disabled:opacity-30"
                      disabled={guests <= 1}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                      {guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((prev) => Math.min(30, prev + 1))}
                      className="w-8 cursor-pointer h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 hover:text-gray-900 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTÓN BUSCAR ────────────────────────────────────────── */}
        <button
          className="bg-[#28A728] hover:bg-[#22921E] text-white p-4 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
          type="submit"
        >
          <Lupa />
        </button>
      </form>
    </Suspense>
  );
}
