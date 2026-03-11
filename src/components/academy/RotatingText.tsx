"use client";

import { useEffect, useState } from "react";

const TEXTS = [
    "Sin experiencia previa necesaria",
    "Elegí productos rentables desde China",
    "Aprende a calcular los impuestos antes de importar",
];

export default function RotatingText() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % TEXTS.length);
                setFade(true);
            }, 400);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <p
            className="text-[#1a2a4a] text-xl sm:text-2xl leading-relaxed mb-0 max-w-4xl mx-auto h-10 flex items-center justify-center font-semibold whitespace-nowrap"
            style={{
                opacity: fade ? 1 : 0,
                transition: "opacity 0.4s ease-in-out",
            }}
        >
            {TEXTS[index]}
        </p>
    );
}
