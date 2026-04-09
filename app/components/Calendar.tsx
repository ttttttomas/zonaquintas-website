"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export default function Calendar({ onDatesChange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
    onDatesChange?.(date, endDate);
  };

  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
    onDatesChange?.(startDate, date);
  };

  return (
    <section className="flex flex-col md:flex-row gap-4 md:gap-10">
      <div className="md:w-full mx-auto">
        <DatePicker selected={startDate} onChange={handleStartChange} inline />
      </div>
      <div className="md:w-full mx-auto">
        <DatePicker selected={endDate} onChange={handleEndChange} inline />
      </div>
    </section>
  );
}
