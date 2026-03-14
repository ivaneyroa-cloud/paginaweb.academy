import { getTarifasInternacionales, getConfiguraciones } from '@/features/admin/tarifas/actions';
import { TarifasInternacionalesTable } from '@/features/admin/tarifas/components/TarifasInternacionalesTable';
import { FiGlobe } from 'react-icons/fi';

export const metadata = { title: 'Tarifas Internacionales - Shippar' };

export default async function TarifasInternacionalesPage() {
  const [tarifas, configuraciones] = await Promise.all([
    getTarifasInternacionales(),
    getConfiguraciones(),
  ]);

  const safeTarifas = Array.isArray(tarifas) ? tarifas : [];
  const safeConfig = configuraciones || {
    recargo_fuel: 0,
    peso_limite_tarifa_internacional: 31.5,
    precio_kg_extra_internacional: 0,
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiGlobe className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tarifas Internacionales</h1>
        </div>
        <p className="text-slate-600 ml-14">
          Edita los costos base del proveedor y configuraciones asociadas como recargo fuel.
        </p>
      </div>
      <TarifasInternacionalesTable initialTarifas={safeTarifas} initialConfig={safeConfig} />
    </>
  );
}
