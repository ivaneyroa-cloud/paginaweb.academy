// ============================================================
// LOADING SKELETON — /admin (dashboard principal)
// ============================================================
// Next.js muestra este componente automáticamente mientras
// AdminPage carga sus datos del servidor (async Server Component).
//
// Imita la estructura visual de admin/page.jsx:
//   - Header: ícono + título + subtítulo
//   - Grid de 3 cards de módulos
// ============================================================

export default function AdminLoading() {
  return (
    <div className="animate-pulse">

      {/* ---- Skeleton del header ---- */}
      <header className="mb-10 flex items-center gap-4">
        {/* Placeholder del ícono */}
        <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
        <div className="flex flex-col gap-2">
          {/* Placeholder del título */}
          <div className="h-8 w-72 bg-slate-200 rounded-lg" />
          {/* Placeholder del subtítulo */}
          <div className="h-4 w-48 bg-slate-100 rounded-md" />
        </div>
      </header>

      {/* ---- Skeleton del grid de módulos ---- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Generamos 3 cards placeholder (una por módulo) */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            {/* Placeholder del ícono del módulo */}
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 bg-slate-200 rounded-xl" />
              <div className="flex flex-col gap-2">
                {/* Placeholder del título del módulo */}
                <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                {/* Placeholder de la descripción (2 líneas) */}
                <div className="h-3 w-full bg-slate-100 rounded-md" />
                <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
