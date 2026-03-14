// src/app/auth/error/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// 1. Componente interno con la lógica (el que usa searchParams)
function ContenidoError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Ha ocurrido un error desconocido';

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Icono de error */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-slate-800">
            Error de Autenticación
          </h1>

          {/* Mensaje de error */}
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>

          {/* Link para volver al login */}
          <Link
            href="/auth/login"
            className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

// 2. Componente principal (Exportación por defecto) que envuelve con Suspense
export default function ErrorPage() {
  return (
    // El fallback es lo que se muestra milisegundos mientras carga el parámetro URL
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
      <ContenidoError />
    </Suspense>
  );
}