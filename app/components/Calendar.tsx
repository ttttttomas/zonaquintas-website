"use client";
import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS_ES = ["Lu.", "Ma.", "Mi.", "Ju.", "Vi.", "Sá.", "Do."];

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

/** Returns array of Date | null for each cell in a 6-row × 7-col grid */
function buildGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  // Monday-based: 0=Mon … 6=Sun
  let startOffset = first.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Single month grid ─────────────────────────────────────────────────────────
interface MonthGridProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (date: Date) => void;
  /** If true, show the check-in day ghosted (used for the right calendar) */
  showGhostCheckIn?: boolean;
  minDate?: Date;
}

function MonthGrid({
  year, month, checkIn, checkOut, onSelect, showGhostCheckIn = false, minDate,
}: MonthGridProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = buildGrid(year, month);

  return (
    <div className="flex flex-col gap-0.5 min-w-[260px]">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map((d) => (
          <span key={d} className="text-center text-[11px] font-medium text-gray-400 pb-1">
            {d}
          </span>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) {
            return <span key={`empty-${i}`} />;
          }

          const isPast = date < today;
          const isBelowMin = minDate ? date < minDate : false;
          const isDisabled = isPast || isBelowMin;
          const isCheckIn = checkIn && isSameDay(date, checkIn);
          const isCheckOut = checkOut && isSameDay(date, checkOut);
          const isSelected = isCheckIn || isCheckOut;

          // Ghost: same day number as check-in, in the right calendar
          const isGhost =
            showGhostCheckIn &&
            checkIn &&
            date.getDate() === checkIn.getDate() &&
            !isCheckOut;

          // Range highlight
          const inRange =
            checkIn &&
            checkOut &&
            date > checkIn &&
            date < checkOut;

          let cellCls =
            "relative h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm transition-colors select-none";

          if (isDisabled) {
            cellCls += " text-gray-300 cursor-not-allowed";
          } else if (isSelected) {
            cellCls += " bg-gray-900 text-white font-semibold cursor-pointer";
          } else if (isGhost) {
            cellCls += " bg-gray-900/20 text-gray-500 font-medium cursor-default";
          } else if (inRange) {
            cellCls += " bg-gray-100 text-gray-800 rounded-none cursor-pointer";
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
  // "selecting" = user clicked check-in, awaiting check-out
  const [phase, setPhase] = useState<"idle" | "selecting">("idle");

  const rightMonth = addMonths(pivotMonth, 1);

  const handleSelect = (date: Date) => {
    if (phase === "idle" || (phase === "selecting" && checkIn && date <= checkIn)) {
      // Start fresh
      setCheckIn(date);
      setCheckOut(null);
      setPhase("selecting");
      onDatesChange?.(date, null);
    } else {
      // Complete the range
      setCheckOut(date);
      setPhase("idle");
      onDatesChange?.(checkIn, date);
    }
  };

  const prevMonth = () => setPivotMonth((m) => addMonths(m, -1));
  const nextMonth = () => setPivotMonth((m) => addMonths(m, 1));

  // Minimum date for checkout: day after check-in
  const minCheckOut = checkIn
    ? new Date(checkIn.getTime() + 86400000 * 2) // min 2 nights
    : undefined;

  return (
    <div className="select-none">
      {/* Two month grids — each with its own title */}
      <div className="flex items-start gap-0">

        {/* Left arrow */}
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer mt-0.5 mr-2 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Left calendar */}
        <div className="flex flex-col flex-1">
          <p className="text-sm font-semibold text-gray-800 text-center mb-3">
            {MONTHS_ES[pivotMonth.getMonth()]} {pivotMonth.getFullYear()}
          </p>
          <MonthGrid
            year={pivotMonth.getFullYear()}
            month={pivotMonth.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={handleSelect}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 self-stretch mx-6" />

        {/* Right calendar */}
        <div className="hidden md:flex flex-col flex-1">
          <p className="text-sm font-semibold text-gray-800 text-center mb-3">
            {MONTHS_ES[rightMonth.getMonth()]} {rightMonth.getFullYear()}
          </p>
          <MonthGrid
            year={rightMonth.getFullYear()}
            month={rightMonth.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={handleSelect}
            showGhostCheckIn={phase === "selecting"}
            minDate={minCheckOut}
          />
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer mt-0.5 ml-2 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      {phase === "selecting" && (
        <p className="text-xs text-gray-400 mt-3">
          Ahora seleccioná la fecha de salida (mínimo 2 noches)
        </p>
      )}
    </div>
  );
}

