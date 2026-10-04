'use client'

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Separator } from "./ui/Separator"
import { ArrowDown, ArrowUp } from "lucide-react"

const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
}

export default function EstadiaCard() {
    const [acc, setAcc] = useState(false)
    const [hover, setHover] = useState(false)

    const handleAccordion = () => {
        setAcc(prev => !prev)
    }

    const handleHover = () => {
        setHover(prev => !prev)
    }

    return (
        <motion.div
            layout
            transition={springTransition}
            onHoverStart={handleHover}
            onHoverEnd={handleHover}
            className="w-130 flex flex-col shadow-md p-2 shadow-black/10 rounded-lg overflow-hidden bg-white"
        >
            <div
                onClick={handleAccordion}
                className={`cursor-pointer flex ${acc ? 'flex-col gap-4' : 'flex-row gap-4'}`}
            >
                <motion.img
                    layout
                    src="/quinta.jpg"
                    alt="Casa quinta"
                    transition={springTransition}
                    className={`rounded-lg object-cover ${acc ? 'w-full h-[200px]' : 'w-[120px] h-[120px] shrink-0'
                        }`}
                />
                {hover && acc &&
                    <motion.p
                        layout="position"
                        transition={springTransition}
                        className="flex justify-center text-center animate-bounce w-full mx-auto mt-2 font-medium md:mx-2"
                    >
                        <ArrowUp size={20} />
                    </motion.p>}
                <motion.div
                    layout
                    transition={springTransition}
                    className="flex flex-col justify-between flex-1 min-w-0"
                >
                    <motion.p
                        layout="position"
                        transition={springTransition}
                        className={`text-lg font-medium md:mx-2 ${acc ? 'text-start' : 'text-center'}`}
                    >
                        Casa quinta en Olivos
                    </motion.p>
                    <motion.p
                        layout="position"
                        transition={springTransition}
                        className="text-gray-700 text-start font-medium md:mx-2"
                    >
                        Remedios de Escalada, 1038, Buenos Aires
                    </motion.p>
                    <motion.p
                        layout="position"
                        transition={springTransition}
                        className="text-gray-700 text-start font-medium md:mx-2"
                    >
                        1-8 de agusto de 2026
                    </motion.p>
                    <motion.p
                        layout="position"
                        transition={springTransition}
                        className="text-gray-700 text-start font-medium md:mx-2"
                    >
                        Pendiente
                    </motion.p>


                    <AnimatePresence>
                        {acc && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden flex flex-col justify-between"
                            >
                                <div className="py-1"></div>
                                <Separator color="bg-gray-200" />
                                <p className="text-start text-gray-700 py-2 font-medium md:mx-2">Monto: $10000</p>
                                <Separator color="bg-gray-200" />

                                <p className="text-start text-gray-700 py-2 font-medium md:mx-2">Fecha de expiracion de pago: 20/10/2026</p>
                                <Separator color="bg-gray-200" />

                                <Separator color="bg-gray-200" />
                                <p className="text-start text-gray-700 py-2 font-medium md:mx-2">Creada el: 18/10/2026</p>
                                <Separator color="bg-gray-200" />
                                <div className="flex justify-center mt-2 gap-10 w-full">
                                    <Link
                                        href="/"
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-orange-50 text-orange-600 px-10 py-2 rounded-lg text-center font-bold text-sm"                                >
                                        Calificar
                                    </Link>
                                    <Link
                                        href="/pay_ticket_rebill_success?id=123"
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-green-50 text-green-600 px-10 py-2 rounded-lg text-center font-bold text-sm"
                                        target="_blank"
                                    >
                                        Pagar reserva
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
            {hover && !acc &&
                <motion.p
                    layout="position"
                    transition={springTransition}
                    className="flex justify-center text-center animate-bounce w-full mx-auto mt-2 font-medium md:mx-2"
                >
                    <ArrowDown size={20} />
                </motion.p>}
        </motion.div>
    )
}
