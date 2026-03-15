import { obtenerPerfilActual } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';
import { getAllBlogPosts } from '@/features/admin/blog/actions';
import BlogAdminClient from '@/features/admin/blog/components/BlogAdminClient';

export default async function AdminBlogPage() {
  const { data: perfil, error } = await obtenerPerfilActual();
  const rol = perfil?.rol?.toLowerCase();
  if (error || !perfil || (rol !== 'admin' && rol !== 'superadmin')) {
    redirect('/');
  }

  const posts = await getAllBlogPosts();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Gestión de Blog
        </h1>
        <p className="text-slate-500 mt-1">
          Creá, editá y publicá artículos del blog de Shippar.
        </p>
      </header>
      <BlogAdminClient initialPosts={posts} />
    </div>
  );
}
