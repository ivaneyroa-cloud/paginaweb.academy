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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: 'rgba(59, 130, 246, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiGlobe style={{ width: 20, height: 20, color: '#3b82f6' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Tarifas Internacionales
          </h1>
        </div>
        <p style={{ margin: 0, paddingLeft: 52, fontSize: 14, color: '#64748b' }}>
          Edita los costos base del proveedor y configuraciones asociadas como recargo fuel.
        </p>
      </div>
      <TarifasInternacionalesTable initialTarifas={safeTarifas} initialConfig={safeConfig} />
    </>
  );
}
