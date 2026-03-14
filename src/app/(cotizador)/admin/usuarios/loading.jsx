// ============================================================
// LOADING SKELETON — /admin/usuarios
// ============================================================
// Imita la estructura de usuarios/page.jsx:
//   - Header: ícono + título + subtítulo
//   - Barra de búsqueda / acciones
//   - Tabla con filas skeleton
// ============================================================

export default function UsuariosLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto">

        {/* ---- Skeleton del header ---- */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {/* Placeholder del ícono */}
            <div className="p-2 bg-slate-200 rounded-lg w-10 h-10" />
            {/* Placeholder del título */}
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          </div>
          {/* Placeholder del subtítulo */}
          <div className="h-4 w-96 bg-slate-100 rounded-md ml-14 mt-1" />
        </div>

        {/* ---- Skeleton de la tabla ---- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Barra superior de la tabla (buscador / botones) */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="h-9 w-64 bg-slate-100 rounded-lg" />
            <div className="h-9 w-32 bg-slate-100 rounded-lg" />
          </div>

          {/* Encabezado de columnas */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-5 gap-4">
            {[120, 160, 90, 80, 70].map((w, i) => (
              <div key={i} className={`h-3 bg-slate-200 rounded`} style={{ width: `${w}px` }} />
            ))}
          </div>

          {/* Filas de datos */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="px-6 py-4 border-b border-slate-50 grid grid-cols-5 gap-4 items-center"
            >
              {/* Avatar + nombre */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="h-3 bg-slate-200 rounded w-28" />
              </div>
              {/* Email */}
              <div className="h-3 bg-slate-100 rounded w-40" />
              {/* Rol */}
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              {/* Estado */}
              <div className="h-5 w-12 bg-slate-100 rounded-full" />
              {/* Acciones */}
              <div className="h-7 w-16 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
