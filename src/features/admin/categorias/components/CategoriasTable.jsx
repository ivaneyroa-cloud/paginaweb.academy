// Componente de tabla de categorías con edición masiva tipo hoja de cálculo
// Maneja la visualización y edición de tasas impositivas de categorías

'use client';

import { useMemo, useState } from 'react';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { ResultModal } from '@/shared/components/modals/ResultModal';
import { updateCategoriasMasivo, createCategoria as createCategoriaAction, deleteCategoria as deleteCategoriaAction, getCategorias } from '../actions';
import { DiffModal } from './DiffModal';
import { CreateCategoryModal } from './CreateCategoryModal';
import { 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiPlus,
  FiSave,
  FiX 
} from 'react-icons/fi';


// Opciones predefinidas para los selectores
const IVA_OPTIONS = [
  { value: 10.5, label: '10.5%' },
  { value: 21, label: '21%' },
  { value: 'custom', label: 'Otro' },
];

const TASA_OPTIONS = [
  { value: 0, label: '0%' },
  { value: 3, label: '3%' },
  { value: 'custom', label: 'Otro' },
];

/**
 * Componente principal de la tabla de categorías
 */
const normalizeCategoria = (cat) => ({
  ...cat,
  derechos_importacion: Number(cat.derechos_importacion) || 0,
  tasa_estadistica: Number(cat.tasa_estadistica) || 0,
  iva: Number(cat.iva) || 0,
  activa: typeof cat.activa === 'boolean' ? cat.activa : (cat.activo ?? true),
  eliminado: cat.eliminado ?? false,
});

