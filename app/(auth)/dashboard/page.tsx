"use client";
import Check from "../../components/icons/Check";
import DashboardCard from "../../components/DashboardCard";
import SecondSeparator from "../../components/SecondSeparator";
import { Separator } from "../../components/ui/Separator";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { redirect } from "next/navigation";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Booking, Quintas } from "@/types";
import { BookingsServices } from "@/app/services/BookingsServices";

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white shadow-md shadow-black/40 w-max h-auto flex border-secondaryDark border">
      <img src={booking.quinta_main_image} className="w-48 object-cover" alt="Quintas activas" />
      <div className="flex flex-col items-center justify-center gap-3 px-2">
        <p className="font-semibold">Nombre de inquilino: <span className="font-light">{booking.guest_name}</span></p>
        <p className="text-sm">Check In: <span className="font-light">{booking.check_in}</span></p>
        <p className="text-sm">Check Out: <span className="font-light">{booking.check_out}</span></p>
        <p className="text-sm">Estado: <span className="font-light">{booking.status === 'paid' ? 'Seña pagada' : 'Pago completo'}</span></p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser();
  const [quintasPending, setQuintasPending] = useState<Quintas[]>([]);
  const [quintasActive, setQuintasActive] = useState<Quintas[]>([]);
  const [quintasRejected, setQuintasRejected] = useState<Quintas[]>([]);
  const [quintasSuspended, setQuintasSuspended] = useState<Quintas[]>([]);
  const [bookingsInDate, setBookingsInDate] = useState<Booking[]>([]);
  const [bookingsFinished, setBookingsFinished] = useState<Booking[]>([]);
  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
  const [quintas, setQuintas] = useState<Quintas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (user?.role === "admin") {
        console.log("es admin");

        setIsAdmin(true);
        const res = await ProductsServices.getQuintas();
        const res2 = await BookingsServices.getBookingsFinished();
        const res3 = await BookingsServices.getBookingsInDate();
        setQuintas(res || []);
        setQuintasPending(res.filter((quinta: Quintas) => quinta.status === "pending"));
        setQuintasActive(res.filter((quinta: Quintas) => quinta.status === "active"));
        setQuintasRejected(res.filter((quinta: Quintas) => quinta.status === "rejected"));
        setQuintasSuspended(res.filter((quinta: Quintas) => quinta.status === "cancelled"));
        setBookingsFinished(res2 || []);
        setBookingsInDate(res3 || []);
        setLoading(false);
      } else {
        setIsAdmin(false);
        setLoading(false);
        return redirect("/");
      }
    };
    checkIsAdmin();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="logo.png" width={80} height={80} alt="" />
        </div>
      </div>
    )
  }



  return (
    <main>
      <SecondSeparator />
      {isAdmin && (
        <section className="mx-16 flex mb-10">
          <div className="w-2/3 flex flex-col gap-5">
            <div className="flex mt-5 gap-2">
              <p className="font-semibold text-xl">Quintas activas</p>
            </div>
            <div className="overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {quintasActive.map((quinta) => (
                <DashboardCard key={quinta.id} quinta={quinta} />
              ))}
              {quintasActive.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay quintas activas
                </p>
              )}
            </div>
            <Separator color="bg-gray-300" />
            <p className="mb-5 font-semibold text-xl">
              Publicaciones pendientes
            </p>
            <div className=" overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {quintasPending.map((quinta) => (
                <DashboardCard key={quinta.id} quinta={quinta} />
              ))}
              {quintasPending.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay publicaciones pendientes
                </p>
              )}
            </div>
            <Separator color="bg-gray-300" />
            <p className="mb-5 font-semibold text-xl">
              Estadias en curso
            </p>
            <div className=" overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {bookingsInDate.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
              {bookingsInDate.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay estadias en curso
                </p>
              )}
            </div>
            <Separator color="bg-gray-300" />
            <p className="mb-5 font-semibold text-xl">
              Estadias Finalizadas
            </p>
            <div className=" overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {bookingsFinished.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
              {bookingsFinished.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay estadias finalizadas
                </p>
              )}
            </div>
            <Separator color="bg-gray-300" />
            <p className="mb-5 font-semibold text-xl">
              Publicaciones suspendidas
            </p>
            <div className=" overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {quintasSuspended.map((quinta) => (
                <DashboardCard key={quinta.id} quinta={quinta} />
              ))}
              {quintasSuspended.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay publicaciones suspendidas
                </p>
              )}
            </div>
            <Separator color="bg-gray-300" />
            <p className="mb-5 font-semibold text-xl">
              Publicaciones rechazadas
            </p>
            <div className=" overflow-y-scroll dash max-h-120 gap-2 flex flex-col">
              {quintasRejected.map((quinta) => (
                <DashboardCard key={quinta.id} quinta={quinta} />
              ))}
              {quintasRejected.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                  No hay publicaciones rechazadas
                </p>
              )}
            </div>
          </div>
          <div className="w-1/3">
            <ul className="bg-white flex m-10 flex-col gap-5 w-max p-5 shadow-md shadow-black/40">
              <li className="flex items-center gap-2">
                <Check />
                <p>{quintasActive.length} Quintas activas</p>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 37.5C10.35 37.5 2.5 29.65 2.5 20C2.5 10.35 10.35 2.5 20 2.5C29.65 2.5 37.5 10.35 37.5 20C37.5 29.65 29.65 37.5 20 37.5ZM20 5C11.725 5 5 11.725 5 20C5 28.275 11.725 35 20 35C28.275 35 35 28.275 35 20C35 11.725 28.275 5 20 5Z"
                    fill="black"
                  />
                  <path
                    d="M25 26.25C24.775 26.25 24.55 26.2 24.35 26.075L18.1 22.325C17.9157 22.2128 17.7636 22.0549 17.6585 21.8665C17.5534 21.6781 17.4988 21.4657 17.5 21.25V11.25C17.5 10.55 18.05 10 18.75 10C19.45 10 20 10.55 20 11.25V20.55L25.65 23.925C25.8827 24.0676 26.0626 24.2823 26.1624 24.5363C26.2621 24.7904 26.2764 25.07 26.2029 25.3329C26.1294 25.5958 25.9722 25.8275 25.7551 25.993C25.5381 26.1585 25.273 26.2487 25 26.25Z"
                    fill="black"
                  />
                </svg>
                <p>{quintasPending.length} Publicaciones pendientes</p>
              </li>
              <li className="flex items-center gap-2">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.1673 23.3346C14.7199 23.3346 15.2498 23.1151 15.6405 22.7244C16.0312 22.3337 16.2507 21.8038 16.2507 21.2513C16.2507 20.6988 16.0312 20.1689 15.6405 19.7782C15.2498 19.3875 14.7199 19.168 14.1673 19.168C13.6148 19.168 13.0849 19.3875 12.6942 19.7782C12.3035 20.1689 12.084 20.6988 12.084 21.2513C12.084 21.8038 12.3035 22.3337 12.6942 22.7244C13.0849 23.1151 13.6148 23.3346 14.1673 23.3346ZM14.1673 29.168C14.7199 29.168 15.2498 28.9485 15.6405 28.5578C16.0312 28.1671 16.2507 27.6372 16.2507 27.0846C16.2507 26.5321 16.0312 26.0022 15.6405 25.6115C15.2498 25.2208 14.7199 25.0013 14.1673 25.0013C13.6148 25.0013 13.0849 25.2208 12.6942 25.6115C12.3035 26.0022 12.084 26.5321 12.084 27.0846C12.084 27.6372 12.3035 28.1671 12.6942 28.5578C13.0849 28.9485 13.6148 29.168 14.1673 29.168ZM22.084 21.2513C22.084 21.8038 21.8645 22.3337 21.4738 22.7244C21.0831 23.1151 20.5532 23.3346 20.0007 23.3346C19.4481 23.3346 18.9182 23.1151 18.5275 22.7244C18.1368 22.3337 17.9173 21.8038 17.9173 21.2513C17.9173 20.6988 18.1368 20.1689 18.5275 19.7782C18.9182 19.3875 19.4481 19.168 20.0007 19.168C20.5532 19.168 21.0831 19.3875 21.4738 19.7782C21.8645 20.1689 22.084 20.6988 22.084 21.2513ZM20.0007 29.168C20.5532 29.168 21.0831 28.9485 21.4738 28.5578C21.8645 28.1671 22.084 27.6372 22.084 27.0846C22.084 26.5321 21.8645 26.0022 21.4738 25.6115C21.0831 25.2208 20.5532 25.0013 20.0007 25.0013C19.4481 25.0013 18.9182 25.2208 18.5275 25.6115C18.1368 26.0022 17.9173 26.5321 17.9173 27.0846C17.9173 27.6372 18.1368 28.1671 18.5275 28.5578C18.9182 28.9485 19.4481 29.168 20.0007 29.168ZM27.9173 21.2513C27.9173 21.8038 27.6978 22.3337 27.3071 22.7244C26.9164 23.1151 26.3865 23.3346 25.834 23.3346C25.2814 23.3346 24.7515 23.1151 24.3608 22.7244C23.9701 22.3337 23.7507 21.8038 23.7507 21.2513C23.7507 20.6988 23.9701 20.1689 24.3608 19.7782C24.7515 19.3875 25.2814 19.168 25.834 19.168C26.3865 19.168 26.9164 19.3875 27.3071 19.7782C27.6978 20.1689 27.9173 20.6988 27.9173 21.2513Z" fill="black" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.334 5.41797C13.6655 5.41797 13.9834 5.54966 14.2179 5.78409C14.4523 6.01851 14.584 6.33645 14.584 6.66797V7.91797H25.4173V6.66797C25.4173 6.33645 25.549 6.01851 25.7834 5.78409C26.0179 5.54966 26.3358 5.41797 26.6673 5.41797C26.9988 5.41797 27.3168 5.54966 27.5512 5.78409C27.7856 6.01851 27.9173 6.33645 27.9173 6.66797V7.9313C28.1707 7.93797 28.4068 7.95019 28.6256 7.96797C29.259 8.01797 29.8523 8.1313 30.414 8.41797C31.2766 8.85742 31.9779 9.55871 32.4173 10.4213C32.704 10.983 32.8173 11.5763 32.8673 12.2096C32.9173 12.818 32.9173 13.5596 32.9173 14.4513V27.218C32.9173 28.1096 32.9173 28.8513 32.8673 29.4596C32.8173 30.093 32.704 30.6863 32.4173 31.248C31.9783 32.1103 31.2776 32.8116 30.4157 33.2513C29.8523 33.538 29.259 33.6513 28.6256 33.7013C28.0173 33.7513 27.2757 33.7513 26.3857 33.7513H13.6173C12.7257 33.7513 11.984 33.7513 11.3757 33.7013C10.7423 33.6513 10.149 33.538 9.58732 33.2513C8.72524 32.8127 8.024 32.1127 7.58398 31.2513C7.29732 30.688 7.18398 30.0946 7.13398 29.4613C7.08398 28.853 7.08398 28.1113 7.08398 27.2213V14.4513C7.08398 13.5596 7.08398 12.818 7.13398 12.2096C7.18398 11.5763 7.29732 10.983 7.58398 10.4213C8.02344 9.55871 8.72473 8.85742 9.58732 8.41797C10.149 8.1313 10.7423 8.01797 11.3757 7.96797C11.5945 7.95019 11.8307 7.93797 12.084 7.9313V6.66797C12.084 6.50382 12.1163 6.34127 12.1791 6.18961C12.242 6.03796 12.334 5.90016 12.4501 5.78409C12.5662 5.66801 12.704 5.57594 12.8556 5.51312C13.0073 5.4503 13.1698 5.41797 13.334 5.41797ZM30.4173 17.0846H9.58398V27.168C9.58398 28.1213 9.58398 28.763 9.62565 29.2546C9.66398 29.7346 9.73398 29.963 9.81065 30.113C10.0107 30.5063 10.329 30.8246 10.7223 31.0246C10.8723 31.1013 11.1007 31.1713 11.579 31.2096C12.0723 31.2496 12.7123 31.2513 13.6673 31.2513H26.334C27.2873 31.2513 27.929 31.2513 28.4207 31.2096C28.9007 31.1713 29.129 31.1013 29.279 31.0246C29.6716 30.8248 29.9908 30.5056 30.1907 30.113C30.2673 29.963 30.3373 29.7346 30.3757 29.2546C30.4157 28.763 30.4173 28.1213 30.4173 27.168V17.0846ZM17.5007 11.668C17.1691 11.668 16.8512 11.7997 16.6168 12.0341C16.3823 12.2685 16.2507 12.5864 16.2507 12.918C16.2507 13.2495 16.3823 13.5674 16.6168 13.8019C16.8512 14.0363 17.1691 14.168 17.5007 14.168H22.5007C22.8322 14.168 23.1501 14.0363 23.3845 13.8019C23.619 13.5674 23.7507 13.2495 23.7507 12.918C23.7507 12.5864 23.619 12.2685 23.3845 12.0341C23.1501 11.7997 22.8322 11.668 22.5007 11.668H17.5007Z" fill="black" />
                </svg>

                <p>{bookingsInDate.length} Estadías en curso</p>
              </li>
              <li className="flex items-center gap-2">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.5" d="M15.0867 7.5C15 8.46333 15 9.67333 15 11.2033V28.7967C15 30.3267 15 31.5367 15.0867 32.5H13.3333C9.405 32.5 7.44 32.5 6.22 31.28C5 30.0583 5 28.095 5 24.1667V15.8333C5 11.905 5 9.94 6.22 8.72C7.44 7.5 9.405 7.5 13.3333 7.5H15.0867Z" fill="black" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1783 4.01588C15 5.06088 15 6.97254 15 10.7942V29.2075C15 33.0292 15 34.9409 16.1783 35.9859C17.3567 37.0309 19.1583 36.7175 22.7617 36.0892L26.645 35.4125C30.635 34.7159 32.63 34.3675 33.815 32.9042C35 31.4392 35 29.3225 35 25.0875V14.9142C35 10.6809 35 8.56421 33.8167 7.09921C32.63 5.63588 30.6333 5.28754 26.6433 4.59254L22.7633 3.91421C19.16 3.28588 17.3583 2.97254 16.18 4.01754M21.2517 18.2592C21.2517 17.5359 20.6917 16.9509 20.0017 16.9509C19.3117 16.9509 18.7517 17.5359 18.7517 18.2575V21.7475C18.7517 22.4692 19.3117 23.0542 20.0017 23.0542C20.6917 23.0542 21.2517 22.4692 21.2517 21.7475V18.2592Z" fill="black" />
                </svg>

                <p>{bookingsFinished.length} Estadías finalizadas</p>
              </li>
              <li className="flex items-center gap-2">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 5C11.75 5 5 11.75 5 20C5 28.25 11.75 35 20 35C28.25 35 35 28.25 35 20C35 11.75 28.25 5 20 5ZM20 8.33333C22.5833 8.33333 25 9.25 27 10.6667L10.6667 27C9.25 25 8.33333 22.5833 8.33333 20C8.33333 13.5833 13.5833 8.33333 20 8.33333ZM20 31.6667C17.4167 31.6667 15 30.75 13 29.3333L29.3333 13C30.75 15 31.6667 17.4167 31.6667 20C31.6667 26.4167 26.4167 31.6667 20 31.6667Z" fill="#D50000" />
                </svg>

                <p>{quintasSuspended.length} Publicaciones suspendidas</p>
              </li>
              <li className="flex items-center gap-2">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.0007 28.332L20.0007 22.332L26.0007 28.332L28.334 25.9987L22.334 19.9987L28.334 13.9987L26.0007 11.6654L20.0007 17.6654L14.0007 11.6654L11.6673 13.9987L17.6673 19.9987L11.6673 25.9987L14.0007 28.332ZM20.0007 36.6654C17.6951 36.6654 15.5284 36.2276 13.5007 35.352C11.4729 34.4765 9.70899 33.2893 8.20899 31.7904C6.70899 30.2915 5.52176 28.5276 4.64732 26.4987C3.77288 24.4698 3.3351 22.3031 3.33399 19.9987C3.33288 17.6943 3.77065 15.5276 4.64732 13.4987C5.52399 11.4698 6.71121 9.70592 8.20899 8.20703C9.70676 6.70814 11.4707 5.52092 13.5007 4.64536C15.5307 3.76981 17.6973 3.33203 20.0007 3.33203C22.304 3.33203 24.4707 3.76981 26.5007 4.64536C28.5307 5.52092 30.2945 6.70814 31.7923 8.20703C33.2901 9.70592 34.4779 11.4698 35.3557 13.4987C36.2334 15.5276 36.6707 17.6943 36.6673 19.9987C36.664 22.3031 36.2262 24.4698 35.354 26.4987C34.4818 28.5276 33.2945 30.2915 31.7923 31.7904C30.2901 33.2893 28.5262 34.477 26.5007 35.3537C24.4751 36.2304 22.3084 36.6676 20.0007 36.6654Z" fill="#D50000" />
                </svg>

                <p>{quintasRejected.length} Publicaciones rechazadas</p>
              </li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
