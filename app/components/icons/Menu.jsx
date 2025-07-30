export default function Menu({onClick}) {
  return (
        <svg onClick={onClick} className='cursor-pointer' width="20" height="" viewBox="0 0 14 10" fill="black" xmlns="http://www.w3.org/2000/svg">
            <line y1="1.25" x2="14" y2="1.25" stroke="#F9F7F5" strokeWidth="1.5"/>
            <line y1="5.25" x2="14" y2="5.25" stroke="#F9F7F5" strokeWidth="1.5"/>
            <line y1="9.25" x2="14" y2="9.25" stroke="#F9F7F5" strokeWidth="1.5"/>
        </svg>

  )
}
