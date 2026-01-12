export default function DashboardCard() {
  return (
    <div className="border font-semibold pr-5 bg-white flex justify-between w-full">
      <div className="flex">
        <img src="quinta.jpg" width={200} height={500} alt="Quintas activas" />
        <ul className="flex flex-col justify-between px-2 py-3">
          <li>Titulo</li>
          <li>Nombre propietario</li>
          <li>Dirección</li>
          <li>Disponibilidad de la publicación</li>
          <li>Precio de la publicación (por dia)</li>
        </ul>
      </div>
      <ul className="flex flex-col justify-between py-3">
        <li>Aceptar</li>
        <li>Rechazar</li>
        <li>Dar de baja</li>
        <li>Ver detalles</li>
      </ul>
    </div>
  );
}
