import React from "react";
import Saldo from "@/app/components/icons/Saldo";

interface Movements {
  date: string;
  quinta: string;
  amount: string;
  status: "Retenido" | "Entregado";
}

const movements: Movements[] = [
  {
    date: "12/09/2025",
    quinta: "Quinta Ejemplo",
    amount: "$120.000",
    status: "Retenido",
  },
  {
    date: "12/09/2025",
    quinta: "Quinta Ejemplo",
    amount: "$80.000",
    status: "Entregado",
  },
];

export default function WalletPage() {
  return (
    <main className="flex flex-col relative items-center justify-center mb-20 mx-10">
      <div className="publicar rounded-xl absolute h-full z-0 w-full" />
      <section className="border relative border-black/50 rounded-xl mx-20 w-full flex flex-col">
        <div className="flex items-center px-5 py-3 bg-white rounded-t-xl border-b border-black/50 justify-start gap-5">
          <svg
            width="55"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M25.4395 3.47656L22.9639 23.2317H28.3975L34.6309 4.62422L25.4395 3.47656ZM37.0811 4.49219L30.8096 23.2317L49.8145 23.2444L54.1689 10.2178L37.0811 4.49219ZM22.8496 5.84297L13.7217 6.83828L15.5117 23.2317H20.6787L22.8496 5.84297ZM8.12305 19.4231C6.66309 19.4231 5.68809 20.5403 5.42275 21.6067C5.29072 22.1399 5.36562 22.5716 5.51543 22.8128C5.66396 23.0413 5.86963 23.2317 6.59961 23.2317H13.2139L12.7949 19.4231H8.12305ZM53.4961 19.4231L52.2266 23.2317H58.2568C57.9268 22.597 57.7871 21.9241 57.876 21.2513C57.9648 20.5911 58.2188 19.9944 58.5488 19.4231H53.4961ZM5.20312 25.5169V56.8616C5.20312 57.5091 5.55732 58.2708 6.13877 58.8548C6.72148 59.4388 7.48828 59.7942 8.12305 59.7942L56.873 59.8069C57.5078 59.8069 58.2695 59.4515 58.8535 58.8675C59.4375 58.2835 59.793 57.5218 59.793 56.8743V47.8606H48.748C43.1621 47.8606 43.1621 37.4505 48.748 37.4505H59.793V25.5296L5.20312 25.5169ZM48.748 39.7356C46.209 39.7356 46.209 45.5755 48.748 45.5755H51.5791C50.4365 45.0931 49.6367 43.9632 49.6367 42.6556C49.6367 41.3479 50.4365 40.2181 51.5791 39.7356H48.748ZM54.042 39.7356C55.1846 40.2181 55.9844 41.3479 55.9844 42.6556C55.9844 43.9632 55.1846 45.0931 54.042 45.5755H61.8242V39.7356H54.042ZM52.8105 41.7669C52.3027 41.7669 51.9219 42.1478 51.9219 42.6556C51.9219 43.1634 52.3027 43.5442 52.8105 43.5442C53.3184 43.5442 53.6992 43.1634 53.6992 42.6556C53.6992 42.1478 53.3184 41.7669 52.8105 41.7669Z"
              fill="#337444"
            />
          </svg>
          <h1 className="text-2xl font-semibold">Mi Wallet</h1>
        </div>
        <section className="mx-5 mt-10 mb-20 gap-10 flex flex-col">
          <ul className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between">
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Saldo retenido</p>
              </div>
              <div className="flex gap-5">
                <p>$120.000</p>
                <p>USD 0</p>
              </div>
            </li>
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Saldo disponible</p>
              </div>
              <div className="flex gap-5">
                <p>$80.000</p>
                <p>USD 0</p>
              </div>
            </li>
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Total transferido</p>
              </div>
              <div className="flex gap-5">
                <p>$220.000</p>
                <p>USD 0</p>
              </div>
            </li>
          </ul>
          <div className="flex gap-10 flex-col md:flex-row">
            <div className="md:w-3/4 border border-black/50 rounded-md p-5 bg-white">
              <h2 className="font-semibold text-xl">Lista de movimientos</h2>
              {/* 🧱 Tabla completa en pantallas medianas o mayores */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm ">
                  <thead className=" text-left font-medium">
                    <tr>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3">Quinta</th>
                      <th className="px-6 py-3">Monto</th>
                      <th className="px-6 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m, i) => (
                      <tr
                        key={i}
                        className="border-t border-black/20 hover:bg-gray-50 transition">
                        <td className="px-6 py-3">{m.date}</td>
                        <td className="px-6 py-3">{m.quinta}</td>
                        <td className="px-6 py-3 font-medium">{m.amount}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-semibold ${
                              m.status === "Entregado"
                                ? "bg-green-600 text-white"
                                : "bg-yellow-400 text-black"
                            }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📱 Vista mobile tipo "cards" */}
              <div className="md:hidden divide-y divide-gray-200">
                {movements.map((m, i) => (
                  <div key={i} className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Fecha</span>
                      <span className="font-medium">{m.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Quinta</span>
                      <span className="font-medium">{m.quinta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Monto</span>
                      <span className="font-medium">{m.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Estado</span>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          m.status === "Entregado"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-400 text-black"
                        }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          <div className="md:w-1/4 gap-5 flex flex-col">
            <div className="font-semibold border border-black/50 rounded-md flex p-5 flex-col bg-white gap-3">
              <p>Próxima transferencia</p>
              <small>Proxima fecha de pago estimada</small>
              <p>12/09/2025</p>
            </div>
            <div className="bg-white flex flex-col border border-black/50 rounded-md gap-3 p-5">
              <p className="font-semibold">Notificaciones</p>
              <ul className="flex flex-col pl-5 gap-3">
                <li className="text-sm">
                  Reserva 20/01/2026, Barajas Tomás cancelada.
                </li>
                <li className="text-sm">
                  Reserva 20/01/2026, Barajas Tomás cancelada.
                </li>
                <li className="text-sm">
                  Reserva 20/01/2026, Barajas Tomás cancelada.
                </li>
              </ul>
            </div>
          </div>
          </div>
        </section>
      </section>
    </main>
  );
}
