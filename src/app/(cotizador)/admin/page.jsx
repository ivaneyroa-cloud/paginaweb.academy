// src/app/admin/page.js
import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiPackage, FiArrowRight, FiLock, FiBarChart2 } from 'react-icons/fi';
import { IoQrCodeOutline } from "react-icons/io5";
import { MdAdminPanelSettings } from 'react-icons/md';

const MODULOS_ADMIN = [
  {
    href: '/admin/usuarios',
    icon: FiUsers,
    title: 'Gestión de Usuarios',
    desc: 'Administra roles y accesos',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300',
    hoverShadow: 'hover:shadow-blue-100',
    enabled: true,
  },
  {
    href: '/admin/categorias',
    icon: FiPackage,
    title: 'Categorías e Impuestos',
    desc: 'Configuración global de aranceles y clasificación de productos.',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
    hoverShadow: 'hover:shadow-indigo-100',
    enabled: true,
  },
  {
    href: '/admin/tarifas',
    icon: IoQrCodeOutline,
    title: 'Tarifarios y Cupones de descuentos de envío',
    desc: 'Gestiona tarifas de proveedores, multiplicadores de precios al público y cupones de descuento.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
    hoverShadow: 'hover:shadow-emerald-100',
    enabled: true,
  },
];

export default async function AdminPage() {
  const { data: perfil, error } = await obtenerPerfilActual();

  if (error || !perfil || perfil.rol?.toLowerCase() !== 'admin') {
    redirect('/');
  }

  return (
    <>
      {/* ENCABEZADO */}
      <header className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-2xl shadow-sm">
          <MdAdminPanelSettings className="w-10 h-10 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-slate-500 font-medium">
            Operando como:{' '}
            <span className="text-sky-600 font-semibold">{perfil.nombre_completo}</span>
          </p>
        </div>
      </header>

      {/* MÓDULOS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULOS_ADMIN.map((modulo) =>
          modulo.enabled ? (
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
                  <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-slate-900">
                    {modulo.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{modulo.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                <span className="text-xs font-semibold text-slate-400 mr-2">Configurar</span>
                <FiArrowRight className={`h-4 w-4 ${modulo.iconColor}`} />
              </div>
            </Link>
          ) : (
            <div
              key={modulo.href}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm opacity-60 cursor-not-allowed"
            >
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  <FiLock className="w-3 h-3" /> Próximamente
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${modulo.iconBg} ${modulo.iconColor}`}>
                  <modulo.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{modulo.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{modulo.desc}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}