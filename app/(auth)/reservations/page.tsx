/* eslint-disable @next/next/no-img-element */
import { Separator } from '@/app/components/ui/Separator'
import Link from 'next/link'
import React from 'react'

export default function ReserservationsPage() {
  return (
    <main className='mx-10'>
      <h1 className='text-2xl font-semibold'>Mis reservas</h1>
      <section className='flex my-5 justify-between gap-10'>
      <div className='flex gap-10'>
        <div className='bg-white flex flex-col shadow-md shadow-black/50 p-2 rounded-xl'>
          <div className='flex gap-5 mb-5'>
            <img src="quinta.jpg" alt="foto de la quinta" className="size-20 object-cover rounded-xl" />
            <div>
              <p>Casa quinta en Ezeiza, Buenos Aires</p>
              <p>Galvez 657, Los Rosales</p>
            </div>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex flex-col gap-2 my-3'>
            <p className='font-semibold'>Fecha de ingreso y salida del alojamiento</p>
            <p>Ingreso 11/03/2025 | Salida 12/03/2025</p>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex flex-col gap-2 my-3'>
            <p className='font-semibold'>Cantidad de Huéspedes</p>
            <p>1 Huesped</p>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex justify-between gap-2 mt-2'>
            <span>Precio</span>
            <p className='font-semibold'>U$S 1.000</p>
            </div>
        </div>
        <div className='bg-white flex flex-col shadow-md shadow-black/50 p-2 rounded-xl'>
          <div className='flex gap-5 mb-5'>
            <img src="quinta.jpg" alt="foto de la quinta" className="size-20 object-cover rounded-xl" />
            <div>
              <p>Casa quinta en Ezeiza, Buenos Aires</p>
              <p>Galvez 657, Los Rosales</p>
            </div>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex flex-col gap-2 my-3'>
            <p className='font-semibold'>Fecha de ingreso y salida del alojamiento</p>
            <p>Ingreso 11/03/2025 | Salida 12/03/2025</p>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex flex-col gap-2 my-3'>
            <p className='font-semibold'>Cantidad de Huéspedes</p>
            <p>1 Huesped</p>
          </div>
          <Separator color='bg-gray-200' />
          <div className='text-sm flex justify-between gap-2 mt-2'>
            <span>Precio</span>
            <p className='font-semibold'>U$S 1.000</p>
            </div>
        </div>
      </div>
      <Link
        href="/my-account"
        className="bg-green-600 text-white rounded-full cursor-pointer size-42 text-center pt-16 font-bold text-2xl">
        Mis datos
      </Link>
      </section>
    </main>
  )
}
