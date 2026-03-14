// Página de administración de usuarios
// Permite a los administradores ver y gestionar todos los usuarios del sistema

import { obtenerUsuarios } from '@/features/admin/usuarios/actions';
import { UsuariosTable } from '@/features/admin/usuarios/components/UsuariosTable';
import { FiUsers } from 'react-icons/fi';

/**
 * Página principal de gestión de usuarios
 * Esta es un Server Component que obtiene los datos iniciales desde Supabase
 */
export default async function UsuariosPage() {
  // Obtenemos todos los usuarios al cargar la página
  const { data: usuarios, error } = await obtenerUsuarios();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado de la página */}
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
            Administra los perfiles, estados VIP y permisos de acceso de todos los usuarios registrados en Shippar
          </p>
        </div>

        {/* Mensaje de error si hubo problemas al cargar */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-medium">Error al cargar usuarios</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Tabla de usuarios */}
        {!error && (
          <UsuariosTable usuariosIniciales={usuarios || []} />
        )}
      </div>
    </div>
  );
}

/**
 * Configuración de Next.js para esta página
 * - dynamic: 'force-dynamic' asegura que siempre se obtengan datos frescos del servidor
 */
export const dynamic = 'force-dynamic';
