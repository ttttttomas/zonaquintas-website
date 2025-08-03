"use client";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import Lupa from "../icons/Lupa";
import { Suspense, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function Form() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [viewInput1, setViewInput1] = useState(false);
  const [viewInput4, setViewInput4] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const form = e.currentTarget;

    // const place = form.place.value;
    // const startDate = form.startDate.value;
    // const endDate = form.endDate.value;
    // const people = form.people.value;

    // const query = new URLSearchParams({
    //   place,
    //   startDate,
    //   endDate,
    //   people,
    // }).toString();

    router.push(`/quintas?query=test`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form
        onSubmit={handleSubmit}
        className="flex md:flex-row flex-col justify-center items-center gap-5 md:gap-8 mb-5 md:mb-10">
        <section
          className={`flex divide-x divide-gray-300 md:flex-row flex-col border-black/50 border cursor-pointer w-max bg-white rounded-4xl`}>
          {viewInput1 ? (
            <div
              className={`hover:bg-black/10 w-[260px] rounded-l-4xl flex flex-col focus:bg-black ${
                viewInput1 && "md:pl-10"
              } py-5 items-center transition-all animate-out md:items-start`}>
              <p
                className={
                  viewInput1
                    ? "font-medium"
                    : "font-medium text-xl my-auto mx-auto"
                }>
                Lugar
              </p>
              {viewInput1 && (
                <input
                  type="text"
                  // defaultValue={searchParams.get("query") || ""}
                  name="place"
                  className="text-black/40 transition-all font-bold md:text-start text-center focus:outline-0"
                  placeholder="Elegi aca tu destino"
                />
              )}
            </div>
          ) : (
            <div
              onClick={() => setViewInput1(!viewInput1)}
              className={`md:hover:bg-black/10 w-[260px] rounded-l-3xl flex flex-col focus:bg-black ${
                viewInput1 && "md:pl-10"
              } py-5 items-center text-gray-300 hover:text-black transition-all md:items-start`}>
              <p className="font-medium text-xl my-auto mx-auto">Lugar</p>
            </div>
          )}
          <div
            className={`hover:bg-black/10 w-[260px] flex flex-col focus:bg-black py-5 items-center transition-all animate-out`}>
            <p className={"font-medium text-xl my-auto mx-auto"}>
              Fecha de ingreso
            </p>
            <DatePicker
              placeholderText="Elegi aca fecha de ida"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                console.log(
                 startDate
                );
              }}
              startDate={startDate}
              withPortal
              // defaultValue={searchParams.get("query") || ""}
              name="startDate"
              className="text-black/40 cursor-pointer transition-all font-bold text-center focus:outline-0"
            />
          </div>
          <div
            className={`hover:bg-black/10 w-[260px] flex flex-col focus:bg-black py-5 items-center transition-all animate-out`}>
            <p className={"font-medium text-xl my-auto mx-auto"}>
              Fecha de egreso
            </p>
            <DatePicker
              placeholderText="Elegi aca fecha de vuelta"
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                console.log(
                  date?.getDate(),
                  date?.getMonth(),
                  date?.getFullYear()
                );
              }}
              endDate={endDate}
              withPortal
              // defaultValue={searchParams.get("query") || ""}
              name="endDate"
              className="text-black/40 cursor-pointer transition-all font-bold text-center focus:outline-0"
            />
          </div>
          {viewInput4 ? (
            <div
              className={`hover:bg-black/10 w-[260px] rounded-r-4xl flex flex-col focus:bg-black ${
                viewInput4 && "md:pl-8"
              } py-5 items-center transition-all animate-out md:items-start`}>
              <p
                className={
                  viewInput4
                    ? "font-medium"
                    : "font-medium text-xl my-auto mx-auto"
                }>
                Huespedes
              </p>
              {viewInput4 && (
                <input
                  type="text"
                  // defaultValue={searchParams.get("query") || ""}
                  name="people"
                  className="text-black/40 transition-all font-bold md:text-start text-center focus:outline-0"
                  placeholder="Cantidad de huéspedes"
                />
              )}
            </div>
          ) : (
            <div
              onClick={() => setViewInput4(!viewInput4)}
              className={`md:hover:bg-black/10 w-[260px] rounded-r-3xl flex flex-col focus:bg-black ${
                viewInput4 && "md:pl-10"
              } text-gray-300 hover:text-black py-5 items-center transition-all md:items-start`}>
              <p className="font-medium text-xl my-auto mx-auto">Huespedes</p>
            </div>
          )}
        </section>
        <button
          className="border-black/30 bg-white border p-2 rounded-4xl cursor-pointer"
          type="submit">
          <Lupa />
        </button>
      </form>
    </Suspense>
  );
}
