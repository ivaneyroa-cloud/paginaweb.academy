'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronRight, FiArrowLeft, FiHome } from 'react-icons/fi';

const SEGMENT_LABELS = {
  admin: 'Panel Admin',
  tarifas: 'Tarifarios y Cupones',
  internacionales: 'Tarifas Internacionales',
  publicas: 'Tarifas Públicas',
  cupones: 'Cupones',
  nuevo: 'Nuevo Cupón',
  categorias: 'Categorías',
  usuarios: 'Usuarios',
  descuentos: 'Descuentos',
  configuracion: 'Configuración',
};

function labelForSegment(segment) {
  if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) return 'Editar';
  return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: labelForSegment(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  const canGoBack = segments.length > 1;

  return (
    <div className="flex items-center gap-2 mb-6">
      {/* Botón volver */}
      {canGoBack && (
        <>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all cursor-pointer active:scale-95 shadow-sm flex-shrink-0"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
          <div className="h-4 w-px bg-slate-300 flex-shrink-0" />
        </>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 min-w-0 flex-wrap">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0" title="Panel Admin">
          <FiHome className="w-3.5 h-3.5" />
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            <FiChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            {crumb.isLast ? (
              <span className="text-sm font-semibold text-slate-700 truncate">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-sm text-slate-400 hover:text-slate-700 font-medium transition-colors truncate whitespace-nowrap">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
