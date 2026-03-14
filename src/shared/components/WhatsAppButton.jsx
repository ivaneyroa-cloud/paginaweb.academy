"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  // Definís acá el número y el mensaje 👇
  const phone = "5491139243790";
  const message =
    "Hola! Te escribo desde el cotizador y la calculadora de rentabilidad de Shippar. Me gustaría recibir más información sobre... ";
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed 
        bottom-4 right-4
        md:bottom-8 md:right-8
        flex items-center gap-2
        bg-green-500 hover:bg-green-600 
        text-white px-4 py-4 
        rounded-full shadow-lg z-50 
        transition-transform duration-200 hover:scale-110
      "
    >
      <FaWhatsapp size={34} />{" "}
    </Link>
  );
}
