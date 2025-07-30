import React from "react";

export default function Filters() {
  return (
    <section className="grid grid-cols-2 md:flex flex-row my-7 w-max md:gap-32 md:text-md text-sm gap-5 mx-auto">
      <div>Habitaciones</div>
      <div>Ambientes</div>
      <div>Baños</div>
      <div>Todos los filtros</div>
    </section>
  );
}
