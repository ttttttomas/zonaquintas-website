import Link from "next/link";

export default function Paso2Page() {
  return (
       <main className="flex items-center justify-between mx-20">
             <section className="flex flex-col items-start justify-center w-1/3">
               <h1 className="font-semibold text-xl mb-5">Sigamos con los pasos finales</h1>
               <form className="w-full flex flex-col gap-5 rounded-xl">
                 <input placeholder="Agrega un título*" className="bg-white p-2 rounded-lg" type="text" />
                 <small className="text-gray-500">Agrega mínimo 5 imágenes * (Recomendamos mostrar todas los ambientes)</small>
                 <input placeholder="Cantidad de huéspedes*" className="bg-white p-2 rounded-lg" type="file" />
                 <div className="flex flex-col gap-1">
                    <input placeholder="Ubica tu quinta en el mapa*" className="bg-white p-2 rounded-lg" type="text" />
                    <img src="/map.png" alt="mapa de zona" className="w-full mx-auto max-w-7xl h-full object-cover rounded-xl" />
                 </div>
                 <Link href={'/publicar-quinta/paso-3'} className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">Continuar</Link>
               </form>
             </section>
             <img src="/paso2.png" alt="paso 1" />
           </main>

  )
}
