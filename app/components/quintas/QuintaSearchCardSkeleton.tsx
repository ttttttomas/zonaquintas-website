export default function QuintaSearchCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row rounded-2xl p-3 shadow-md bg-white overflow-hidden w-full animate-pulse border border-gray-100">
      {/* Sección Imágenes */}
      <div className="flex justify-center">
        <div className="w-60 h-48 md:h-52 bg-gray-200 rounded-l-2xl" />
        <div className="md:flex hidden flex-col justify-between pl-2 py-2 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="size-14 bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>

      {/* Sección Info */}
      <div className="flex flex-col justify-between p-4 flex-grow space-y-4">
        <div className="space-y-3">
          {/* Título y Dirección */}
          <div className="h-6 bg-gray-200 rounded-full w-3/4 mx-auto md:mx-0" />
          <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto md:mx-0" />
          
          {/* Estrellas/Opiniones */}
          <div className="flex gap-2 justify-center md:justify-start items-center">
             <div className="h-4 bg-gray-200 rounded-full w-8" />
             <div className="h-3 bg-gray-100 rounded-full w-24" />
          </div>

          {/* Iconos (Baños, Ambientes, etc) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 py-2">
            <div className="h-4 bg-gray-100 rounded-full w-16" />
            <div className="h-4 bg-gray-100 rounded-full w-16" />
            <div className="h-4 bg-gray-100 rounded-full w-16" />
            <div className="h-4 bg-gray-100 rounded-full w-16" />
          </div>
        </div>

        {/* Precio y Botón */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-full w-28" />
            <div className="h-3 bg-gray-100 rounded-full w-20" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32" />
        </div>
      </div>
    </div>
  );
}
