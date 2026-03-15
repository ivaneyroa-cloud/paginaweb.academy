import { CategoriasTable } from '@/features/admin/categorias/components/CategoriasTable';
import { getCategorias } from '@/features/admin/categorias/actions';
import { TbCategory } from 'react-icons/tb';
import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';

export default async function CategoriasPage() {
  // Only superadmin can access categorias
  const { data: perfil } = await obtenerPerfilActual();
  if (perfil?.rol?.toLowerCase() !== 'superadmin') {
    redirect('/admin');
  }

  const categorias = await getCategorias();
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-sky-100 rounded-lg">
            <TbCategory className="w-6 h-6 text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Categorías</h1>
        </div>
        <p className="text-slate-600 ml-14">
          Administra las categorías de productos y sus tasas impositivas (Derechos, IVA, Tasa Estadística)
        </p>
      </div>
      <CategoriasTable categoriasIniciales={categorias} />
    </>
  );
}
