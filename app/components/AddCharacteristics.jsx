"use client";
import { useState } from "react";

// ── Íconos inline compactos ───────────────────────────────────────────────────
const IconAdd = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect width="18" height="18" rx="4" fill="#111" />
    <path d="M9 5v8M5 9h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconMinus = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect width="18" height="18" rx="4" fill="#111" />
    <path d="M5 9h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-between gap-2 pl-3 pr-1.5 py-1 rounded-lg text-sm font-medium cursor-pointer select-none transition-all duration-150 border",
        active
          ? "bg-white border-emerald-400 text-black ring-1 ring-emerald-400"
          : "bg-white border-neutral-200 text-black hover:border-neutral-400",
      ].join(" ")}
    >
      <span>{label}</span>
      {active ? <IconMinus /> : <IconAdd />}
    </button>
  );
}

// ── SubSection ────────────────────────────────────────────────────────────────
function SubSection({ title, items, selected, toggle }) {
  return (
    <div className="mb-4">
      <p className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-2 text-center">
        {title}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map((item) => (
          <Chip
            key={item}
            label={item}
            active={selected.includes(item)}
            onClick={() => toggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────
function Column({ title, sections, selected, toggle }) {
  return (
    <div className="flex flex-col px-4">
      <p className="text-primary text-base font-bold text-center mb-5">
        {title}
      </p>
      <div className="flex flex-col gap-2 divide-y divide-white/10">
        {sections.map(({ subtitle, items }) => (
          <div key={subtitle} className="pt-3 first:pt-0">
            <SubSection
              title={subtitle}
              items={items}
              selected={selected}
              toggle={toggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function AddCharacteristics({
  selected: controlledSelected,
  onChangeSelected,
} = {}) {
  const [showPopup, setShowPopup] = useState(false);
  const [internalSelected, setInternalSelected] = useState([]);

  const selected = controlledSelected ?? internalSelected;
  const setSelected = onChangeSelected
    ? (valOrFn) => {
        const next =
          typeof valOrFn === "function" ? valOrFn(selected) : valOrFn;
        onChangeSelected(next);
      }
    : setInternalSelected;

  const handleClear = () => setSelected([]);
  const toggleProp = (prop) =>
    setSelected((prev) =>
      prev.includes(prop) ? prev.filter((l) => l !== prop) : [...prev, prop]
    );
  const removeProp = (prop) =>
    setSelected((prev) => prev.filter((l) => l !== prop));

  // ── Datos ─────────────────────────────────────────────────────────────────
  const BEDROOM = ["Sabanas", "Mantas", "Almohadas"];
  const BATHROOM = ["Toilettes", "Shampoo", "Toallas", "Secador de pelo"];
  const CLEANING = ["Lavarropas", "Cambio de toallas"];
  const KITCHEN = ["Utensilios para cocinar", "Vajilla", "Freezer"];
  const ENTERTAINMENT = [
    "Televisor", "Radio", "TV", "Cable",
    "Internet", "Jacuzzi", "Playroom", "Sofás",
  ];
  const PARKING = ["Estacionamiento techado"];
  const ANOTHERS = [
    "Parrilla", "Estufa a gas", "Hogar", "Hamacas paraguayas",
    "Arboleda con buena sombra", "Cancha de fútbol", "Piscina",
    "Cancha de basquet", "Cancha de tenis", "Cancha de padel",
    "Hamacas", "Parlantes",
  ];

  const COLUMNS = [
    {
      title: "Características básicas",
      sections: [
        { subtitle: "Habitaciones", items: BEDROOM },
        { subtitle: "Artículos de limpieza personal", items: BATHROOM },
        { subtitle: "Artículos de limpieza general", items: CLEANING },
      ],
    },
    {
      title: "Características adicionales",
      sections: [
        { subtitle: "Cocina", items: KITCHEN },
        { subtitle: "Entretenimiento", items: ENTERTAINMENT },
        { subtitle: "Estacionamiento", items: PARKING },
      ],
    },
    {
      title: "Otras características",
      sections: [
        { subtitle: "Exterior y ocio", items: ANOTHERS },
      ],
    },
  ];

  return (
    <section className="flex flex-col gap-2 w-full">

      {/* ── Trigger ──────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-neutral-200 hover:border-primaryDark transition-colors text-left cursor-pointer"
      >
        <span className={selected.length > 0 ? "text-black text-sm" : "text-neutral-400 text-sm"}>
          {selected.length > 0
            ? `${selected.length} característica${selected.length !== 1 ? "s" : ""} seleccionada${selected.length !== 1 ? "s" : ""}`
            : "Seleccioná las características de tu quinta*"}
        </span>
        <span className="flex-shrink-0 bg-primaryDark text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-lg leading-none">
          +
        </span>
      </button>

      {/* ── Tags seleccionados ────────────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((prop) => (
            <span
              key={prop}
              className="inline-flex items-center gap-1 bg-neutral-800 text-white text-xs px-2.5 py-1 rounded-full"
            >
              {prop}
              <button
                type="button"
                onClick={() => removeProp(prop)}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors cursor-pointer ml-0.5"
              >
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer self-center ml-1"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />

          {/* Panel */}
          <div className="relative bg-[#2B2B2B] text-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden border border-white/10">

            {/* Cabecera */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold">Seleccioná las características de tu quinta</h3>
                {selected.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-0.5">
                    {selected.length} seleccionada{selected.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1L12 12M12 1L1 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Cuerpo con scroll */}
            <div className="overflow-y-auto flex-1 py-6">
              <div className="grid grid-cols-3 divide-x divide-white/10">
                {COLUMNS.map((col) => (
                  <Column
                    key={col.title}
                    title={col.title}
                    sections={col.sections}
                    selected={selected}
                    toggle={toggleProp}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-white/10 flex-shrink-0">
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-neutral-400 hover:text-white underline transition-colors cursor-pointer"
              >
                Limpiar selección
              </button>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 4L6.5 10.5L3 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Listo
                {selected.length > 0 && (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs leading-none">
                    {selected.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
