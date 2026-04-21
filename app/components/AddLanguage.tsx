"use client";
import { useState } from "react";
import Add from "./icons/Add";

export default function AddLanguage({ selected, setSelected }: any) {
  const [showPopup, setShowPopup] = useState(false);

  const toggleLanguage = (lang: string) => {
    setSelected((prev: string[]) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const removeLanguage = (lang: string) => {
    setSelected((prev: string[]) => prev.filter((l) => l !== lang));
  };

  const LANGUAGES = [
    "Español",
    "Inglés",
    "Portugués",
    "Francés",
    "Alemán",
    "Italiano",
    "Chino",
    "Japonés",
    "Coreano",
  ];
  return (
    <section className="relative flex flex-col gap-2 w-full mx-auto">
      <div className="flex gap-2 justify-center">
        <button
        className="w-full bg-black/70 flex justify-center items-center gap-4 text-white cursor-pointer rounded-lg py-2"
          type="button"
          onClick={() => setShowPopup(!showPopup)}
        >
          <p className="text-lg font-semibold">Idiomas</p>
          <Add className="cursor-pointer" />
        </button>
      </div>
      {/* lista de idiomas seleccionados */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((lang: string) => (
            <div
              key={lang}
              className="flex items-center gap-2 justify-between bg-primaryDark text-white px-1 py-1 rounded-md border shadow-sm"
            >
              {lang}
              <div onClick={() => removeLanguage(lang)}>
                <button className="text-black bg-white font-semibold rounded-sm px-2 cursor-pointer">
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div className="absolute top-16 left-0 right-0 bg-gray-900 text-white rounded-2xl p-6 shadow-xl z-10">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Seleccioná los idiomas que hablas
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition"
              >
                {lang}
                {selected.includes(lang) ? (
                  <Add className="text-green-600 cursor-pointer" />
                ) : (
                  <Add className="cursor-pointer" />
                )}
              </button>
            ))}
            <button
              onClick={() => setShowPopup(false)}
              className="text-3xl cursor-pointer rounded-full"
            >
              ✅
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
