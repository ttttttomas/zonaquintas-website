import { Quintas } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProductsServices } from "../services/ProductsServices";

interface Props {
  quinta: Quintas;
  handleAccept?: () => void;
  handleReject?: (id: string, reason: string) => void;
}

export default function DashboardCard({ quinta, handleAccept, handleReject }: Props) {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [reason, setReason] = useState("");
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const getPhoneByOwnerId = async (id: string) => {
      try {
        const { owner_id } = await ProductsServices.getQuintaById(id);
        const owner = await ProductsServices.getOwnerById(owner_id);
        setPhone(owner?.phone as any);
      } catch (error) {
        console.error(error);
      }
    }

    getPhoneByOwnerId(quinta.id.toString());
  }, [])


  const quintaAccepted = async (id: string) => {
    try {
      await ProductsServices.changeStatusQuinta(id, "active");
      window.location.reload()
    } catch (error) {
      console.error(error);
    }
  }

  const handleRejectQuinta = async (id: string) => {
    try {
      await ProductsServices.changeStatusQuinta(id, "rejected");
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div className="border font-semibold pr-5 bg-white flex justify-between w-full">
      {/* MODAL DE RECHAZO */}
      {modal2 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Quinta rechazada</h3>
              <p className="text-sm text-gray-500 mb-4">Contactarse con el propietario para notificarle el motivo del rechazo</p>

              <Link target="_blank" href={`https://wa.me/${phone}?text=Hola! Te hablamos de parte de Zona Quintas. Te contactamos para avisarte que tu quinta no ha sido aprobada.`} className="flex gap-5 hover:scale-105 transition-all bg-primaryDark/70 py-2 w-max px-5 rounded-lg justify-center mx-auto cursor-pointer items-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_632_3566)">
                    <path d="M0.595306 13.7337C0.59466 16.0694 1.20497 18.3501 2.36546 20.3603L0.484322 27.2286L7.5132 25.3856C9.4573 26.444 11.6355 26.9985 13.849 26.9987H13.8548C21.162 26.9987 27.1103 21.0526 27.1134 13.7441C27.1148 10.2026 25.7369 6.87244 23.2333 4.367C20.7303 1.86176 17.4013 0.481353 13.8543 0.479736C6.54623 0.479736 0.598431 6.42549 0.595414 13.7337" fill="url(#paint0_linear_632_3566)" />
                    <path d="M0.122001 13.7293C0.121247 16.1491 0.753427 18.5114 1.95529 20.5936L0.00670624 27.7081L7.28761 25.799C9.29374 26.8928 11.5524 27.4695 13.8508 27.4704H13.8567C21.4261 27.4704 27.588 21.3104 27.5912 13.7403C27.5925 10.0716 26.165 6.62168 23.5721 4.02647C20.9788 1.43159 17.5307 0.00150853 13.8567 0C6.28606 0 0.125018 6.1591 0.122001 13.7293ZM4.45805 20.235L4.18619 19.8034C3.04337 17.9863 2.44018 15.8864 2.44104 13.7302C2.44341 7.43801 7.56421 2.31882 13.861 2.31882C16.9104 2.32012 19.7762 3.50883 21.9316 5.6656C24.087 7.82258 25.273 10.6899 25.2723 13.7395C25.2695 20.0316 20.1486 25.1515 13.8567 25.1515H13.8522C11.8035 25.1504 9.79425 24.6002 8.04198 23.5605L7.62498 23.3132L3.30435 24.446L4.45805 20.235Z" fill="url(#paint1_linear_632_3566)" />
                    <path d="M10.4239 7.98962C10.1668 7.41821 9.89625 7.40668 9.65176 7.39666C9.45156 7.38804 9.22269 7.38868 8.99404 7.38868C8.76517 7.38868 8.39332 7.47478 8.07901 7.81797C7.76438 8.16148 6.87779 8.9916 6.87779 10.68C6.87779 12.3683 8.10757 14.0001 8.279 14.2293C8.45065 14.4581 10.6531 18.0337 14.1412 19.4093C17.0402 20.5524 17.6301 20.3251 18.2593 20.2677C18.8886 20.2106 20.2898 19.4378 20.5757 18.6365C20.8617 17.8352 20.8617 17.1484 20.776 17.0049C20.6902 16.8619 20.4613 16.776 20.1181 16.6045C19.7749 16.4329 18.0877 15.6026 17.7731 15.4881C17.4585 15.3736 17.2297 15.3165 17.0009 15.6602C16.772 16.0032 16.1148 16.776 15.9145 17.0049C15.7144 17.2343 15.5141 17.2629 15.171 17.0912C14.8276 16.919 13.7224 16.5571 12.4112 15.3881C11.391 14.4784 10.7022 13.3551 10.502 13.0115C10.3018 12.6684 10.4806 12.4824 10.6527 12.3114C10.8069 12.1577 10.996 11.9107 11.1677 11.7104C11.3388 11.51 11.3959 11.367 11.5104 11.1381C11.6249 10.909 11.5676 10.7086 11.4819 10.537C11.3959 10.3653 10.7291 8.66813 10.4239 7.98962Z" fill="white" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_632_3566" x1="1331.94" y1="2675.37" x2="1331.94" y2="0.479736" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#1FAF38" />
                      <stop offset="1" stop-color="#60D669" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_632_3566" x1="1379.23" y1="2770.81" x2="1379.23" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#F9F9F9" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <clipPath id="clip0_632_3566">
                      <rect width="27.5978" height="27.8" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <b>Abrir Whatsapp</b>
              </Link>
              <button onClick={() => setModal2(false)} className="mt-2 py-2 px-5 rounded-lg bg-red-500 text-white cursor-pointer mx-auto block">Cerrar</button>
            </div>

          </div>
        </div>
      )
      }
      {
        modal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">¿Estas seguro de querer rechazar esta quinta?</h3>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  onClick={() => {
                    setModal(false);
                    setReason("");
                  }}
                >
                  CANCELAR
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-100 active:scale-95  cursor-pointer"
                  onClick={() => {
                    handleRejectQuinta(quinta.id.toString());
                    setModal(false);
                    setModal2(true)
                  }}
                >
                  RECHAZAR PUBLICACIÓN
                </button>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex">
        <img
          src={quinta.main_image}
          className="w-48 object-cover"
          alt="Quintas activas"
        />
        <ul className="flex flex-col justify-between px-2 py-3">
          <li>Titulo: {quinta.title}</li>
          <li>Ciudad: {quinta.city}</li>
          <li>Direccion: {quinta.address}</li>
          <li>Precio: {quinta.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 2 })}</li>
        </ul>
      </div>
      <ul className="flex flex-col gap-3 justify-between items-end py-3">
        <Link target="_blank" href={`https://wa.me/${phone}?text=Hola! Te hablamos de parte de Zona Quintas. Te contactamos para avisarte que tu quinta no ha sido aprobada.`} className="flex hover:underline cursor-pointer items-center gap-1">
          <p>CONTACTARSE</p>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.60106 27.7224C5.87502 27.7224 5.25372 27.4641 4.73713 26.9475C4.22055 26.4309 3.96182 25.8092 3.96094 25.0823V6.6011C3.96094 5.87506 4.21967 5.25374 4.73713 4.73715C5.2546 4.22055 5.8759 3.96182 6.60106 3.96094H25.0819C25.8079 3.96094 26.4297 4.21967 26.9471 4.73715C27.4646 5.25462 27.7229 5.87594 27.722 6.6011V25.0823C27.722 25.8083 27.4637 26.4301 26.9471 26.9475C26.4306 27.465 25.8088 27.7233 25.0819 27.7224H6.60106ZM15.8415 21.122C16.6775 21.122 17.4366 20.88 18.1186 20.396C18.8006 19.9119 19.2736 19.2739 19.5376 18.4818H25.0819V6.6011H6.60106V18.4818H12.1453C12.4093 19.2739 12.8823 19.9119 13.5644 20.396C14.2464 20.88 15.0054 21.122 15.8415 21.122Z"
              fill="black"
            />
          </svg>
        </Link>
        <button onClick={() => quintaAccepted(quinta.id.toString())} className="flex hover:underline cursor-pointer items-center gap-1">
          <p>ACEPTAR</p>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8417 29.701C23.4971 29.701 29.703 23.4955 29.703 15.8407C29.703 8.18591 23.4971 1.98047 15.8417 1.98047C8.18636 1.98047 1.98047 8.18591 1.98047 15.8407C1.98047 23.4955 8.18636 29.701 15.8417 29.701Z"
              fill="#4CAF50"
            />
            <path
              d="M22.8377 9.63672L13.8609 18.6129L10.1646 14.9168L8.31641 16.7648L13.8609 22.3089L24.6859 11.4848L22.8377 9.63672Z"
              fill="#CCFF90"
            />
          </svg>
        </button>
        <button disabled={modal} onClick={() => setModal(true)} className="flex hover:underline cursor-pointer items-center gap-1">
          <p>RECHAZAR</p>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.0892 22.4414L15.8415 17.6892L20.5938 22.4414L22.4419 20.5934L17.6896 15.8412L22.4419 11.089L20.5938 9.2409L15.8415 13.9931L11.0892 9.2409L9.24107 11.089L13.9934 15.8412L9.24107 20.5934L11.0892 22.4414ZM15.8415 29.0417C14.0154 29.0417 12.2993 28.695 10.6932 28.0015C9.08706 27.308 7.68996 26.3677 6.50188 25.1806C5.3138 23.9934 4.37346 22.5963 3.68086 20.9894C2.98825 19.3824 2.64151 17.6664 2.64063 15.8412C2.63975 14.016 2.98649 12.2999 3.68086 10.693C4.37522 9.08601 5.31556 7.68895 6.50188 6.50179C7.6882 5.31462 9.0853 4.3743 10.6932 3.68083C12.301 2.98736 14.0171 2.64063 15.8415 2.64062C17.6659 2.64062 19.382 2.98736 20.9898 3.68083C22.5977 4.3743 23.9948 5.31462 25.1811 6.50179C26.3674 7.68895 27.3082 9.08601 28.0035 10.693C28.6987 12.2999 29.045 14.016 29.0424 15.8412C29.0397 17.6664 28.693 19.3824 28.0022 20.9894C27.3113 22.5963 26.371 23.9934 25.1811 25.1806C23.9913 26.3677 22.5942 27.3085 20.9898 28.0028C19.3855 28.6972 17.6694 29.0435 15.8415 29.0417Z"
              fill="#D50000"
            />
          </svg>
        </button>
        <Link
          className="flex hover:underline cursor-pointer items-center gap-1"
          href={`/quintas/${quinta.id}`}
        >
          <p>VER MAS</p>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.1612 8.90326C18.62 8.41747 18.5765 7.58318 19.0596 7.04194C19.1741 6.91263 19.3132 6.80731 19.4686 6.73206C19.6241 6.65682 19.793 6.61315 19.9655 6.60357C20.1379 6.594 20.3106 6.61871 20.4734 6.67628C20.6363 6.73385 20.7861 6.82314 20.9143 6.93897L28.1574 13.4707L28.1667 13.4787C28.4427 13.7326 28.6629 14.0412 28.8134 14.3848C28.9638 14.7284 29.0412 15.0995 29.0406 15.4746C29.04 15.8492 28.9621 16.2195 28.8117 16.5625C28.6614 16.9055 28.4418 17.2138 28.1667 17.468L20.7955 24.1872C20.668 24.3035 20.5188 24.3934 20.3565 24.4517C20.1941 24.51 20.0218 24.5356 19.8495 24.527C19.6772 24.5185 19.5084 24.4758 19.3526 24.4016C19.1969 24.3275 19.0574 24.2232 18.9421 24.0948C18.708 23.8352 18.586 23.4935 18.6028 23.1443C18.6196 22.7951 18.7739 22.4667 19.0319 22.2308L26.3952 15.5222C26.4015 15.516 26.4065 15.5086 26.4099 15.5004C26.4133 15.4922 26.415 15.4835 26.415 15.4746C26.415 15.4658 26.4133 15.457 26.4099 15.4489C26.4065 15.4407 26.4015 15.4333 26.3952 15.4271L19.1612 8.90326ZM10.5241 21.0467V20.4923C9.72488 20.7188 8.9873 21.1233 8.36662 21.6754C7.74594 22.2275 7.25827 22.9129 6.94014 23.6803C6.73685 24.1845 6.35931 24.5977 5.87617 24.8419C5.38999 25.0895 4.82974 25.1494 4.30219 25.0104C3.77465 24.8714 3.31669 24.5431 3.0156 24.0882C2.73249 23.6635 2.60258 23.1551 2.64731 22.6466V20.9649C2.64731 15.9881 5.98178 11.6728 10.5241 10.9679V9.99497C10.4916 9.50809 10.5974 9.02193 10.8293 8.59261C11.0613 8.16329 11.4099 7.80832 11.8349 7.56865C12.2788 7.32099 12.7867 7.21178 13.2931 7.25506C13.7996 7.29835 14.2816 7.49215 14.677 7.81155L21.3829 13.4193L21.3987 13.4338L21.4133 13.447C21.7055 13.7074 21.9393 14.0267 22.0992 14.3839C22.2592 14.7411 22.3416 15.1281 22.3413 15.5195C22.3416 15.9177 22.2562 16.3112 22.0908 16.6734C21.9255 17.0356 21.684 17.3579 21.3829 17.6185L14.677 23.2288C14.3827 23.4661 14.0394 23.6351 13.6718 23.7235C13.3043 23.8119 12.9217 23.8175 12.5517 23.7399C12.1817 23.6624 11.8335 23.5036 11.5324 23.275C11.2313 23.0464 10.9847 22.7538 10.8105 22.4183C10.5905 21.9957 10.4914 21.5207 10.5241 21.0454V21.0467Z"
              fill="black"
            />
          </svg>
        </Link>
      </ul>
    </div >
  );
}
