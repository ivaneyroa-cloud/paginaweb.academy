// ============================================================
// PÁGINA DE ACTUALIZACIÓN DE CONTRASEÑA
// ============================================================
// ⚠️  DESACTIVADA TEMPORALMENTE
// El restablecimiento de contraseña por email no está disponible
// mientras el login sea exclusivamente con Google OAuth.
//
// Para reactivar:
//   1. Eliminá el import de "redirect" y el redirect('/auth/login')
//   2. Descomentá el import de UpdatePasswordForm y su uso en el JSX
// ============================================================

import { redirect } from 'next/navigation';

// ---- DESACTIVADO: Formulario de actualización de contraseña ----
// import { UpdatePasswordForm } from '@/features/auth/components/UpdatePasswordForm';

export default function UpdatePasswordPage() {
  // Redirigimos al login mientras esta funcionalidad esté desactivada
  redirect('/auth/login');

  // ---- DESACTIVADO: Render del formulario ----
  // return (
  //   <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
  //     <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
  //       <UpdatePasswordForm />
  //     </div>
  //   </div>
  // );
}
