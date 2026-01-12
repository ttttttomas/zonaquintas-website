"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CalendarPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  console.log(startDate, endDate?.getDay());

  return (
    <section className="flex gap-10">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        inline
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        inline
      />  
    </section>
  );
}
