import Logo from "../icons/Logo"
import Heart from "../icons/Heart"


export default function QuintaCard() {
  return (
    <div className="w-52 relative shadow-lg shadow-black/40 my-5 text-black flex flex-col items-center gap-1 rounded-xl">
        <Heart />
        <Logo height="auto" width="100%"/>
        <div className="bg-white w-full flex flex-col rounded-b-xl">
        <p className="text-lg text-center">Ezeiza, Buenos Aires</p>
        <small className="text-black/50 text-center">Galvez 657, Los Rosales</small>
        <ul className="flex text-sm justify-between px-5">
            <li className="text-black/50">IN 14/3 </li>
            <li className="text-black/50"> OUT 17/3</li>
        </ul>
        <p className="font-bold my-2 text-center">$760.000.-</p>
        </div>
    </div>
  )
}
