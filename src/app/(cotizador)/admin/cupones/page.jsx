import Link from 'next/link';
import { getCupones } from '@/features/admin/cupones/actions';
import { CuponesListClient } from '@/features/admin/cupones/components/CuponesListClient';
import { FiTag, FiPlus } from 'react-icons/fi';

export const metadata = { title: 'Gestión de Cupones - Shippar' };

export default async function CuponesPage() {
  const cupones = await getCupones();

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiTag className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Cupones</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {Array.isArray(cupones) ? cupones.length : 0} cupón(es) registrado(s)
            </p>
          </div>
        </div>
        <Link
          href="/admin/cupones/nuevo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <FiPlus className="w-5 h-5" />
          Crear Nuevo Cupón
        </Link>
      </div>

      <CuponesListClient initialCupones={Array.isArray(cupones) ? cupones : []} />
    </>
  );
}
