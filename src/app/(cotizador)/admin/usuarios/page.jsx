// Página de administración de usuarios
// Solo superadmin puede acceder a gestión de usuarios

import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { obtenerUsuarios } from '@/features/admin/usuarios/actions';
import { UsuariosTable } from '@/features/admin/usuarios/components/UsuariosTable';
import { FiUsers } from 'react-icons/fi';
import { redirect } from 'next/navigation';

export default async function UsuariosPage() {
  // Only superadmin can manage users
  const { data: perfil, error: perfilError } = await obtenerPerfilActual();
  const rol = perfil?.rol?.toLowerCase();

  if (perfilError || !perfil || rol !== 'superadmin') {
    redirect('/admin');
  }

  const { data: usuarios, error } = await obtenerUsuarios();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Usuarios
            </h1>
          </div>
          <p className="text-slate-600 ml-14">
            Administra roles y permisos. Solo vos (Super Admin) podés cambiar roles de otros usuarios.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-medium">Error al cargar usuarios</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!error && (
          <UsuariosTable
            usuariosIniciales={usuarios || []}
            currentUserId={perfil.id}
            currentUserRole={rol}
          />
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
