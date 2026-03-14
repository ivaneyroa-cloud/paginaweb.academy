import Link from "next/link";
import { TbTruckDelivery } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="w-full relative bg-gradient-to-b from-sky-50/50 to-sky-100/80 border-t border-sky-200 overflow-hidden mt-auto">
      {/* Sutil gradiente de luz superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        
        {/* Marca */}
        <div className="flex items-center gap-2 group cursor-default">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-sm border border-sky-100 text-sky-600 transition-colors duration-300 group-hover:scale-105">
            <TbTruckDelivery size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">
            Shipp<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">ar</span>
          </span>
        </div>

        {/* Enlaces mínimos */}
        <div className="flex items-center gap-6 text-sm font-semibold text-sky-900/60">
          <Link href="/cotizadorv2" className="hover:text-sky-600 hover:-translate-y-0.5 transition-all duration-300">
            Cotizador
          </Link>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-200"></span>
          <Link href="/calculadora" className="hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300">
            Calculadora
          </Link>
        </div>

        {/* Derechos */}
        <p className="text-sm font-medium text-sky-900/50">
          © {new Date().getFullYear()} Shippar.
        </p>

      </div>
    </footer>
  );
}