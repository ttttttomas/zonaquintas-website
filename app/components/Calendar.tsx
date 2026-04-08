"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export default function Calendar({ onDatesChange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
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
    <section className="flex gap-10">
      <DatePicker
        selected={startDate}
        onChange={handleStartChange}
        inline
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndChange}
        inline
      />
    </section>
  );
}
