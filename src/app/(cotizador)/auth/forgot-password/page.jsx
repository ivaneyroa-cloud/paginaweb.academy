// ============================================================
// PÁGINA DE RECUPERACIÓN DE CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADA TEMPORALMENTE
// La recuperación por email no está disponible mientras el login
// sea exclusivamente con Google OAuth.
//
// Para reactivar:
//   1. Eliminá el import de "redirect" y el redirect('/auth/login')
//   2. Descomentá el import de ForgotPasswordForm y su uso en el JSX
// ============================================================

import { redirect } from 'next/navigation';

// ---- DESACTIVADO: Formulario de recuperación ----
// import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  // Redirigimos al login mientras esta funcionalidad esté desactivada
  redirect('/auth/login');

  // ---- DESACTIVADO: Render del formulario ----
  // return (
  //   <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
  //     <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
  //       <ForgotPasswordForm />
  //     </div>
  //   </div>
  // );
}
