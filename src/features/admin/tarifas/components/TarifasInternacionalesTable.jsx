'use client';

import { useMemo, useState } from 'react';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { ResultModal } from '@/shared/components/modals/ResultModal';
import {
  updateConfiguraciones,
  updateTarifasInternacionalesMasivo,
  getTarifasInternacionales,
  getConfiguraciones,
} from '@/features/admin/tarifas/actions';
import { FiEdit3, FiSave, FiX, FiDroplet, FiPackage, FiDollarSign } from 'react-icons/fi';

// ── CONFIG CARD ──────────────────────────────────────────────────────────────
// Cada card maneja su propio estado de edición de forma independiente.
function ConfigCard({ label, subtitle, suffix, currentValue, icon: Icon, iconBg, iconColor, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(currentValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setLocalValue(currentValue); // Re-sync con el valor más fresco
    setIsEditing(true);
  };

  const handleCancel = () => {
    setLocalValue(currentValue);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(localValue);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-bold text-slate-800">{label}</p>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      {isEditing ? (
        /* --- Modo edición de la card --- */
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              autoFocus
              className="w-full px-4 py-2.5 pr-10 border border-amber-300 border-l-4 border-l-amber-400 bg-amber-50 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
              {suffix}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isSaving
              ? 'bg-orange-300 text-white cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer active:scale-95'
              }`}
          >
            <FiSave className="w-4 h-4" />
            {isSaving ? '...' : 'Guardar'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-shrink-0 p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* --- Modo vista de la card --- */
        <div className="flex items-center gap-2 justify-between">
          <span className="text-2xl font-bold text-slate-800 font-mono">
            {Number(currentValue).toFixed(2)}{' '}
            <span className="text-sm font-normal text-slate-400">{suffix}</span>
          </span>
          <button
            onClick={handleEdit}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm transition-all cursor-pointer active:scale-95"
          >
            <FiEdit3 className="w-4 h-4" />
            Editar
          </button>
        </div>
      )}
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export function TarifasInternacionalesTable({ initialTarifas, initialConfig }) {
  const [tarifas, setTarifas] = useState(() =>
    initialTarifas.map((t) => ({ ...t, precio_total_usd: Number(t.precio_total_usd) }))
  );
  const [config, setConfig] = useState(initialConfig);

  // Estado exclusivo de la tabla
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPrices, setEditedPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});

  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [modalSaveOpen, setModalSaveOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(true);
  const [resultContent, setResultContent] = useState({ title: '', message: '' });

  const isBusy = isSubmitting || isRefreshing;

  const showResult = (success, title, message) => {
    setResultSuccess(success);
    setResultContent({ title, message });
    setResultModalOpen(true);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const [newTarifas, newConfig] = await Promise.all([
        getTarifasInternacionales(),
        getConfiguraciones(),
      ]);
      setTarifas(newTarifas.map((t) => ({ ...t, precio_total_usd: Number(t.precio_total_usd) })));
      setConfig(newConfig);
    } catch { /* silent */ }
    finally { setIsRefreshing(false); }
  };

  // ── CONFIG: guardar campo individual ──
  const handleSaveConfig = async (field, value) => {
    const result = await updateConfiguraciones({ [field]: value });
    if (result?.success) {
      setConfig((prev) => ({ ...prev, [field]: value }));
      showResult(true, 'Configuración guardada', 'El valor fue actualizado correctamente.');
      await refresh();
    } else {
      showResult(false, 'Error', result?.message || 'No se pudo guardar.');
    }
  };

  // ── TABLA: modo edición ──
  const enterEditMode = () => {
    const snap = {};
    tarifas.forEach((t) => (snap[t.peso] = t.precio_total_usd));
    setOriginalPrices(snap);
    setIsEditMode(true);
  };

  const exitEditMode = () => {
    setEditedPrices({});
    setOriginalPrices({});
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      if (Object.keys(editedPrices).length > 0) { setModalCancelOpen(true); return; }
      exitEditMode();
    } else {
      enterEditMode();
    }
  };

  const handlePriceChange = (peso, value) =>
    setEditedPrices((prev) => ({ ...prev, [peso]: value }));

  const getCurrentPrice = (tarifa) =>
    editedPrices[tarifa.peso] !== undefined ? editedPrices[tarifa.peso] : tarifa.precio_total_usd;

  const isCellModified = (peso) =>
    isEditMode && editedPrices[peso] !== undefined && Number(editedPrices[peso]) !== originalPrices[peso];

  const totalPriceChanges = useMemo(() =>
    Object.keys(editedPrices).filter((p) => Number(editedPrices[p]) !== originalPrices[Number(p)]).length,
    [editedPrices, originalPrices]
  );

  const hasValidationErrors = useMemo(() => {
    for (const val of Object.values(editedPrices)) {
      if (val === '' || Number(val) < 0) return true;
    }
    return false;
  }, [editedPrices]);

  const saveChanges = async () => {
    setIsSubmitting(true);
    try {
      if (Object.keys(editedPrices).length > 0) {
        const payload = Object.entries(editedPrices).map(([peso, precio]) => ({
          peso: parseFloat(peso),
          precio_total_usd: parseFloat(precio),
        }));
        const result = await updateTarifasInternacionalesMasivo(payload);
        if (!result?.success) {
          showResult(false, 'Error al guardar', result?.message || 'No se pudo guardar el tarifario.');
          return;
        }
      }
      exitEditMode();
      showResult(true, 'Cambios guardados', 'Se actualizaron todas las tarifas correctamente.');
      await refresh();
    } catch { showResult(false, 'Error inesperado', 'Revisa tu conexión e intenta nuevamente.'); }
    finally { setIsSubmitting(false); setModalSaveOpen(false); }
  };

  // ── DEFINICIÓN DE CONFIGS ──
  const configDefs = [
    {
      field: 'recargo_fuel',
      label: 'Recargo Fuel (%)',
      subtitle: 'Recargo sobre las tarifas internacionales',
      suffix: '%',
      icon: FiDroplet,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      field: 'peso_limite_tarifa_internacional',
      label: 'Peso Límite',
      subtitle: 'A partir de este peso, el precio se calcula utilizando el precio de Kg extra',
      suffix: 'kg',
      icon: FiPackage,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      field: 'precio_kg_extra_internacional',
      label: 'Precio por Kg extra',
      subtitle: 'Precio USD por kg que se cobra a partir del peso límite del cuadrante "Peso Límite"',
      suffix: 'USD',
      icon: FiDollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── CONFIGURACIONES (1/3) ── */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {configDefs.map(({ field, label, subtitle, suffix, icon, iconBg, iconColor }) => (
            <ConfigCard
              key={field}
              label={label}
              subtitle={subtitle}
              suffix={suffix}
              currentValue={config[field]}
              icon={icon}
              iconBg={iconBg}
              iconColor={iconColor}
              onSave={(value) => handleSaveConfig(field, value)}
            />
          ))}
        </div>

        {/* ── TABLA DE TARIFAS (2/3) ── */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-slate-200">
          {/* Toolbar exclusivo de la tabla */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap ${isEditMode
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-2 border-slate-300'
                }`}>
                {isEditMode ? 'Modo Edición' : 'Modo Vista'}
              </div>
              {isEditMode && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-xs text-amber-800 font-medium hidden sm:block">
                    Los cambios no se guardarán hasta confirmar
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:block">
                Tarifario Internacional del Proveedor
              </p>
              {!isEditMode ? (
                <button
                  onClick={enterEditMode}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-sky-200 bg-white text-sky-600 font-semibold text-sm shadow-sm hover:bg-sky-50 hover:border-sky-300 transition-all active:scale-95 flex items-center gap-2"
                >
                  <FiEdit3 className="w-4 h-4" />
                  Editar Tarifas
                </button>
              ) : null}
            </div>
          </div>

          {/* Tabla angosta estilo Excel */}
          <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-r border-slate-200 w-1/2">
                    Peso en Kg
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/2">
                    Precio Total (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tarifas.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-slate-500">
                      No hay tarifas cargadas
                    </td>
                  </tr>
                ) : (
                  tarifas.map((tarifa, index) => (
                    <tr
                      key={tarifa.peso}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-sky-50/40 transition-colors`}
                    >
                      <td className="px-4 py-2 text-center border-r border-slate-200 border-b border-b-slate-100">
                        <span className="text-sm font-medium text-slate-600 font-mono">
                          {tarifa.peso.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center border-b border-b-slate-100">
                        {isEditMode ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={getCurrentPrice(tarifa)}
                            onChange={(e) => handlePriceChange(tarifa.peso, e.target.value)}
                            className={`w-28 px-2 py-1 text-center text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${isCellModified(tarifa.peso)
                              ? 'bg-amber-50 border-amber-400 border-l-4'
                              : 'border-slate-300'
                              }`}
                          />
                        ) : (
                          <span className="text-sm text-slate-800 font-mono">
                            {Number(tarifa.precio_total_usd).toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── ISLA FLOTANTE (solo tabla) ── */}
      {isEditMode && (
        <div className="fixed bottom-4 md:bottom-8 left-0 right-0 z-40 px-4">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-sm font-medium text-white">Editando tarifas internacionales...</span>
              <span className="pl-3 text-sm text-slate-300 whitespace-nowrap">
                {totalPriceChanges} precio(s) modificado(s)
              </span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={toggleEditMode}
                disabled={isBusy}
                className="cursor-pointer flex-1 md:flex-none justify-center px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
                <span className="hidden md:inline">Cancelar y Salir</span>
                <span className="md:hidden">Cancelar</span>
              </button>
              <button
                onClick={() => setModalSaveOpen(true)}
                disabled={hasValidationErrors || totalPriceChanges === 0 || isBusy}
                className={`flex-1 md:flex-none justify-center px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 ${hasValidationErrors || totalPriceChanges === 0 || isBusy
                  ? 'border-slate-400 bg-slate-400 text-white cursor-not-allowed opacity-50'
                  : 'border-sky-500 bg-sky-600 text-white hover:bg-sky-700 cursor-pointer active:scale-95'
                  }`}
              >
                <FiSave className="w-5 h-5" />
                <span className="hidden md:inline">
                  {totalPriceChanges === 0 ? 'Guardar Tarifas' : `Guardar (${totalPriceChanges}) Precios`}
                </span>
                <span className="md:hidden">Guardar ({totalPriceChanges})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALES ── */}
      <ConfirmModal
        isOpen={modalCancelOpen}
        onClose={() => setModalCancelOpen(false)}
        onConfirm={() => { exitEditMode(); setModalCancelOpen(false); }}
        title="Descartar Cambios"
        message={`Tienes **${totalPriceChanges} precio(s)** modificados. ¿Seguro que deseas salir sin guardar?`}
        confirmLabel="Descartar Cambios"
        confirmTone="danger"
      />
      <ConfirmModal
        isOpen={modalSaveOpen}
        onClose={() => setModalSaveOpen(false)}
        onConfirm={saveChanges}
        title="Guardar Tarifas"
        message={`Estás a punto de guardar **${totalPriceChanges} precio(s)** en tarifas internacionales. ¿Confirmar?`}
        confirmLabel="Confirmar y Guardar"
        confirmTone="primary"
        isLoading={isSubmitting}
      />
      <ResultModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        isSuccess={resultSuccess}
        title={resultContent.title}
        message={resultContent.message}
        actionLabel="Cerrar"
      />
    </>
  );
}
