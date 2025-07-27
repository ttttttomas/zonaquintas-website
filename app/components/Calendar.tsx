'use client'
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function CalendarPage() {
const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
const [startDate, endDate] = dateRange;

  return (
    <section className="flex gap-20">
     <DatePicker
     className="border border-gray-300 cursor-pointer rounded-md p-2 text-sm"
      selectsRange={true}
      placeholderText="Selecciona tus fechas"
      startDate={startDate}
      endDate={endDate}
      minDate={new Date()}
      onChange={(update) => {
        setDateRange(update);
        console.log(dateRange[0], dateRange[1]);
      }}
      withPortal
    />
    </section>
  )
}
