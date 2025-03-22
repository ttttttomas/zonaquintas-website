import Lupa from '../icons/Lupa'

export default function Form() {
  return (
    <form className='flex justify-center items-center gap-10'>
        <section className='flex gap-20 border-black/30 border w-max px-10 py-5 bg-white rounded-4xl'>
        <div className='flex flex-col items-start'>
            <p className='font-medium'>Lugar</p>
            <small className='text-black/40'>Elegí el destino</small>
        </div>

        <div className='flex flex-col items-start'>
            <p className='font-medium'>Ingreso</p>
            <small className='text-black/40'>Fecha de ingreso</small>
        </div>

        <div className='flex flex-col items-start'>
            <p className='font-medium'>Salida</p>
            <small className='text-black/40'>Fecha de egreso</small>
        </div>

        <div className='flex flex-col items-start'>
            <p className='font-medium'>Huéspedes</p>
            <small className='text-black/40'>Cantidad de personas</small>
        </div>
        </section>
        <button
         className='border-black/30 border p-2 rounded-4xl cursor-pointer'
         type="submit">
            <Lupa />
        </button>
    </form>
  )
}
