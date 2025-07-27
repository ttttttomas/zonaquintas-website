export default function CategorySection({categorias}) {   
const calificaciones = [5, 4, 3, 2, 1];

return (
    <div className="flex flex-col md:flex-row py-6 text-sm text-gray-800 divide-y md:divide-y-0 md:divide-x divide-gray-300">
      {/* Columna izquierda - Calificación general */}
      <div className="md:w-1/5 px-4 mb-4 md:mb-0">
        <h4 className="font-semibold mb-2">Calificación general</h4>
        <div className="space-y-1">
          {calificaciones.map((num, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="w-4">{num}</span>
              <div className="w-full h-1 bg-gray-200 rounded">
                {num === 5 && <div className="h-1 bg-black rounded w-3/4"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorías */}
      {categorias.map((cat, i) => (
        <div key={i} className="md:w-1/6 px-4 flex flex-col justify-between pb-5 md:items-start text-center space-y-2">
        <div className="flex flex-col items-start">
          <span className="text-black">{cat.nombre}</span>
          <h5 className="font-bold text-lg">{cat.valor.toFixed(1)}</h5>
        </div>
          {cat.icono}
        </div>
      ))}
    </div>
  )
}
