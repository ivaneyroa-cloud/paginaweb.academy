import Link from "next/link";
import {
  TbTruckDelivery,
  TbArrowRight,
} from "react-icons/tb";
import { IoCalculatorOutline } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { obtenerPerfilActual } from "@/lib/supabase/profile";

export default async function HomePage() {
  // Obtener el perfil del usuario
  const { data: perfil } = await obtenerPerfilActual();
  const isAdmin = perfil?.rol?.toLowerCase() === 'admin';

  return (
    <main className="py-12 relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* --- Fondo Decorativo --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-sky-200/40 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">

        {/* --- Header --- */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-sm font-medium mb-4 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Cotizador
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Shippar</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tu aliado estratégico en logística internacional.
            Gestiona envíos, calcula costos y maximiza tu rentabilidad en un solo lugar.
          </p>
        </div>

        {/* --- Grid de Acciones (Modificado para jerarquía) --- */}

        {/* --- Botón Admin Premium (Horizontal y arriba) --- */}
        {isAdmin && (
          <div className="w-full max-w-4xl mb-6 animate-fade-in">
            <Link
              href="/admin"
              className="group relative flex items-center justify-between p-4 px-6 md:px-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <MdAdminPanelSettings size={22} />
                </div>
                
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-900 transition-colors">
                    Panel de Administración
                  </h2>
                  <span className="text-sm font-medium text-slate-500 hidden sm:block">
                    Gestiona toda la plataforma desde aquí
                  </span>
                </div>

                <div className="ml-auto inline-flex items-center font-bold text-sm text-indigo-600 bg-indigo-50 py-1.5 px-3 md:px-4 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  Ingresar
                  <TbArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={16} />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Usamos grid-cols-1 md:grid-cols-3 para conservar diseño orginial de 2 vs 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">

          {/* Card: Cotizador (Ocupa 2 columnas - Protagonista) */}
          <Link
            href="/cotizadorv2"
            className="md:col-span-2 group relative flex flex-col p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Icono gigante decorativo de fondo */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <TbTruckDelivery size={200} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="h-14 w-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm">
                <TbTruckDelivery size={28} />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                Cotizador de Envíos
              </h2>
              <p className="text-slate-500 text-lg mb-8 max-w-md">
                Calcula costos de importación en tiempo real basándote en peso, volumen y destino. <span className="hidden md:inline">Ideal para generar presupuestos rápidos.</span>
              </p>

              <div className="mt-auto flex items-center text-sky-600 font-bold text-lg group-hover:gap-3 transition-all">
                Comenzar Cotización <TbArrowRight className="ml-2" />
              </div>
            </div>
          </Link>

          {/* Card: Calculadora (Ocupa 1 columna - Secundario) */}
          <Link
            href="/calculadora"
            className="md:col-span-1 group relative flex flex-col p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <IoCalculatorOutline size={120} />
            </div>

            <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <IoCalculatorOutline size={24} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              Calculadora
            </h2>
            <p className="text-slate-500 mb-6 flex-grow text-sm leading-relaxed">
              Analiza márgenes de ganancia y viabilidad financiera.
            </p>

            <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
              Calcular <TbArrowRight className="ml-2" />
            </div>
          </Link>
        </div>


      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';