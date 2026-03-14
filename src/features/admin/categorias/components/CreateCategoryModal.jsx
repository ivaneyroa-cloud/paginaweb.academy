'use client';

import { useState } from 'react';
import { HiX, HiCheck } from 'react-icons/hi';

export function CreateCategoryModal({ isOpen, onClose, onConfirm, isLoading = false }) {
  const [formData, setFormData] = useState({
    nombre: '',
    derechos: 0,
    tasa_estadistica: 3,
    iva: 21,
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      derechos: 0,
      tasa_estadistica: 3,
      iva: 21,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!formData.nombre.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }
    // Convertir cadenas vacías a 0 antes de enviar
    const cleanedFormData = {
      ...formData,
      derechos: formData.derechos === '' ? 0 : formData.derechos,
      tasa_estadistica: formData.tasa_estadistica === '' ? 0 : formData.tasa_estadistica,
      iva: formData.iva === '' ? 0 : formData.iva,
    };
    onConfirm(cleanedFormData);
    resetForm();
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    // 1. Fondo oscurecido sin blur (Estilo clásico)
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Nueva Categoría</h3>
          <button 
            onClick={handleClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nombre de la Categoría
            </label>
              <input
              type="text"
              autoFocus
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all placeholder:text-slate-400"
              placeholder="Ej: Smartphones, Textiles, Juguetes..."
            />
          </div>

          {/* Grid para impuestos numéricos */}
          <div className="space-y-6">
            
            {/* Derechos de Importación */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Derechos de Importación
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.derechos}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, derechos: val === '' ? '' : (parseFloat(val) || 0) });
                  }}
                  disabled={isLoading}
                  className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-mono text-lg text-slate-700"
                />
                <span className="absolute right-4 top-3 text-slate-400 font-medium">%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Tasa Estadística */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Tasa Estadística
                </label>
                <div className="relative mb-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tasa_estadistica}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, tasa_estadistica: val === '' ? '' : (parseFloat(val) || 0) });
                    }}
                    disabled={isLoading}
                    className="w-full pl-4 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-mono text-slate-700"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-medium">%</span>
                </div>
                
                {/* 2. Atajos Rápidos GRANDES */}
                <div className="flex gap-2">
                  {[0, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData({ ...formData, tasa_estadistica: val })}
                      disabled={isLoading}
                      className={`cursor-pointer flex-1 text-sm font-semibold px-2 py-2 rounded-md border transition-all active:scale-95 ${
                        formData.tasa_estadistica === val
                          ? 'bg-sky-100 border-sky-300 text-sky-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* IVA */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  IVA
                </label>
                <div className="relative mb-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.iva}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, iva: val === '' ? '' : (parseFloat(val) || 0) });
                    }}
                    disabled={isLoading}
                    className="w-full pl-4 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-mono text-slate-700"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-medium">%</span>
                </div>
                
                {/* 2. Atajos Rápidos GRANDES */}
                <div className="flex gap-2">
                  {[10.5, 21].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData({ ...formData, iva: val })}
                      disabled={isLoading}
                      className={`cursor-pointer flex-1 text-sm font-semibold px-2 py-2 rounded-md border transition-all active:scale-95 ${
                        formData.iva === val
                          ? 'bg-sky-100 border-sky-300 text-sky-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer de Acciones */}
          <div className="pt-6 mt-2 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className={`cursor-pointer flex-1 px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-95'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer flex-1 px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'border-emerald-300 bg-emerald-300 text-white cursor-wait opacity-80'
                  : 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-600 active:scale-95'
              }`}
            >
              <HiCheck size={20} />
              {isLoading ? 'Creando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}