"use client";
import { useState } from "react";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_ES = ["Lu.", "Ma.", "Mi.", "Ju.", "Vi.", "Sa.", "Do."];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d;
}

function buildGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  let startOffset = first.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Month grid ────────────────────────────────────────────────────────────────
interface MonthGridProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (date: Date) => void;
}

function MonthGrid({ year, month, checkIn, checkOut, onSelect }: MonthGridProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = buildGrid(year, month);

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map((d) => (
          <span key={d} className="text-center text-[11px] font-medium text-gray-400 pb-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />;

          const isPast = date < today;
          const isDisabled = isPast;
          const isCheckIn = checkIn && isSameDay(date, checkIn);
          const isCheckOut = checkOut && isSameDay(date, checkOut);
          const isSelected = isCheckIn || isCheckOut;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;

          let cellCls =
            "relative h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm transition-colors select-none";

          if (isDisabled) {
            cellCls += " text-gray-300 cursor-not-allowed";
          } else if (isSelected) {
            cellCls += " bg-primaryDark text-white font-semibold cursor-pointer";
          } else if (inRange) {
            cellCls += " bg-black/20 text-gray-800 cursor-pointer";
          } else {
            cellCls += " text-gray-800 hover:bg-gray-100 cursor-pointer";
          }

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(date)}
              className={cellCls}
              title={date.toLocaleDateString("es-AR")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────
type Props = {
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export default function Calendar({ onDatesChange }: Props) {
  const now = new Date();
  const [pivotMonth, setPivotMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [phase, setPhase] = useState<"idle" | "selecting">("idle");

  const handleSelect = (date: Date) => {
    if (phase === "idle" || (phase === "selecting" && checkIn && date <= checkIn)) {
      setCheckIn(date);
      setCheckOut(null);
      setPhase("selecting");
      onDatesChange?.(date, null);
    } else {
      // Validar estadía mínima de 2 noches
      if (checkIn && date.getTime() - checkIn.getTime() < 86400000 * 2) {
        toast.error("La estadía mínima es de 2 noches");
        setCheckIn(date);
        setCheckOut(null);
        setPhase("selecting");
        onDatesChange?.(date, null);
      } else {
        setCheckOut(date);
        setPhase("idle");
        onDatesChange?.(checkIn, date);
      }
    }
  };

  const prevMonth = () => setPivotMonth((m) => addMonths(m, -1));
  const nextMonth = () => setPivotMonth((m) => addMonths(m, 1));

  return (
    <div className="select-none w-full">
      {/* Header: flechas + nombre del mes */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <p className="text-sm font-semibold text-gray-800">
          {MONTHS_ES[pivotMonth.getMonth()]} {pivotMonth.getFullYear()}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Un solo mes */}
      <MonthGrid
        year={pivotMonth.getFullYear()}
        month={pivotMonth.getMonth()}
        checkIn={checkIn}
        checkOut={checkOut}
        onSelect={handleSelect}
      />

      {/* Hint mientras se espera el checkout */}
      {phase === "selecting" && (
        <p className="text-xs text-gray-400 mt-3">
          Ahora selecciona la fecha de salida (minimo 2 noches)
        </p>
      )}
    </div>
  );
}

