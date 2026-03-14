import { AdminBreadcrumb } from '@/shared/components/navigation/AdminBreadcrumb';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        {/* Breadcrumb siempre en la misma posición */}
        <AdminBreadcrumb />
        {/* Contenido de cada página */}
        {children}
      </div>
    </div>
  );
}
