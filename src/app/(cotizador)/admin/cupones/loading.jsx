// ============================================================
// LOADING SKELETON — /admin/cupones
// ============================================================
// Imita la estructura de cupones/page.jsx:
//   - Header: ícono + título + subtítulo
//   - Tabla con filas skeleton
// ============================================================

export default function CuponesLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto">

        {/* ---- Skeleton del header ---- */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-200 rounded-lg w-10 h-10" />
            <div className="h-8 w-56 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-4 w-80 bg-slate-100 rounded-md ml-14 mt-1" />
        </div>

        {/* ---- Skeleton de la tabla ---- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Barra superior */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="h-9 w-64 bg-slate-100 rounded-lg" />
            <div className="h-9 w-36 bg-slate-100 rounded-lg" />
          </div>

          {/* Encabezado de columnas */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex gap-8">
            {[90, 120, 70, 90, 80, 60].map((w, i) => (
              <div key={i} className="h-3 bg-slate-200 rounded" style={{ width: `${w}px` }} />
            ))}
          </div>

          {/* Filas */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="px-6 py-4 border-b border-slate-50 flex gap-8 items-center">
              <div className="h-5 w-24 bg-slate-200 rounded-full font-mono" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-7 w-16 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
