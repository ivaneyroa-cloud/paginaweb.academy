'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCupon, updateCupon } from '@/features/admin/cupones/actions';
import { ResultModal } from '@/shared/components/modals/ResultModal';
import { FiSave, FiX, FiTag } from 'react-icons/fi';

// ── DIFF MODAL ───────────────────────────────────────────────────────────────
function CuponDiffModal({ isOpen, onClose, onConfirm, original, next, isLoading }) {
  if (!isOpen) return null;

  const fieldLabels = {
    codigo: 'Código',
    porcentaje_descuento: 'Porcentaje de Descuento',
    activo: 'Estado',
  };

  const formatValue = (field, value) => {
    if (field === 'activo') return value ? 'Activo' : 'Inactivo';
    if (field === 'porcentaje_descuento') return `${value}%`;
    return String(value);
  };

  // Solo los campos que realmente cambiaron
  const camposModificados = Object.keys(fieldLabels).filter((field) => {
    return String(original[field]) !== String(next[field]);
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          ¿Confirmar cambios en el cupón?
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Revisa los cambios antes de guardar. Los valores anteriores se mostrarán reemplazados por los nuevos.
        </p>

        <div className="space-y-3 mb-6">
          {camposModificados.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No se detectaron cambios.</p>
          ) : (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-base">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                {next.codigo}
              </div>
              <div className="space-y-2 ml-4">
                {camposModificados.map((field) => (
                  <div key={field} className="text-sm text-slate-700 flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-600">{fieldLabels[field]}:</span>
                    <span className="text-red-600 line-through font-mono">
                      {formatValue(field, original[field])}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-600 font-semibold font-mono">
                      {formatValue(field, next[field])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`cursor-pointer px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all ${isLoading
              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
              }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || camposModificados.length === 0}
            className={`cursor-pointer px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 ${isLoading
              ? 'border-emerald-300 bg-emerald-300 text-white cursor-wait opacity-80'
              : camposModificados.length === 0
                ? 'border-slate-300 bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
          >
            <FiSave className="w-4 h-4" />
            {isLoading ? 'Guardando...' : 'Confirmar y Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SIMULADOR ────────────────────────────────────────────────────────────────
// Deriva los escalones directamente de la DB, ordenados por peso.
// Si mañana la DB tiene hasta 60 kg, el simulador mostrará hasta 60 kg.
function generarEscalones(tarifas) {
  return [...tarifas]
    .sort((a, b) => Number(a.peso) - Number(b.peso))
    .map((t) => ({ peso: Number(t.peso), precioBase: Number(t.precio_total_usd) }));
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export function CuponForm({ initialData = null, tarifasInternacionales = [], recargoFuel = 0 }) {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const escalones = useMemo(() => generarEscalones(tarifasInternacionales), [tarifasInternacionales]);

  const [codigo, setCodigo] = useState(initialData?.codigo ?? '');
  const [porcentaje, setPorcentaje] = useState(initialData?.porcentaje_descuento ?? 0);
  const [activo, setActivo] = useState(initialData?.activo ?? true);
  const [isSaving, setIsSaving] = useState(false);

  // Diff modal (solo edición)
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  // Result modal
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(true);
  const [resultContent, setResultContent] = useState({ title: '', message: '' });

  const showResult = (success, title, message) => {
    setResultSuccess(success);
    setResultContent({ title, message });
    setResultModalOpen(true);
  };

  // ── SIMULACIÓN EN VIVO ──
  const simulacion = useMemo(() => {
    const pct = Number(porcentaje) || 0;
    const fuel = Number(recargoFuel) || 0;
    return escalones.map(({ peso, precioBase }) => {
      // 1. Calculamos el recargo de fuel real sobre el precio base
      const fuelAmt = precioBase * (fuel / 100);
      const precioConFuel = precioBase + fuelAmt;
      
      // 2. El descuento se aplica sobre el total (precio base + fuel)
      const descuento = precioConFuel * (pct / 100);
      const costoVIP = precioConFuel - descuento;
      
      const precioPorKg = peso > 0 ? costoVIP / peso : 0;
      return { peso, precioBase, descuento, fuelAmt, costoVIP, precioPorKg };
    });
  }, [porcentaje, escalones, recargoFuel]);

  // ── VALIDACIÓN ──
  const validate = () => {
    if (!codigo.trim()) {
      showResult(false, 'Campo requerido', 'El código del cupón es obligatorio.');
      return false;
    }
    const pct = Number(porcentaje);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      showResult(false, 'Valor inválido', 'El porcentaje debe estar entre 0 y 100.');
      return false;
    }
    return true;
  };

  // ── GUARDAR ──
  const handleSaveClick = () => {
    if (!validate()) return;
    if (isEditing) {
      // Mostrar diff modal antes de guardar en edición
      setDiffModalOpen(true);
    } else {
      // Creación directa
      confirmSave();
    }
  };

  const confirmSave = async () => {
    setIsSaving(true);
    setDiffModalOpen(false);
    const payload = {
      codigo,
      porcentaje_descuento: Number(porcentaje),
      activo,
    };

    const result = isEditing
      ? await updateCupon(initialData.id, payload)
      : await createCupon(payload);

    setIsSaving(false);

    if (result.success) {
      showResult(
        true,
        isEditing ? 'Cupón actualizado' : 'Cupón creado',
        `El cupón **${result.cupon.codigo}** fue ${isEditing ? 'actualizado' : 'creado'} correctamente.`
      );
    } else {
      showResult(false, 'Error al guardar', result.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6 items-start">

        {/* ── COLUMNA IZQUIERDA: FORMULARIO ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiTag className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Editar Cupón' : 'Configurar Nuevo Cupón'}
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Ajusta los parámetros y previsualiza los cambios en el simulador.
            </p>
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Código del Cupón
            </label>
            <div className="relative">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej: SUMMER-VIP-15"
                className="w-full px-4 py-2.5 pr-9 border border-slate-300 rounded-xl text-sm font-mono font-semibold text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
              />
              <FiTag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Porcentaje — solo input numérico */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Porcentaje de Descuento
              </label>
              <span className="text-sm font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-lg font-mono">
                {porcentaje}%
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={porcentaje}
                onChange={(e) => setPorcentaje(Math.min(100, Math.max(0, Number(e.target.value))))}
                placeholder="Ej: 85"
                className="w-full px-4 py-2.5 pr-8 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none font-medium">
                %
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Este descuento se realizara sobre el precio del tarifario internacional (incluyendo el Fuel)
            </p>
          </div>

          {/* Toggle activo */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-700">Estado del Cupón</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {activo ? 'Activo — aplicable a nuevas cotizaciones' : 'Inactivo — no se puede usar actualmente'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivo((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${activo ? 'bg-sky-500' : 'bg-slate-300'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${activo ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isSaving
                ? 'bg-sky-400 text-white cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer active:scale-95'
                }`}
            >
              <FiSave className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar Cupón'}
            </button>
            <button
              onClick={() => router.back()}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            >
              <FiX className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: SIMULADOR ── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Simulador de Precios
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Cálculos en tiempo real basados en la tarifa internacional base + recargos vigentes.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
                <p className="text-xs text-orange-500 font-medium">Fuel / Recargo</p>
                <span className="text-sm font-bold text-orange-600 font-mono">{Number(recargoFuel).toFixed(2)}%</span>
              </div>
              <div className="text-center bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5">
                <p className="text-xs text-sky-500 font-medium">Descuento</p>
                <span className="text-sm font-bold text-sky-600 font-mono">{porcentaje}%</span>
              </div>
            </div>
          </div>

          {/* Tabla con scroll */}
          <div className="overflow-y-auto" style={{ maxHeight: '68vh' }}>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Peso (KG)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Precio Base
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-amber-500 uppercase tracking-wider whitespace-nowrap">
                    + Fuel ({recargoFuel}%)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wider whitespace-nowrap">
                    − Desc. ({porcentaje}%)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-sky-600 uppercase tracking-wider whitespace-nowrap">
                    Precio Final
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Precio/Kg
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {simulacion.map((row, i) => (
                  <tr
                    key={row.peso}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-sky-50/40 transition-colors`}
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-slate-700 font-mono">
                      {row.peso.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500 font-mono">
                      ${row.precioBase.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-500">
                      {row.fuelAmt > 0 ? `+$${row.fuelAmt.toFixed(2)}` : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-600">
                      {row.descuento > 0 ? `−$${row.descuento.toFixed(2)}` : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-sky-600 font-mono">
                      ${row.costoVIP.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400 font-mono text-xs">
                      ${row.precioPorKg.toFixed(2)}/kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>ESCALONES: <strong className="text-slate-700">{simulacion.length}</strong></span>
              {simulacion.length > 0 && (
                <span>
                  RANGO:{' '}
                  <strong className="text-slate-700">
                    {simulacion[0].peso.toFixed(1)} – {simulacion[simulacion.length - 1].peso.toFixed(1)} kg
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── DIFF MODAL (solo edición) ── */}
      {isEditing && (
        <CuponDiffModal
          isOpen={diffModalOpen}
          onClose={() => setDiffModalOpen(false)}
          onConfirm={confirmSave}
          original={{
            codigo: initialData.codigo,
            porcentaje_descuento: initialData.porcentaje_descuento,
            activo: initialData.activo,
          }}
          next={{ codigo, porcentaje_descuento: Number(porcentaje), activo }}
          isLoading={isSaving}
        />
      )}

      {/* ── RESULT MODAL ── */}
      <ResultModal
        isOpen={resultModalOpen}
        onClose={() => {
          setResultModalOpen(false);
          if (resultSuccess) router.push('/admin/cupones');
        }}
        isSuccess={resultSuccess}
        title={resultContent.title}
        message={resultContent.message}
        actionLabel={resultSuccess ? 'Ver Cupones' : 'Cerrar'}
      />
    </>
  );
}
