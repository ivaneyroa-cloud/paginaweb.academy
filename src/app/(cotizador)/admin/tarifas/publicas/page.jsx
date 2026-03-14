import { getTarifasPublicas, getConfiguraciones } from '@/features/admin/tarifas/actions';
import { TarifasPublicasTable } from '@/features/admin/tarifas/components/TarifasPublicasTable';
import { FiUsers } from 'react-icons/fi';

export const metadata = { title: 'Tarifas Públicas - Shippar' };

export default async function TarifasPublicasPage() {
  const [tarifas, configuraciones] = await Promise.all([
    getTarifasPublicas(),
    getConfiguraciones(),
  ]);

  const safeTarifas = Array.isArray(tarifas) ? tarifas : [];
  const safeConfig = configuraciones || {
    recargo_express: 0,
    peso_limite_tarifa_publica: 31.5,
    precio_kg_extra_publico: 0,
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tarifas Públicas</h1>
        </div>
        <p className="text-slate-600 ml-14">
          Edita la tarifa base que se aplicará al cliente por kg cuando NO se ingresa cupón.
        </p>
      </div>
      <TarifasPublicasTable initialTarifas={safeTarifas} initialConfig={safeConfig} />
    </>
  );
}
