"use client";
import { useState } from "react";
import Add from "./icons/Add";

export default function AddLanguage() {
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState([]);

  
  const toggleLanguage = (lang) => {
    setSelected((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

    const removeLanguage = (lang) => {
    setSelected((prev) => prev.filter((l) => l !== lang));
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
    <section className="relative flex flex-col gap-2 w-2/3 mx-auto">
      <input
        type="text"
        placeholder="Idiomas"
        className="w-full border-gray-200 border-2 rounded-md py-1 px-2"
      />
      <button
        type="button"
        onClick={() => setShowPopup(!showPopup)}
        className="absolute right-0 top-5 transform -translate-y-1/2 text-white rounded-full p-1.5">
        <Add />
      </button>
            {/* lista de idiomas seleccionados */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((lang) => (
            <div
              key={lang}
              className="flex items-center gap-2 justify-between bg-black text-white px-1 py-1 rounded-md border shadow-sm"
            >
              {lang}
              <div onClick={() => removeLanguage(lang)}>
                <button className="text-black bg-white font-semibold rounded-sm px-2 cursor-pointer">X</button>
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
                className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200 transition">
                {lang}
                {selected.includes(lang) ? (
                  <Add className="text-green-600" />
                ) : (
                  <Add />
                )}
              </button>
            ))}
          <button onClick={() => setShowPopup(false)} className="text-3xl cursor-pointer rounded-full">✅</button>

          </div>
        </div>
      )}
    </section>
  );
}