export function CategoriasTable({ categoriasIniciales }) {
  // ===============================================
  // ESTADOS DEL COMPONENTE
  // ===============================================
  
  const [categorias, setCategorias] = useState(() => categoriasIniciales.map(normalizeCategoria));
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [originalData, setOriginalData] = useState({}); // Snapshot de datos originales
  const [customValues, setCustomValues] = useState({});
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [modalDiffOpen, setModalDiffOpen] = useState(false); // Modal de confirmación de cambios
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(true);
  const [resultContent, setResultContent] = useState({ title: '', message: '' });

  const isBusy = isSubmitting || isRefreshing;
  const isLoading = isBusy;

  const showResult = (success, title, message) => {
    setResultSuccess(success);
    setResultContent({ title, message });
    setResultModalOpen(true);
  };

  const refreshCategorias = async () => {
    setIsRefreshing(true);
    try {
      const data = await getCategorias();
      setCategorias(data.map(normalizeCategoria));
    } catch (error) {
      console.error('Error al refrescar categorías', error);
      showResult(false, 'No se pudo refrescar', 'Intenta nuevamente obtener las categorías desde la base de datos.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ===============================================
  // CATEGORÍAS FILTRADAS
  // ===============================================
  
  const categoriasVisibles = useMemo(() => {
    return categorias
      .filter(cat => !cat.eliminado)
      .filter(cat => 
        (cat.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
  }, [categorias, searchTerm]);

  // ===============================================
  // FUNCIONES DE EDICIÓN
  // ===============================================

  const toggleEditMode = () => {
    if (isEditMode) {
      // Si hay cambios pendientes, mostrar confirmación
      if (Object.keys(editedData).length > 0) {
        setModalCancelOpen(true);
        return;
      }
      // Si no hay cambios, salir directamente
      setEditedData({});
      setCustomValues({});
      setOriginalData({});
    } else {
      // Al ENTRAR en modo edición, crear snapshot de datos originales
      const snapshot = {};
      categorias.forEach(cat => {
        snapshot[cat.id] = {
          nombre: cat.nombre,
          derechos_importacion: cat.derechos_importacion,
          tasa_estadistica: cat.tasa_estadistica,
          iva: cat.iva,
          activa: cat.activa,
        };
      });
      setOriginalData(snapshot);
    }
    setIsEditMode(!isEditMode);
  };

  const confirmCancel = () => {
    setEditedData({});
    setCustomValues({});
    setOriginalData({});
    setIsEditMode(false);
    setModalCancelOpen(false);
  };

  const handleEdit = (id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const handleCustomValue = (id, field, value) => {
    setCustomValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const openDiffModal = () => {
    setModalDiffOpen(true);
  };

  const saveChanges = async () => {
    if (hasValidationErrors || Object.keys(editedData).length === 0) return;

    const categoriasModificadas = Object.entries(editedData)
      .map(([id, cambios]) => {
        const base = categorias.find((cat) => cat.id === id);
        if (!base) return null;

        const merged = {
          ...base,
          ...cambios,
        };

        return {
          id,
          nombre: merged.nombre?.trim() || base.nombre,
          derechos_importacion: merged.derechos_importacion === '' ? 0 : parseFloat(merged.derechos_importacion),
          tasa_estadistica: merged.tasa_estadistica === '' ? 0 : parseFloat(merged.tasa_estadistica),
          iva: merged.iva === '' ? 0 : parseFloat(merged.iva),
          activa: Boolean(merged.activa),
        };
      })
      .filter(Boolean);

    if (categoriasModificadas.length === 0) return;
    console.log('Categorías a modificar:', categoriasModificadas);

    setIsSubmitting(true);

    try {
      const result = await updateCategoriasMasivo(categoriasModificadas);

      if (!result?.success) {
        showResult(false, 'No se guardaron los cambios', result?.message || 'Ocurrió un problema al actualizar en Supabase.');
        return;
      }

      setCategorias((prev) =>
        prev.map((cat) => {
          const updated = categoriasModificadas.find((c) => c.id === cat.id);
          return updated ? normalizeCategoria({ ...cat, ...updated }) : cat;
        })
      );

      setEditedData({});
      setCustomValues({});
      setOriginalData({});
      setIsEditMode(false);
      showResult(true, 'Cambios guardados', `Se actualizaron ${result.count ?? categoriasModificadas.length} categoría(s).`);
      await refreshCategorias();
    } catch (error) {
      console.error('Error al guardar cambios', error);
      showResult(false, 'Error al guardar', 'Revisa tu conexión y vuelve a intentar.');
    } finally {
      setIsSubmitting(false);
      setModalDiffOpen(false);
    }
  };

  // ===============================================
  // FUNCIONES DE GESTIÓN
  // ===============================================

  const toggleActiva = (id) => {
    setCategorias(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, activa: !cat.activa } : cat
      )
    );
  };

  const openDeleteModal = (categoria) => {
    setCategoryToDelete(categoria);
    setModalDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCategoriaAction(categoryToDelete.id);
      if (!result?.success) {
        showResult(false, 'No se pudo eliminar', result?.error || 'Intenta nuevamente eliminar la categoría.');
        return;
      }

      setCategorias((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      showResult(true, 'Categoría eliminada', `Se eliminó la categoría **${categoryToDelete.nombre}** correctamente.`);
      await refreshCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría', error);
      showResult(false, 'Error al eliminar', 'Revisa tu conexión y vuelve a intentar.');
    } finally {
      setIsSubmitting(false);
      setModalDeleteOpen(false);
      setCategoryToDelete(null);
    }
  };

  const createCategory = async (formData) => {
    setIsSubmitting(true);

    const payload = {
      nombre: formData.nombre?.trim(),
      derechos_importacion: formData.derechos === '' ? 0 : parseFloat(formData.derechos),
      tasa_estadistica: formData.tasa_estadistica === '' ? 0 : parseFloat(formData.tasa_estadistica),
      iva: formData.iva === '' ? 0 : parseFloat(formData.iva),
      activa: true,
    };

    try {
      const result = await createCategoriaAction(payload);
      if (!result?.success) {
        showResult(false, 'No se pudo crear', result?.error || 'Intenta nuevamente crear la categoría.');
        return;
      }

      await refreshCategorias();
      showResult(true, 'Categoría creada', `La categoría **${payload.nombre}** se creó correctamente.`);
    } catch (error) {
      console.error('Error al crear categoría', error);
      showResult(false, 'Error al crear', 'Revisa tu conexión y vuelve a intentar.');
    } finally {
      setIsSubmitting(false);
      setModalCreateOpen(false);
    }
  };

  // ===============================================
  // FUNCIÓN PARA OBTENER VALOR ACTUAL
  // ===============================================

  const getCurrentValue = (categoria, field) => {
    if (isEditMode && editedData[categoria.id]?.[field] !== undefined) {
      return editedData[categoria.id][field];
    }
    return categoria[field];
  };

  // ===============================================
  // VALIDACIÓN DE ERRORES
  // ===============================================

  const hasValidationErrors = useMemo(() => {
    if (!isEditMode) return false;
    
    // Verificar si algún valor editado es negativo o el nombre está vacío
    for (const id in editedData) {
      const data = editedData[id];
      if (data.nombre !== undefined && data.nombre.trim() === '') return true;
      // Tratar cadenas vacías como 0 para validación
      if (data.derechos_importacion !== undefined && (data.derechos_importacion === '' ? 0 : data.derechos_importacion) < 0) return true;
      if (data.tasa_estadistica !== undefined && (data.tasa_estadistica === '' ? 0 : data.tasa_estadistica) < 0) return true;
      if (data.iva !== undefined && (data.iva === '' ? 0 : data.iva) < 0) return true;
    }
    return false;
  }, [editedData, isEditMode]);

  // Función helper para verificar si un campo específico tiene error
  const hasFieldError = (categoriaId, field) => {
    // Primero verifica si hay valor editado, sino usa el original
    let value;
    if (editedData[categoriaId]?.[field] !== undefined) {
      value = editedData[categoriaId][field];
    } else {
      const categoria = categorias.find(c => c.id === categoriaId);
      value = categoria ? categoria[field] : (field === 'nombre' ? '' : 0);
    }
    // Para el nombre, verificar si está vacío
    if (field === 'nombre') {
      return typeof value === 'string' && value.trim() === '';
    }
    // Para campos numéricos, verificar si es negativo (cadena vacía se trata como 0)
    const numValue = value === '' ? 0 : value;
    return numValue < 0;
  };

  // ===============================================
  // DETECCIÓN DE CAMBIOS (DIRTY STATE)
  // ===============================================

  // Verifica si una celda específica ha sido modificada
  const isCellModified = (categoriaId, field) => {
    if (!isEditMode || !originalData[categoriaId]) return false;
    
    // Obtener el valor actual (editado o no)
    let currentValue;
    if (editedData[categoriaId]?.[field] !== undefined) {
      currentValue = editedData[categoriaId][field];
    } else {
      const categoria = categorias.find(c => c.id === categoriaId);
      currentValue = categoria ? categoria[field] : null;
    }
    
    const originalValue = originalData[categoriaId][field];
    
    return currentValue !== originalValue;
  };

  // ===============================================
  // RENDERIZADO
  // ===============================================

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Barra de herramientas */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Buscador e Indicador de modo */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1 w-full lg:w-auto">
              <div className="relative flex-1 w-full sm:max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              {/* Indicador de Modo */}
              <div className={`px-4 py-1 rounded-lg font-extrabold text-base sm:text-lg whitespace-nowrap ${
                isEditMode 
                  ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' 
                  : 'bg-slate-100 text-slate-700 border-2 border-slate-300'
              }`}>
                {isEditMode ? 'Modo Edición' : 'Modo Vista'}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 w-full lg:w-auto">
              {!isEditMode && (
                <>
                  {/* Botón Estilo (Outline Blue) */}
                  <button
                    onClick={toggleEditMode}
                    className="cursor-pointer px-5 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-600 font-semibold text-sm shadow-sm hover:bg-sky-50 hover:border-sky-300 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FiEdit3 className="w-5 h-5" />
                    Editar Categorías
                  </button>
                  
                  {/* Botón Estilo (Soft Green) */}
                  <button
                    onClick={() => setModalCreateOpen(true)}
                    className="cursor-pointer px-5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-100 text-emerald-700 font-semibold text-sm shadow-sm hover:bg-emerald-200 hover:border-emerald-300 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FiPlus className="w-5 h-5" />
                    Nueva Categoría
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Indicador de modo edición */}
          {isEditMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-800 font-medium">
                Modo Edición Activo - Los cambios no se guardarán hasta presionar "Revisar y Guardar Cambios"
              </span>
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className={`overflow-x-auto ${isEditMode ? 'pb-2' : ''}`}>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider w-32">
                  Derechos de Importación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider w-48">
                  Tasa Estadística
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider w-48">
                  IVA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {categoriasVisibles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron categorías
                  </td>
                </tr>
              ) : (
                categoriasVisibles.map((categoria, index) => (
                  <tr
                    key={categoria.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-100/70'} transition-colors`}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={getCurrentValue(categoria, 'nombre')}
                          onChange={(e) => handleEdit(categoria.id, 'nombre', e.target.value)}
                          className={`w-full min-w-[150px] px-2 py-1 text-sm font-medium border rounded focus:outline-none focus:ring-2 ${
                            hasFieldError(categoria.id, 'nombre')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-slate-300 focus:ring-sky-500'
                          } ${
                            isCellModified(categoria.id, 'nombre')
                              ? 'bg-amber-50 border-l-4 border-l-amber-400'
                              : ''
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-900">
                          {categoria.nombre}
                        </span>
                      )}
                    </td>

                    {/* Derechos */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isEditMode ? (
                        <input
                          type="number"
                          value={getCurrentValue(categoria, 'derechos_importacion')}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleEdit(categoria.id, 'derechos_importacion', val === '' ? '' : (parseFloat(val) || 0));
                          }}
                          className={`w-16 sm:w-20 px-2 py-1 text-right text-sm font-mono border rounded focus:outline-none focus:ring-2 ${
                            hasFieldError(categoria.id, 'derechos_importacion')
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-slate-300 focus:ring-sky-500'
                          } ${
                            isCellModified(categoria.id, 'derechos_importacion')
                              ? 'bg-amber-50 border-l-4 border-l-amber-400'
                              : ''
                          }`}
                          step="0.1"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm text-slate-900 font-mono">
                          {categoria.derechos_importacion.toFixed(1)}%
                        </span>
                      )}
                    </td>

                    {/* Tasa Estadística */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isEditMode ? (
                        <div className="inline-flex items-center justify-end gap-1 sm:gap-2 w-28 sm:w-36">
                          <select
                            value={
                              customValues[categoria.id]?.tasa_estadistica !== undefined
                                ? 'custom'
                                : getCurrentValue(categoria, 'tasa_estadistica')
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'custom') {
                                handleCustomValue(categoria.id, 'tasa_estadistica', getCurrentValue(categoria, 'tasa_estadistica'));
                              } else {
                                handleEdit(categoria.id, 'tasa_estadistica', parseFloat(val));
                                handleCustomValue(categoria.id, 'tasa_estadistica', undefined);
                              }
                            }}
                            disabled={isLoading}
                            className={`flex-shrink-0 w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              isCellModified(categoria.id, 'tasa_estadistica')
                                ? 'bg-amber-50 border-l-4 border-l-amber-400'
                                : 'border-slate-300'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {TASA_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {customValues[categoria.id]?.tasa_estadistica !== undefined && (
                            <input
                              type="number"
                              value={getCurrentValue(categoria, 'tasa_estadistica')}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleEdit(categoria.id, 'tasa_estadistica', val === '' ? '' : (parseFloat(val) || 0));
                              }}
                              disabled={isLoading}
                              className={`flex-shrink-0 w-12 sm:w-16 px-1 sm:px-2 py-1 text-right text-xs sm:text-sm font-mono border rounded focus:outline-none focus:ring-2 ${
                                hasFieldError(categoria.id, 'tasa_estadistica')
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 focus:ring-sky-500'
                              } ${
                                isCellModified(categoria.id, 'tasa_estadistica')
                                  ? 'bg-amber-50 border-l-4 border-l-amber-400'
                                  : ''
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              step="0.1"
                              min="0"
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-900 font-mono">
                          {categoria.tasa_estadistica.toFixed(1)}%
                        </span>
                      )}
                    </td>

                    {/* IVA */}
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {isEditMode ? (
                        <div className="inline-flex items-center justify-end gap-1 sm:gap-2 w-28 sm:w-36">
                          <select
                            value={
                              customValues[categoria.id]?.iva !== undefined
                                ? 'custom'
                                : getCurrentValue(categoria, 'iva')
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'custom') {
                                handleCustomValue(categoria.id, 'iva', getCurrentValue(categoria, 'iva'));
                              } else {
                                handleEdit(categoria.id, 'iva', parseFloat(val));
                                handleCustomValue(categoria.id, 'iva', undefined);
                              }
                            }}
                            disabled={isLoading}
                            className={`flex-shrink-0 w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              isCellModified(categoria.id, 'iva')
                                ? 'bg-amber-50 border-l-4 border-l-amber-400'
                                : 'border-slate-300'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {IVA_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {customValues[categoria.id]?.iva !== undefined && (
                            <input
                              type="number"
                              value={getCurrentValue(categoria, 'iva')}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleEdit(categoria.id, 'iva', val === '' ? '' : (parseFloat(val) || 0));
                              }}
                              disabled={isLoading}
                              className={`flex-shrink-0 w-12 sm:w-16 px-1 sm:px-2 py-1 text-right text-xs sm:text-sm font-mono border rounded focus:outline-none focus:ring-2 ${
                                hasFieldError(categoria.id, 'iva')
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 focus:ring-sky-500'
                              } ${
                                isCellModified(categoria.id, 'iva')
                                  ? 'bg-amber-50 border-l-4 border-l-amber-400'
                                  : ''
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              step="0.1"
                              min="0"
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-900 font-mono">
                          {categoria.iva.toFixed(1)}%
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {isEditMode ? (
                        <select
                          value={getCurrentValue(categoria, 'activa') ? 'visible' : 'no-visible'}
                          onChange={(e) => handleEdit(categoria.id, 'activa', e.target.value === 'visible')}
                          disabled={isLoading}
                          className={`w-24 sm:w-28 px-2 py-1 text-xs sm:text-sm border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                            isCellModified(categoria.id, 'activa')
                              ? 'bg-amber-50 border-l-4 border-l-amber-400'
                              : 'border-slate-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="visible">Visible</option>
                          <option value="no-visible">No visible</option>
                        </select>
                      ) : (
                        <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                          categoria.activa 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {categoria.activa ? 'Visible' : 'No visible'}
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openDeleteModal(categoria)}
                        disabled={isEditMode || isLoading}
                        className={`cursor-pointer text-red-600 hover:text-red-800 transition-colors ${
                          (isEditMode || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Eliminar categoría"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

{/* Isla Flotante de Guardado */}
      {isEditMode && (
        <div className="fixed bottom-4 md:bottom-8 left-0 right-0 z-40 px-4">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between transition-all duration-300 gap-4 md:gap-0">
            
            {/* Sección Izquierda: Estado */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-sm font-medium text-white whitespace-nowrap">
                Editando categorías...
              </span>
              <span className="pl-3 text-sm text-slate-300 whitespace-nowrap">
                {Object.keys(editedData).length} cambio(s) pendiente(s)
              </span>
            </div>
            
            {/* Sección Derecha: Botones */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={toggleEditMode}
                disabled={isBusy}
                className={`cursor-pointer flex-1 md:flex-none justify-center px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm transition-all flex items-center gap-2 ${
                  isBusy
                    ? 'border-slate-300 bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-95'
                }`}
              >
                <FiX className="w-5 h-5 flex-shrink-0" />
                {/* Texto largo para Desktop */}
                <span className="hidden md:inline">Cancelar y Salir del Modo Edición</span>
                {/* Texto corto para Mobile */}
                <span className="md:hidden">Cancelar</span>
              </button>
              
              <button
                onClick={openDiffModal}
                disabled={hasValidationErrors || Object.keys(editedData).length === 0 || isBusy}
                title={
                  hasValidationErrors 
                    ? 'Corrige los errores antes de guardar' 
                    : Object.keys(editedData).length === 0
                      ? 'No hay cambios para revisar'
                      : isBusy
                        ? 'Esperando respuesta del servidor'
                        : 'Revisar cambios pendientes'
                }
                className={`flex-1 md:flex-none justify-center px-5 py-2.5 rounded-xl border font-semibold text-sm shadow-sm transition-all flex items-center gap-2 ${
                  hasValidationErrors || Object.keys(editedData).length === 0 || isBusy
                    ? 'border-slate-400 bg-slate-400 text-white cursor-not-allowed opacity-50'
                    : 'border-sky-500 bg-sky-600 text-white hover:bg-sky-700 hover:border-sky-600 cursor-pointer active:scale-95'
                }`}
              >
                <FiSave className="w-5 h-5 flex-shrink-0" />
                {/* Texto largo para Desktop */}
                <span className="hidden md:inline">
                  {Object.keys(editedData).length === 0
                    ? 'Revisar y Guardar Cambios'
                    : `Revisar y Guardar (${Object.keys(editedData).length}) Cambios`}
                </span>
                {/* Texto corto para Mobile */}
                <span className="md:hidden">
                  Guardar ({Object.keys(editedData).length})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear categoría */}
      <CreateCategoryModal
        isOpen={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        onConfirm={createCategory}
        isLoading={isSubmitting}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={modalDeleteOpen}
        onClose={() => {
          setModalDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría **${categoryToDelete?.nombre}**? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmTone="danger"
        isLoading={isSubmitting}
      />

      {/* Modal de confirmación de cancelación */}
      <ConfirmModal
        isOpen={modalCancelOpen}
        onClose={() => setModalCancelOpen(false)}
        onConfirm={confirmCancel}
        title="Descartar Cambios"
        message={`Tienes **${Object.keys(editedData).length} cambio(s)** sin guardar. ¿Estás seguro de que deseas salir del modo edición sin guardar? Todos los cambios se perderán.`}
        confirmLabel="Descartar Cambios"
        confirmTone="danger"
      />

      {/* Modal de confirmación de cambios (Diff) */}
      <DiffModal
        isOpen={modalDiffOpen}
        onClose={() => setModalDiffOpen(false)}
        onConfirm={saveChanges}
        changes={editedData}
        categorias={categorias}
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