// Página de éxito después del registro
// Informa al usuario que debe verificar su email

import Link from 'next/link';

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Icono de éxito */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-slate-800">
            ¡Cuenta Creada!
          </h1>

          {/* Mensaje */}
          <div className="flex flex-col gap-2">
            <p className="text-slate-600">
              Te hemos enviado un correo electrónico de confirmación.
            </p>
            <p className="text-slate-600">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
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
