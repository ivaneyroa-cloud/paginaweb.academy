// ============================================================
// PÁGINA DE REGISTRO CON EMAIL Y CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADA TEMPORALMENTE
// El registro con email está desactivado. Los usuarios acceden
// únicamente a través de Google OAuth en /auth/login.
//
// Para reactivar:
//   1. Eliminá el import de "redirect" y el redirect('/auth/login')
//   2. Descomentá el import de SignUpForm y <SignUpForm /> en el JSX
// ============================================================

// Importamos redirect para enviar al usuario al login cuando intente acceder aquí
import { redirect } from 'next/navigation';

// ---- DESACTIVADO: Formulario de registro ----
// import { SignUpForm } from '@/features/auth/components/SignUpForm';

export default function SignUpPage() {
  // Mientras el registro esté desactivado, redirigimos al login.
  // El usuario que llegue a esta URL irá automáticamente a /auth/login.
  redirect('/auth/login');

  // ---- DESACTIVADO: Render del formulario ----
  // return (
  //   <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
  //     <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
  //       <SignUpForm />
  //     </div>
  //   </div>
  // );
}
