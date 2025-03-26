import User from './icons/User'
import Menu from './icons/Menu'
import Logo from './icons/Logo'


export default function Header() {
  return (
    <header className='flex z-10 backdrop-blur-md fixed top-0 w-full justify-between items-center px-10 mt-2 mb-5'>
        <div className='flex items-center gap-3'>
            <Logo height="auto" width="70px"/>
            <p className='font-semibold text-lg'>ZonaQuintas</p>
        </div>
        <p className='font-semibold text-lg'>Alquiler de casas quintas</p>
        <div className='bg-green-600 flex items-center gap-5 px-3 py-1 rounded-4xl justify-between'>
            <Menu />
            <User />
        </div>
    </header>
  )
}
