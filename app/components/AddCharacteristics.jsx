"use client";
import { useState } from "react";
import Add from "./icons/Add";

export default function AddLanguage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState([]);

    const handleClear = () => {
        setSelected([])
    }

  const toggleProp = (prop) => {
    setSelected((prev) =>
      prev.includes(prop) ? prev.filter((l) => l !== prop) : [...prev, prop]
    );
  };

  const removeProp = (prop) => {
    setSelected((prev) => prev.filter((l) => l !== prop));
  };

  const KITCHEN = ["Utensilios para cocinar", "Vajilla", "Freezer"];
  const PARKING = ["Estacionamiento techado"];
  const CLEANING = ["Lavarropas", "Cambio de toallas"];
  const BATHROOM = ["Toilettes", "Shampoo", "Toallas", "Secador de pelo"];

  const BEDROOM = ["Sabanas", "Mantas", "Almohadas"];
  const ENTERTAINMENT = [
    "Televisor",
    "Radio",
    "TV",
    "Cable",
    "Internet",
    "Jacuzzi",
    "Playroom",
    "Sofás",
  ];
  const ANOTHERS = [
    "Parrilla",
    "Estufa a gas",
    "Hogar",
    "Hamacas paraguayas",
    "Arboleda con buena sombra",
    "Cancha de fútbol",
    "Piscina",
    "Cancha de basquet",
    "Cancha de tenis",
    "Cancha de padel",
    "Hamacas",
    "Parlantes",
  ];
  return (
    <section className="bg-white flex flex-col p-2 rounded-lg gap-2 w-full mx-auto">
      <div className="relative">
        <input
        className="w-full"
          type="text"
          placeholder="Seleecciona las características de tu quinta*"
        />
        <button
          type="button"
          onClick={() => setShowPopup(!showPopup)}
          className="absolute -right-2 top-3.5 transform -translate-y-1/2 text-white rounded-full p-1.5">
          <Add />
        </button>
      </div>
      {/* lista de idiomas seleccionados */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((prop) => (
            <div
              key={prop}
              className="flex items-center gap-2 justify-between bg-black text-white px-1 py-1 rounded-md border shadow-sm">
              {prop}
              <div onClick={() => removeProp(prop)}>
                <button className="text-black bg-white font-semibold rounded-sm px-2 cursor-pointer">
                  X
                </button>
              </div>
            </div>
          ))}
      <button onClick={handleClear} className="cursor-pointer bg-primaryDark text-white py-2 rounded-lg font-bold px-5">Limpiar</button>
        </div>
      )}
      {showPopup && (
        <section className="absolute top-0 bottom-0 left-0 right-0 bg-gray-900 text-white rounded-2xl my-auto w-1/2 h-2/3 mx-auto p-6 shadow-xl z-10">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Seleccioná los caracteristicas de tu quinta
          </h3>
          <div className="grid grid-cols-3 place-content-center place-items-start">
            <div>
              <p className="text-primary text-center text-lg">
                Caracteristicas básicas
              </p>
              <p className="text-white text-center my-3">Habitaciones</p>

              <div className="flex flex-wrap gap-3 justify-center">
                {BEDROOM.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
                <p className="text-white">Articulos de limpieza personal</p>
                {BATHROOM.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
                <p className="text-white">Articulos de limpieza general</p>
                {CLEANING.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-primary text-center text-lg">
                Caracteristicas adicionales
              </p>
              <p className="text-white text-center my-3">Cocina</p>

              <div className="flex flex-wrap gap-3 justify-center">
                {KITCHEN.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
                <p className="text-white w-full text-center">Entretenimiento</p>
                {ENTERTAINMENT.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
                <p className="text-white">Estacionamiento</p>
                {PARKING.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-primary text-center text-lg">
                Otras caracteristicas
              </p>
              <div className="flex flex-wrap gap-3 mt-5 justify-center">
                {ANOTHERS.map((prop) => (
                  <button
                    type="button"
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                    {prop}
                    {selected.includes(prop) ? (
                      <svg
                        className="cursor-pointer"
                        height="30"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_dd_71_5304)">
                          <rect
                            x="3"
                            width="30"
                            height="30"
                            rx="7.35387"
                            fill="black"
                          />
                        </g>
                        <path
                          d="M17.5 13.5V16.5M25 15.0148H10"
                          stroke="white"
                          stroke-width="3"
                        />
                        <defs>
                          <filter
                            id="filter0_dd_71_5304"
                            x="0.325864"
                            y="0"
                            width="35.3483"
                            height="35.3483"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB">
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_71_5304"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2.67414" />
                            <feGaussianBlur stdDeviation="1.33707" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="effect1_dropShadow_71_5304"
                              result="effect2_dropShadow_71_5304"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect2_dropShadow_71_5304"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    ) : (
                      <Add className="text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <svg
            onClick={() => setShowPopup(false)}
            className="mx-auto cursor-pointer"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 41.25C32.6315 41.25 41.25 32.6315 41.25 22C41.25 11.3685 32.6315 2.75 22 2.75C11.3685 2.75 2.75 11.3685 2.75 22C2.75 32.6315 11.3685 41.25 22 41.25Z"
              fill="#4CAF50"
            />
            <path
              d="M31.7174 13.3838L19.2508 25.8505L14.1174 20.7171L11.5508 23.2838L19.2508 30.9838L34.2841 15.9505L31.7174 13.3838Z"
              fill="#CCFF90"
            />
          </svg>
        </section>
      )}
    </section>
  );
}
