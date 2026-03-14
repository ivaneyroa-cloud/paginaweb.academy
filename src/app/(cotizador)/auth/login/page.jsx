// ============================================================
// PÁGINA DE INICIO DE SESIÓN
// ============================================================
// Contiene toda la estructura visual del card de login:
// branding, descripción, el botón de Google y la info de soporte.
//
// Para reactivar el formulario email/contraseña (LoginForm):
//   1. Descomentá el import de LoginForm al final de los imports
//   2. Descomentá el <LoginForm /> en el JSX
//   3. Comentá o eliminá el import y uso de GoogleLoginButton
// ============================================================

// ---- ACTIVO: Login con Google ----
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { TbTruckDelivery } from "react-icons/tb";


// ---- DESACTIVADO: Login con email/contraseña ----
// import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    // Fondo neutro sin gradiente (el card tiene su propia sombra)
    <div className="flex min-h-screen w-full items-center justify-center px-6 md:px-10 pb-30">

      {/* ---- Card principal ---- */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col gap-6">

        {/* ---- Sección 1: Branding ---- */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Ícono de la plataforma */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md">
            <TbTruckDelivery size={40} className="text-sky-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-4">
              Bienvenido a Shippar
            </h1>
            <p className="text-sm text-slate-500 mt-3">
              Tu aliado en envíos internacionales
            </p>
          </div>
        </div>

        {/* ---- Sección 2: Separador ---- */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Acceso seguro
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ---- Sección 3: Botón de Google ---- */}
        {/* GoogleLoginButton solo se encarga del botón y su estado (loading/error) */}
        <GoogleLoginButton />

        {/* ---- DESACTIVADO: Formulario email/contraseña ----
        <LoginForm />
        ---- FIN DESACTIVADO ---- */}

      </div>
    </div>
  );
}
