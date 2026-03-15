// ============================================================
// LOADING SKELETON — /cotizadorv2
// ============================================================
// Se muestra automáticamente mientras getDatosCotizacion() carga
// las 4 consultas a Supabase en paralelo (categorias, configuraciones,
// tarifas_internacionales, tarifas_publicas).
//
// Imita fielmente la morfología real del cotizador:
//   1. CotizadorHeaderV2 (card con ícono + pasos)
//   2. Grid lg:grid-cols-5 → ProductCard (col-2) + BoxesCard (col-3)
//   3. DiscountCard (full-width)
//   4. Divisor con botón "Cotizar Importación"
// ============================================================

export default function CotizadorV2Loading() {
  return (
    <main className="min-h-screen p-4 py-14 lg:py-18 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===================================================== */}
        {/* 1. SKELETON DEL HEADER (CotizadorHeaderV2)            */}
        {/* Card con ícono + título + descripción + 3 pasos       */}
        {/* ===================================================== */}
        <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {/* Fila: ícono + título + descripción */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            {/* Placeholder del ícono */}
            <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-xl" />
            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              {/* Placeholder del título */}
              <div className="h-7 w-72 bg-slate-200 rounded-lg mx-auto md:mx-0" />
              {/* Placeholder de la descripción (2 líneas) */}
              <div className="h-4 w-full max-w-lg bg-slate-100 rounded-md mx-auto md:mx-0" />
              <div className="h-4 w-2/3 max-w-sm bg-slate-100 rounded-md mx-auto md:mx-0" />
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-slate-100 w-full mb-6" />

          {/* Pasos: grid de 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Badge numérico del paso */}
                <div className="flex-shrink-0 w-7 h-7 bg-slate-200 rounded-full" />
                <div className="flex flex-col gap-1.5 pt-0.5 w-full">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================== */}
        {/* 2. GRID: ProductCard (2/5) + BoxesCard (3/5)          */}
        {/* ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* --- ProductCardV2 Skeleton (col-span-2) --- */}
          {/* Contiene: header con ícono+título, selector categoría, input FOB, info box */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Header de la card: ícono + título */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 bg-slate-200 rounded-xl" />
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
            </div>

            {/* Cuerpo */}
            <div className="flex-grow p-5 space-y-5">
              {/* Selector de categoría — label + dropdown alto */}
              <div className="space-y-2">
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-xl border border-slate-200" />
              </div>

              {/* Input FOB — label + input con prefijo */}
              <div className="space-y-2">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-xl border border-slate-200" />
              </div>

              {/* Info box con detalles de la categoría */}
              <div className="mt-4 flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-shrink-0 w-5 h-5 bg-slate-200 rounded-full mt-0.5" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-3.5 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* --- BoxesCardV2 Skeleton (col-span-3) --- */}
          {/* Contiene: header, una fila de caja con 5 inputs numéricos, botón "Agregar caja" */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Header de la card */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 bg-slate-200 rounded-xl" />
              <div className="h-5 w-44 bg-slate-200 rounded-md" />
            </div>

            {/* Cuerpo */}
            <div className="flex-grow p-5 space-y-4">
              {/* Fila de inputs de una caja: peso, largo, ancho, alto */}
              {[1].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-3">
                  {/* Encabezado de la caja (label + badge) */}
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-14 bg-slate-200 rounded" />
                    <div className="h-6 w-6 bg-slate-200 rounded-full" />
                  </div>
                  {/* 4 inputs en grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1.5">
                        <div className="h-3 w-12 bg-slate-200 rounded" />
                        <div className="h-9 w-full bg-slate-100 rounded-lg border border-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Botón "Agregar caja" */}
              <div className="h-9 w-36 bg-slate-100 rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* 3. DISCOUNT CARD (full-width)                         */}
        {/* Contiene: header + input de código + botón Aplicar    */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 bg-slate-200 rounded-xl" />
            <div className="h-5 w-48 bg-slate-200 rounded-md" />
          </div>
          {/* Cuerpo: input + botón en fila */}
          <div className="p-5 flex gap-3 items-end">
            <div className="flex-1 space-y-2 max-w-sm">
              <div className="h-3.5 w-28 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-xl border border-slate-200" />
            </div>
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* ===================================================== */}
        {/* 4. DIVISOR CON BOTÓN "COTIZAR IMPORTACIÓN"            */}
        {/* ===================================================== */}
        <div className="relative my-8">
          {/* Línea punteada */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-slate-300" />
          </div>
          {/* Botón skeleton centrado */}
          <div className="relative flex justify-center">
            <div className="h-12 w-52 bg-slate-200 rounded-full" />
          </div>
        </div>

      </div>
    </main>
  );
}
