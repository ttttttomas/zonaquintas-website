"use client";
import Saldo from "@/app/components/icons/Saldo";
import { useUser } from "@/app/context/UserContext";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Wallet } from "@/types";
import { useEffect, useState } from "react";

type Form = {
  bankAccount: string;
  usd: number;
  ars: number;
};

export default function WalletPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Form>({
    bankAccount: "",
    usd: 0,
    ars: 0,
  });

  useEffect(() => {
    if (!user) return;

    const getWallet = async () => {
      try {
        const wallet = await ProductsServices.getWallet(user.id);
        setWallet(wallet);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando wallet:", error);
        // opcional: manejar un estado de error
      } finally {
        setLoading(false);
      }
    };

    getWallet();
  }, [user]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primaryDark border-t-transparent" />
      </main>
    );
  }
  console.log(typeof wallet?.balances.disponible.USD);

  const openModal = () => setIsOpen(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = formData;
      fetch("/api/test-email/request-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: {
            name: user?.name,
          },
          property: {
            totalArs: wallet?.balances.disponible.ARS,
            totalUsd: wallet?.balances.disponible.USD,
            bank_account: data.bankAccount,
          },
        }),
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      // opcional: manejar un estado de error
    }
  };

  return (
    <main
      className={`flex flex-col relative items-center justify-center mb-20 mx-10`}
    >
      <div className="publicar rounded-xl absolute h-full z-0 w-full" />
      <section className="border relative border-black/50 rounded-xl mx-20 w-full flex flex-col">
        <div className="flex md:flex-row flex-col items-center px-5 py-3 bg-white rounded-t-xl border-black/50 justify-between gap-5">
          <div className="flex items-center px-5 py-3 bg-white rounded-t-xl border-black/50 justify-start gap-5">
            <svg
              width="55"
              viewBox="0 0 65 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.4395 3.47656L22.9639 23.2317H28.3975L34.6309 4.62422L25.4395 3.47656ZM37.0811 4.49219L30.8096 23.2317L49.8145 23.2444L54.1689 10.2178L37.0811 4.49219ZM22.8496 5.84297L13.7217 6.83828L15.5117 23.2317H20.6787L22.8496 5.84297ZM8.12305 19.4231C6.66309 19.4231 5.68809 20.5403 5.42275 21.6067C5.29072 22.1399 5.36562 22.5716 5.51543 22.8128C5.66396 23.0413 5.86963 23.2317 6.59961 23.2317H13.2139L12.7949 19.4231H8.12305ZM53.4961 19.4231L52.2266 23.2317H58.2568C57.9268 22.597 57.7871 21.9241 57.876 21.2513C57.9648 20.5911 58.2188 19.9944 58.5488 19.4231H53.4961ZM5.20312 25.5169V56.8616C5.20312 57.5091 5.55732 58.2708 6.13877 58.8548C6.72148 59.4388 7.48828 59.7942 8.12305 59.7942L56.873 59.8069C57.5078 59.8069 58.2695 59.4515 58.8535 58.8675C59.4375 58.2835 59.793 57.5218 59.793 56.8743V47.8606H48.748C43.1621 47.8606 43.1621 37.4505 48.748 37.4505H59.793V25.5296L5.20312 25.5169ZM48.748 39.7356C46.209 39.7356 46.209 45.5755 48.748 45.5755H51.5791C50.4365 45.0931 49.6367 43.9632 49.6367 42.6556C49.6367 41.3479 50.4365 40.2181 51.5791 39.7356H48.748ZM54.042 39.7356C55.1846 40.2181 55.9844 41.3479 55.9844 42.6556C55.9844 43.9632 55.1846 45.0931 54.042 45.5755H61.8242V39.7356H54.042ZM52.8105 41.7669C52.3027 41.7669 51.9219 42.1478 51.9219 42.6556C51.9219 43.1634 52.3027 43.5442 52.8105 43.5442C53.3184 43.5442 53.6992 43.1634 53.6992 42.6556C53.6992 42.1478 53.3184 41.7669 52.8105 41.7669Z"
                fill="#337444"
              />
            </svg>
            <h1 className="text-2xl font-semibold">Mi Wallet</h1>
          </div>
          <button
            onClick={openModal}
            className="bg-orange-400 px-4 py-2 cursor-pointer rounded-md"
          >
            Solicitar Transferencia
          </button>
        </div>
        <section className="mx-5 mt-10 mb-20 gap-10 flex flex-col">
          <ul className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between">
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Saldo retenido</p>
                <div className="relative inline-block group">
                  {/* Signo de pregunta */}
                  <small className="bg-orange-400 rounded-full h-5 w-5 flex items-center justify-center text-white font-bold cursor-pointer select-none">
                    ?
                  </small>

                  {/* Tooltip - oculto por defecto, visible en hover */}
                  <div
                    className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  absolute left-1/2 -translate-x-1/2 top-full mt-2
                  w-50 spaccing-y-1 bg-orange-400 rounded-xl px-2 py-3
                   font-semibold
                  flex flex-col items-center
                  whitespace-normal
                  z-50
                  drop-shadow-md"
                  >
                    <p className="text-sm">Que es esto?</p>
                    <p className="text-xs">
                      Tranquilo, no te preocupes, en ZonaQuintas nos encargamos
                      de retener los ingresos hasta que la estadía de la reserva
                      se complemente exitosamente para ofrecer mayor confianza y
                      seguridad tanto a huéspedes como anfitriones.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <p>
                  ARS ${wallet?.balances.retenido.ARS.toLocaleString("es-AR")}
                </p>
                <p>
                  USD ${wallet?.balances.retenido.USD.toLocaleString("es-AR")}
                </p>
              </div>
            </li>
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Saldo disponible</p>
                <div className="relative inline-block group">
                  {/* Signo de pregunta */}
                  <small className="bg-orange-400 rounded-full h-5 w-5 flex items-center justify-center text-white font-bold cursor-pointer select-none">
                    ?
                  </small>

                  {/* Tooltip - oculto por defecto, visible en hover */}
                  <div
                    className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  absolute left-1/2 -translate-x-1/2 top-full mt-2
                  w-50 spaccing-y-1 bg-orange-400 rounded-xl px-2 py-3
                   font-semibold
                  flex flex-col items-center
                  whitespace-normal
                  z-50
                  drop-shadow-md"
                  >
                    <p className="text-xs">
                      Este es tu dinero listo para ser transferido a tu cuenta.
                      Podes hacer la solicitud de transferencia en cualquier
                      momento y nosotros te transferiremos el dinero a tu banco
                      indicado.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <p>
                  ARS ${wallet?.balances.disponible.ARS.toLocaleString("es-AR")}
                </p>
                <p>
                  USD ${wallet?.balances.disponible.USD.toLocaleString("es-AR")}
                </p>
              </div>
            </li>
            <li className="flex flex-col bg-white font-semibold border border-black/50 px-5 py-2 rounded-md items-center justify-center">
              <div className="flex items-center gap-2">
                <Saldo />
                <p>Total transferido</p>
                <div className="relative inline-block group">
                  {/* Signo de pregunta */}
                  <small className="bg-orange-400 rounded-full h-5 w-5 flex items-center justify-center text-white font-bold cursor-pointer select-none">
                    ?
                  </small>

                  {/* Tooltip - oculto por defecto, visible en hover */}
                  <div
                    className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  absolute left-1/2 -translate-x-1/2 top-full mt-2
                  w-50 spaccing-y-1 bg-orange-400 rounded-xl px-2 py-3
                   font-semibold
                  flex flex-col items-center
                  whitespace-normal
                  z-50
                  drop-shadow-md"
                  >
                    <p className="text-xs">
                      Este es el balance de la cantidad de dinero transferido
                      hasta el momento.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <p>
                  ARS ${wallet?.balances.entregado.ARS.toLocaleString("es-AR")}
                </p>
                <p>
                  USD ${wallet?.balances.entregado.USD.toLocaleString("es-AR")}
                </p>
              </div>
            </li>
          </ul>
          <div className="flex gap-10 flex-col md:flex-row">
            <div className="md:w-3/4 border border-black/50 rounded-md p-5 bg-white">
              <h2 className="font-semibold text-xl">Lista de movimientos</h2>
              {/* 🧱 Tabla completa en pantallas medianas o mayores */}
              <div className="hidden md:block  max-h-96 overflow-x-auto">
                {wallet?.recent_transactions.length === 0 ? (
                  <div className="flex justify-center items-center">
                    <p className="text-center">No hay movimientos de cuenta.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className=" text-left font-medium">
                      <tr>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Quinta</th>
                        <th className="px-6 py-3">Monto</th>
                        <th className="px-6 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallet?.recent_transactions.map((m, i) => (
                        <tr
                          key={i}
                          className="border-t border-black/20 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-3">{m.date}</td>
                          <td className="px-6 py-3">{m.quinta_name}</td>
                          <td className="px-6 py-3 font-medium">
                            ${m.amount.toLocaleString("es-AR")}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                                m.status === "DISPONIBLE"
                                  ? "bg-yellow-400 text-black"
                                  : m.status === "RETENIDO"
                                    ? "bg-red-600 text-white"
                                    : "bg-green-600 text-white"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 📱 Vista mobile tipo "cards" */}
              <div className="md:hidden divide-y divide-gray-200">
                {wallet?.recent_transactions.map((m, i) => (
                  <div key={i} className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Fecha</span>
                      <span className="font-medium">{m.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Quinta</span>
                      <span className="font-medium">{m.quinta_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Monto</span>
                      <span className="font-medium">{m.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Estado</span>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          m.status === "DISPONIBLE"
                            ? "bg-yellow-400 text-black"
                            : m.status === "RETENIDO"
                              ? "bg-red-600 text-white"
                              : "bg-green-600 text-white"
                        }`}
                      >
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
                <p>
                  {wallet?.next_transfer ??
                    "Todavía no se ha transferido ningún monto."}
                </p>
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg flex flex-col gap-3 justify-center items-center p-4 max-w-md"
          >
            <h2 className="text-xl font-semibold">Solicitar Transferencia</h2>
            <p>
              Saldo disponible en ARS: $
              {wallet?.balances.disponible.ARS.toLocaleString("es-AR")}
            </p>
            <p>
              Saldo disponible en USD: $
              {wallet?.balances.disponible.USD.toLocaleString("es-AR")}
            </p>
            <input
              name="bankAccount"
              onChange={(e) =>
                setFormData({ ...formData, bankAccount: e.target.value })
              }
              type="text"
              placeholder="CBU o Alias"
              className="bg-white border border-gray-300 rounded-md py-2 px-4 block w-full focus:border-primary focus:ring-primary focus:outline-none focus:ring-opacity-40"
            />
            <div className="flex gap-5 justify-between">
              <button className="bg-primaryDark text-white px-4 py-2 rounded-md cursor-pointer">
                Enviar solicitud
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
