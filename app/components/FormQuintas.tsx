import Lupa from "./icons/Lupa";
import { useFilters } from "../context/ContextFilters";

export default function FormQuintas() {
  const { filters, setFilters } = useFilters();

  // const router = useRouter();
  // const searchParams = useSearchParams();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const place = form.place.value;
    const guests = form.guests.value;
    console.log(place, guests);
    setFilters((prev: any) => ({
      ...prev,
      place: place,
      guests: guests,
    }));
    console.log(filters);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex md:flex-row flex-col justify-center items-center gap-5 md:gap-8">
      <section className="flex md:flex-row py-2 px-5 gap-5 flex-col border-black/30 border cursor-pointer w-max bg-white rounded-4xl">
        <div
          className={`hover:bg-black/10 rounded-4xl flex flex-col focus:bg-black items-center transition-all animate-out md:items-start`}>
          <p className={"font-medium my-auto mx-auto"}>Lugar</p>
          <input
            type="text"
            defaultValue={filters.place}
            name="place"
            className="text-black/40 text-sm transition-all text-center focus:outline-0"
            placeholder="Elegi aca tu destino"
          />
        </div>
        <div
          className={`hover:bg-black/10  rounded-4xl flex flex-col focus:bg-black items-center transition-all animate-out md:items-start`}>
          <p className={"font-medium my-auto mx-auto"}>Huéspedes</p>
          <input
            type="text"
            defaultValue={filters.guests}
            name="guests"
            className="text-black/40 text-sm transition-all text-center focus:outline-0"
            placeholder="Elegi aca la cantidad de huespedes"
          />
        </div>
      </section>
      <button
        className="border-black/30 bg-white border p-2 rounded-4xl cursor-pointer"
        type="submit">
        <Lupa />
      </button>
    </form>
  );
}
