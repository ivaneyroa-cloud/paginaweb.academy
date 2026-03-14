import { notFound } from 'next/navigation';
import { getCuponById } from '@/features/admin/cupones/actions';
import { getTarifasInternacionales, getConfiguraciones } from '@/features/admin/tarifas/actions';
import { CuponForm } from '@/features/admin/cupones/components/CuponForm';
import { FiTag } from 'react-icons/fi';

export const metadata = { title: 'Editar Cupón - Shippar' };

export default async function EditarCuponPage({ params }) {
  const { id } = await params;

  const [cupon, tarifas, configuraciones] = await Promise.all([
    getCuponById(id),
    getTarifasInternacionales(),
    getConfiguraciones(),
  ]);

  if (!cupon) notFound();

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiTag className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Editar Cupón - <span className="text-purple-700 font-mono">{cupon.codigo}</span>
          </h1>
        </div>
        <p className="text-slate-600 ml-14">
          Modifica los parámetros del cupón. El simulador muestra el impacto en tiempo real.
        </p>
      </div>

      <CuponForm
        initialData={cupon}
        tarifasInternacionales={Array.isArray(tarifas) ? tarifas : []}
        recargoFuel={configuraciones?.recargo_fuel ?? 0}
      />
    </>
  );
}
