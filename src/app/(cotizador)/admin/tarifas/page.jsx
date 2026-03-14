import Link from 'next/link';
import { FiArrowRight, FiGlobe, FiUsers, FiTag } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

export const metadata = { title: 'Tarifarios y Cupones - Shippar' };

const SUBMODULOS = [
  {
    href: '/admin/tarifas/internacionales',
    icon: FiGlobe,
    title: 'Tarifas Internacionales',
    desc: 'Edita los costos base del proveedor (crudo) y parámetros como recargo fuel.',
    iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-100',
  },
  {
    href: '/admin/tarifas/publicas',
    icon: FiUsers,
    title: 'Tarifas Públicas',
    desc: 'Edita los multiplicadores de precio final al cliente y el recargo express.',
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100',
  },
  {
    href: '/admin/cupones',
    icon: FiTag,
    title: 'Cupones de Descuento',
    desc: 'Crea, edita o elimina cupones con descuentos porcentuales sobre la tarifa base.',
    iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-100',
  },
];

export default function TarifasHubPage() {
  return (
    <>
      <header className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-emerald-100 rounded-2xl shadow-sm">
          <MdOutlineLocalShipping className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tarifarios y Cupones</h1>
          <p className="text-slate-500 font-medium mt-1">Selecciona el submódulo que deseas administrar.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SUBMODULOS.map((modulo) => (
          <Link
            key={modulo.href}
            href={modulo.href}
            className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${modulo.hoverBorder} ${modulo.hoverShadow}`}
          >
            <div className="flex flex-col gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${modulo.iconBg} ${modulo.iconColor}`}>
                <modulo.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900">{modulo.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{modulo.desc}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              <span className="text-xs font-semibold text-slate-400 mr-2">Configurar</span>
              <FiArrowRight className={`h-4 w-4 ${modulo.iconColor}`} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
