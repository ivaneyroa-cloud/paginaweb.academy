// Admin layout — protects ALL /admin/* routes
// Forces light theme independently from the cotizador theme toggle

import { AdminBreadcrumb } from '@/shared/components/navigation/AdminBreadcrumb';
import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const { data: perfil, error } = await obtenerPerfilActual();
  const rol = perfil?.rol?.toLowerCase();

  if (error || !perfil || (rol !== 'admin' && rol !== 'superadmin')) {
    redirect('/');
  }

  return (
    <div className="admin-scope" data-theme="light" style={{
      minHeight: 'calc(100vh - 64px)',
      background: '#f8fafc',
      color: '#0f172a',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}
