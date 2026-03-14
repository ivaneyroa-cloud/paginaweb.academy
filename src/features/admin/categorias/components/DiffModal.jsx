// Modal para mostrar el diff de cambios antes de guardar
// Proporciona una vista detallada de las modificaciones pendientes

'use client';

import { FiSave } from 'react-icons/fi';

/**
 * Modal para mostrar el diff de cambios antes de guardar
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {function} onConfirm - Función para confirmar los cambios
 * @param {Object} changes - Objeto con los cambios pendientes por categoría
 * @param {Array} categorias - Array de categorías completo
 */
export function DiffModal({ isOpen, onClose, onConfirm, changes, categorias, isLoading = false }) {
  if (!isOpen) return null;

  const categoriasAfectadas = Object.keys(changes);
  const fieldLabels = {
    nombre: 'Nombre',
    derechos_importacion: 'Derechos',
    tasa_estadistica: 'Tasa Estadística',
    iva: 'IVA',
    activa: 'Estado',
  };

  // Función helper para formatear valores según el tipo de campo
  const formatValue = (field, value) => {
    if (field === 'nombre') {
      return value;
    }
    if (field === 'activa') {
      return value ? 'Visible' : 'No visible';
    }

    // Para campos numéricos, convertir cadenas vacías a 0 y formatear con 1 decimal
    const num = value === '' ? 0 : Number(value);
    const safe = Number.isFinite(num) ? num : 0;
    return `${safe.toFixed(1)}%`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          ¿Confirmar cambios en <span className="text-emerald-700">{categoriasAfectadas.length}</span> categoría(s)?
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Revisa los cambios antes de guardar. Los valores anteriores se mostrarán reemplazados por los nuevos.
        </p>

        <div className="space-y-3 mb-6">
          {categoriasAfectadas.map((catId) => {
            const categoria = categorias.find(c => c.id === catId);
            if (!categoria) return null;

            const cambios = changes[catId];
            const camposModificados = Object.keys(cambios);

            return (
              <div key={catId} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-base">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {categoria.nombre}
                </div>
                <div className="space-y-1 ml-4">
                  {camposModificados.map((field) => (
                    <div key={field} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="font-medium text-slate-600">{fieldLabels[field]}:</span>
                      <span className="text-red-600 line-through">
                        {formatValue(field, categoria[field])}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-emerald-600 font-semibold">
                        {formatValue(field, cambios[field])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`cursor-pointer px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm flex items-center gap-2 transition-all ${
              isLoading
                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-95'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`cursor-pointer px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm flex items-center gap-2 transition-all ${
              isLoading
                ? 'border-emerald-300 bg-emerald-300 text-white cursor-wait opacity-80'
                : 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-600 active:scale-95'
            }`}
          >
            <FiSave className="w-5 h-5" />
            {isLoading ? 'Guardando...' : 'Confirmar y Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
