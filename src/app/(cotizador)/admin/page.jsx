// src/app/admin/page.js — Admin Dashboard
// Uses cotizador design system (--ctz-*) for consistent UX
import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiPackage, FiArrowRight, FiLock, FiFileText } from 'react-icons/fi';
import { IoQrCodeOutline } from "react-icons/io5";
import { MdAdminPanelSettings } from 'react-icons/md';

const MODULOS_ADMIN = [
  {
    href: '/admin/usuarios',
    icon: FiUsers,
    title: 'Gestión de Usuarios',
    desc: 'Administra roles y accesos de los usuarios del sistema.',
    accent: '#3b82f6',
    accentBg: 'rgba(59, 130, 246, 0.08)',
    requiredRole: 'superadmin',
  },
  {
    href: '/admin/categorias',
    icon: FiPackage,
    title: 'Categorías e Impuestos',
    desc: 'Configuración global de aranceles y clasificación de productos.',
    accent: '#6366f1',
    accentBg: 'rgba(99, 102, 241, 0.08)',
    requiredRole: 'superadmin',
  },
  {
    href: '/admin/tarifas',
    icon: IoQrCodeOutline,
    title: 'Tarifarios y Cupones',
    desc: 'Gestiona tarifas de proveedores, multiplicadores de precios y cupones de descuento.',
    accent: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.08)',
    requiredRole: 'superadmin',
  },
  {
    href: '/admin/blog',
    icon: FiFileText,
    title: 'Blog',
    desc: 'Creá, editá y publicá artículos del blog de importación.',
    accent: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.08)',
    requiredRole: 'admin',
  },
];

function hasAccess(userRole, requiredRole) {
  if (userRole === 'superadmin') return true;
  if (userRole === 'admin' && requiredRole === 'admin') return true;
  return false;
}

const cardStyle = {
  background: 'var(--ctz-bg-elevated)',
  border: '1px solid var(--ctz-border)',
  borderRadius: 'var(--ctz-radius-lg)',
  padding: '24px',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  transition: 'all 0.25s ease',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: 'var(--ctz-shadow-sm)',
};

export default async function AdminPage() {
  const { data: perfil, error } = await obtenerPerfilActual();
  const rol = perfil?.rol?.toLowerCase();

  if (error || !perfil || (rol !== 'admin' && rol !== 'superadmin')) {
    redirect('/');
  }

  return (
    <>
      {/* HEADER */}
      <header style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--ctz-radius-md)',
          background: 'rgba(139, 92, 246, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MdAdminPanelSettings style={{ width: 28, height: 28, color: '#8b5cf6' }} />
        </div>
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            color: 'var(--ctz-text-primary)',
            margin: 0, lineHeight: 1.3,
          }}>
            Panel de Administración
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ctz-text-secondary)' }}>
            Operando como:{' '}
            <span style={{ color: 'var(--ctz-accent)', fontWeight: 600 }}>
              {perfil.nombre_completo}
            </span>
            {' · '}
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 12,
              background: rol === 'superadmin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: rol === 'superadmin' ? '#7c3aed' : '#d97706',
            }}>
              {rol === 'superadmin' ? 'Super Admin' : 'Admin'}
            </span>
          </p>
        </div>
      </header>

      {/* MÓDULOS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {MODULOS_ADMIN.map((modulo) => {
          const canAccess = hasAccess(rol, modulo.requiredRole);

          if (canAccess) {
            return (
              <Link
                key={modulo.href}
                href={modulo.href}
                style={cardStyle}
                className="admin-card-hover"
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--ctz-radius-sm)',
                  background: modulo.accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <modulo.icon style={{ width: 22, height: 22, color: modulo.accent }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700,
                    color: 'var(--ctz-text-primary)',
                    margin: '0 0 4px',
                  }}>
                    {modulo.title}
                  </h3>
                  <p style={{
                    fontSize: 13, lineHeight: 1.5,
                    color: 'var(--ctz-text-secondary)',
                    margin: 0,
                  }}>
                    {modulo.desc}
                  </p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  gap: 6, marginTop: 4,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: modulo.accent }}>
                    Configurar
                  </span>
                  <FiArrowRight style={{ width: 14, height: 14, color: modulo.accent }} />
                </div>
              </Link>
            );
          }

          return (
            <div
              key={modulo.href}
              style={{
                ...cardStyle,
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              <div style={{
                position: 'absolute', top: 12, right: 12,
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 600,
                color: 'var(--ctz-text-muted)',
                background: 'var(--ctz-bg-secondary)',
                padding: '2px 8px', borderRadius: 12,
              }}>
                <FiLock style={{ width: 10, height: 10 }} /> Solo Super Admin
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--ctz-radius-sm)',
                background: modulo.accentBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <modulo.icon style={{ width: 22, height: 22, color: modulo.accent }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ctz-text-primary)', margin: '0 0 4px' }}>
                  {modulo.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ctz-text-secondary)', margin: 0 }}>
                  {modulo.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover styles */}
      <style>{`
        .admin-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: var(--ctz-shadow-md) !important;
          border-color: var(--ctz-border-hover) !important;
        }
      `}</style>
    </>
  );
}