import Link from 'next/link';
import { FiArrowRight, FiGlobe, FiUsers, FiTag } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Tarifarios y Cupones - Shippar' };

const SUBMODULOS = [
  {
    href: '/admin/tarifas/internacionales',
    icon: FiGlobe,
    title: 'Tarifas Internacionales',
    desc: 'Edita los costos base del proveedor (crudo) y parámetros como recargo fuel.',
    accent: '#3b82f6',
    accentBg: 'rgba(59, 130, 246, 0.08)',
  },
  {
    href: '/admin/tarifas/publicas',
    icon: FiUsers,
    title: 'Tarifas Públicas',
    desc: 'Edita los multiplicadores de precio final al cliente y el recargo express.',
    accent: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    href: '/admin/cupones',
    icon: FiTag,
    title: 'Cupones de Descuento',
    desc: 'Crea, edita o elimina cupones con descuentos porcentuales sobre la tarifa base.',
    accent: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.08)',
  },
];

export default async function TarifasHubPage() {
  const { data: perfil } = await obtenerPerfilActual();
  if (perfil?.rol?.toLowerCase() !== 'superadmin') {
    redirect('/admin');
  }

  return (
    <>
      <header style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MdOutlineLocalShipping style={{ width: 28, height: 28, color: '#10b981' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Tarifarios y Cupones
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
            Selecciona el submódulo que deseas administrar.
          </p>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {SUBMODULOS.map((modulo) => (
          <Link
            key={modulo.href}
            href={modulo.href}
            className="admin-card-hover"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.09)',
              borderRadius: 16,
              padding: 24,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'all 0.25s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 8,
              background: modulo.accentBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <modulo.icon style={{ width: 22, height: 22, color: modulo.accent }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                {modulo.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: '#64748b', margin: 0 }}>
                {modulo.desc}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: modulo.accent }}>Configurar</span>
              <FiArrowRight style={{ width: 14, height: 14, color: modulo.accent }} />
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .admin-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07) !important;
          border-color: rgba(0, 0, 0, 0.16) !important;
        }
      `}</style>
    </>
  );
}
