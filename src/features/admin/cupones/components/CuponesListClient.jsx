'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteCupon, updateCuponActivo } from '@/features/admin/cupones/actions';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { ResultModal } from '@/shared/components/modals/ResultModal';
import { FiEdit3, FiTrash2, FiPauseCircle, FiPlayCircle } from 'react-icons/fi';

export function CuponesListClient({ initialCupones }) {
  const [cupones, setCupones] = useState(initialCupones);
  const [cuponTarget, setCuponTarget] = useState(null);
  const [modalType, setModalType] = useState(null); // 'delete' | 'toggle'
  const [isActioning, setIsActioning] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(true);
  const [resultContent, setResultContent] = useState({ title: '', message: '' });

  const showResult = (success, title, message) => {
    setResultSuccess(success);
    setResultContent({ title, message });
    setResultModalOpen(true);
  };

  const openDeleteModal = (cupon) => { setCuponTarget(cupon); setModalType('delete'); };
  const openToggleModal = (cupon) => { setCuponTarget(cupon); setModalType('toggle'); };
  const closeModal = () => { setCuponTarget(null); setModalType(null); };

  const handleDelete = async () => {
    setIsActioning(true);
    const result = await deleteCupon(cuponTarget.codigo);
    setIsActioning(false);
    closeModal();
    if (result.success) {
      setCupones((prev) => prev.filter((c) => c.codigo !== cuponTarget.codigo));
      showResult(true, 'Cupón eliminado', `El cupón **${cuponTarget.codigo}** fue eliminado.`);
    } else {
      showResult(false, 'Error', result.message || 'No se pudo eliminar el cupón.');
    }
  };

  const handleToggle = async () => {
    const nuevoEstado = !cuponTarget.activo;
    setIsActioning(true);
    const result = await updateCuponActivo(cuponTarget.codigo, nuevoEstado);
    setIsActioning(false);
    closeModal();
    if (result.success) {
      setCupones((prev) =>
        prev.map((c) => c.codigo === cuponTarget.codigo ? { ...c, activo: nuevoEstado } : c)
      );
      showResult(true, 'Estado actualizado', `El cupón **${cuponTarget.codigo}** ahora está ${nuevoEstado ? 'activo' : 'inactivo'}.`);
    } else {
      showResult(false, 'Error', result.message || 'No se pudo cambiar el estado.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Descuento</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {cupones.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-500">
                    <p className="font-medium mb-1">No hay cupones registrados</p>
                    <p className="text-sm text-slate-400">Crea el primer cupón con el botón de arriba.</p>
                  </td>
                </tr>
              ) : (
                cupones.map((cupon, index) => (
                  <tr
                    key={cupon.codigo}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-sky-50/30 transition-colors`}
                  >
                    {/* Código */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-bold">#</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">{cupon.codigo}</span>
                      </div>
                    </td>

                    {/* Descuento */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                        {cupon.porcentaje_descuento}%
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cupon.activo
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cupon.activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {cupon.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Editar */}
                        <Link
                          href={`/admin/cupones/${cupon.id}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Editar cupón"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </Link>

                        {/* Pausar / Activar */}
                        <button
                          onClick={() => openToggleModal(cupon)}
                          className={`p-2 rounded-lg transition-colors ${
                            cupon.activo
                              ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={cupon.activo ? 'Pausar cupón' : 'Activar cupón'}
                        >
                          {cupon.activo
                            ? <FiPauseCircle className="w-4 h-4" />
                            : <FiPlayCircle className="w-4 h-4" />
                          }
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => openDeleteModal(cupon)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar cupón"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODALES ── */}
      <ConfirmModal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Eliminar Cupón"
        message={`¿Estás seguro de eliminar el cupón **${cuponTarget?.codigo}**? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmTone="danger"
        isLoading={isActioning}
      />

      <ConfirmModal
        isOpen={modalType === 'toggle'}
        onClose={closeModal}
        onConfirm={handleToggle}
        title={cuponTarget?.activo ? 'Pausar Cupón' : 'Activar Cupón'}
        message={
          cuponTarget?.activo
            ? `¿Pausar el cupón **${cuponTarget?.codigo}**? Dejará de poder usarse en nuevas cotizaciones.`
            : `¿Activar el cupón **${cuponTarget?.codigo}**? Estará disponible para nuevas cotizaciones.`
        }
        confirmLabel={cuponTarget?.activo ? 'Pausar' : 'Activar'}
        confirmTone="primary"
        isLoading={isActioning}
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
