import Check from "../components/icons/Check";
import DashboardCard from "../components/DashboardCard";
import SecondSeparator from "../components/SecondSeparator";
import { Separator } from "../components/ui/Separator";

export default function DashboardPage() {
  return (
    <main>
      <SecondSeparator />
      <section className="mx-16 flex mb-10">
        <div className="w-2/3 flex flex-col gap-5">
        <div className="flex mt-5 gap-2">
          <h3 className="font-semibold text-xl">Quintas activas</h3>
          <Check />
        </div>
        <div className=" overflow-y-scroll max-h-100">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
          <Separator color="bg-gray-300" />
          <h3 className="mb-5 font-semibold text-xl">
            Publicaciones pendientes
          </h3>
          <DashboardCard />
        </div>
        <div className="w-1/3">
          <ul className="bg-white flex m-10 flex-col gap-5 w-max p-5 shadow-md shadow-black/40">
            <li className="flex items-center gap-2">
              <Check />
              <p>Quintas activas</p>
            </li>
            <li>Publicaciones pendientes</li>
            <li>Publicaciones rechazadas</li>
            <li>Publicaciones suspendidas</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
