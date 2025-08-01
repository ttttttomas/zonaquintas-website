'use client'
import Bedroom from "../icons/Bedroom";
import Amb from "../icons/Amb";
import FiltersIcon from "../icons/Filters";
import Bathroom from "../icons/Bathroom";
import Arrow from "../Arrow";
import { useState } from "react";

export default function Filters() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [amb, setAmb] = useState<number>(1);


  const handleOpen1 = () => {
    setOpen1(!open1);
  };

  const handleOpen2 = () => {
    setOpen2(!open2);
  };

  const handleOpen3 = () => {
    setOpen3(!open3);
  };

  const handleOpen4 = () => {
    setOpen4(!open4);
  };

  return (
    <section className="grid grid-cols-2 relative md:flex flex-row my-7 w-max md:gap-32 md:text-md text-sm gap-5 mx-auto">
      <div className="flex items-center gap-2">
        <Bedroom />
        <p className="underline">{bedrooms}</p>
        <p>Habitaciones</p>
        <Arrow handleClick={handleOpen1}/>
      {open1 && 
      <ul className="flex gap-4 absolute md:top-10 top-8 left-12 text-lg">
          <li onClick={() =>{
          setBedrooms(1)
          setOpen1(false)}
          } className="cursor-pointer hover:scale-115">1</li>
          <li onClick={() =>{
          setBedrooms(2)
          setOpen1(false)}
          } className="cursor-pointer hover:scale-115">2</li>
          <li onClick={() =>{
          setBedrooms(3)
          setOpen1(false)}
          } className="cursor-pointer hover:scale-115">3</li>
          <li onClick={() =>{
          setBedrooms(4)
          setOpen1(false)}
          } className="cursor-pointer hover:scale-115">4</li>
        </ul>}
      </div>
      <div className="flex relative items-center gap-2">
        <Amb />
        <p className="underline">{amb}</p>
        <p>Ambientes</p>
        <Arrow handleClick={handleOpen2}/>
         {open2 && 
      <ul className="flex gap-4 absolute md:top-10 top-8 left-12 text-lg">
          <li onClick={() =>{
          setAmb(1)
          setOpen2(false)}
          } className="cursor-pointer hover:scale-115">1</li>
          <li onClick={() =>{
          setAmb(2)
          setOpen2(false)}
          } className="cursor-pointer hover:scale-115">2</li>
          <li onClick={() =>{
          setAmb(3)
          setOpen2(false)}
          } className="cursor-pointer hover:scale-115">3</li>
          <li onClick={() =>{
          setAmb(4)
          setOpen2(false)}
          } className="cursor-pointer hover:scale-115">4</li>
        </ul>}
      </div>
      <div className="flex relative items-center gap-2">
        <Bathroom />
        <p className="underline">{bathrooms}</p>
        <p>Baños</p>
        <Arrow handleClick={handleOpen3}/>
        {open3 && 
      <ul className="flex gap-4 absolute md:top-10 top-8 left-10 text-lg">
          <li onClick={() => {
            setBathrooms(1)
            setOpen3(false)
          }} 
          className="cursor-pointer hover:scale-115">1</li>
          <li onClick={() => {
            setBathrooms(2)
            setOpen3(false)
          }} 
          className="cursor-pointer hover:scale-115">2</li>
          <li onClick={() => {
            setBathrooms(3)
            setOpen3(false)
          }} 
          className="cursor-pointer hover:scale-115">3</li>
          <li onClick={() => {
            setBathrooms(4)
            setOpen3(false)
          }} 
          className="cursor-pointer hover:scale-115">4</li>
        </ul>}
      </div>
      <div onClick={handleOpen4} className="flex cursor-pointer hover:bg-black/10 p-2 transition-all rounded-lg items-center gap-2">
        <FiltersIcon />
        <p>Todos los filtros</p>
      </div>
    </section>
  );
}
