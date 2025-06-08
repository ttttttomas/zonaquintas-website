'use client'
import User from './icons/User'
import Menu from './icons/Menu'
import Logo from './icons/Logo'
import Link from 'next/link'
import { useState } from 'react';
import { Separator } from './ui/Separator'


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className='flex md:flex-row flex-col md:gap-0 gap-2 z-10 backdrop-blur-sm fixed top-0 w-full justify-between items-center py-2 px-10 mb-5'>
        <Link href="/" className='flex items-center gap-3'>
            <Logo height="auto" width="70px"/>
            <p className='font-semibold text-sm md:text-lg'>ZonaQuintas</p>
        </Link>
        <p className='font-semibold text-sm md:text-lg'>Encontrá, reservá y disfrutá.</p>
        <div className='bg-green-600 md:flex hidden items-center gap-5 px-3 py-1 rounded-4xl justify-between'>
            <div onClick={handleClick} className='flex items-center gap-3'>
              <Menu />
            </div>
            <User />
            {isOpen && 
            <ul className='text-white flex flex-col gap-2 top-16 right-4 text-sm absolute bg-green-600 rounded-xl px-6 py-3'>
              <Link href="/login">Iniciar sesión</Link>
              <Link href="/register">Registrate</Link>
              <Separator color='bg-gray-200' />
              <Link href="/">Publicá tu quinta</Link>
              <Link href="/">Soporte</Link>
            </ul>}
        </div>
    </header>
  )
}
