// ============================================================
// ACCIONES DEL SERVIDOR - Autenticación con Supabase
// ============================================================
// Estas funciones se ejecutan SOLO en el servidor (Next.js Server Actions).
// No son llamadas directamente por el navegador; el navegador las invoca
// a través de formularios o funciones con 'use server'.
//
// ACTIVO:     signInWithGoogle  → Login con Google OAuth
// DESACTIVADO: login, signUp, forgotPassword, updatePassword (flujos de email)
// ============================================================

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Acción para iniciar sesión con email y contraseña
 * @param {FormData} formData - Datos del formulario con email y password
 * @returns {Promise<{error?: string}>} Objeto con error si hay algún problema
 */
export async function login(formData) {
  const supabase = await createClient();

  const email = formData.get('email');
  const password = formData.get('password');

  // Validar que los campos no estén vacíos
  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  // Intentar iniciar sesión
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Revalidar el layout para que se actualice el estado de autenticación
  revalidatePath('/', 'layout');
  
  // Redirigir al usuario a la página principal después del login exitoso
  redirect('/');
}

/**
 * Acción para registrar un nuevo usuario
 * @param {FormData} formData - Datos del formulario con email y password
 * @returns {Promise<{error?: string}>} Objeto con error si hay algún problema
 */
export async function signUp(formData) {
  
  const supabase = await createClient();

  const email = formData.get('email');
  const password = formData.get('password');
  const nombre_completo = formData.get('nombre_completo');
  console.log(nombre_completo);

  // Validar que los campos no estén vacíos
  if (!email || !password || !nombre_completo) {
    return { error: 'Email, contraseña y nombre completo son requeridos' };
  }

  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  // Intentar registrar al usuario
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Redirigir al usuario después de confirmar su email
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
      data: {
        full_name: nombre_completo,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirigir a la página de éxito para que el usuario revise su email
  redirect('/auth/sign-up-success');
}

/**
 * Acción para cerrar sesión
 */
export async function logout() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  // Redirigir al login después de cerrar sesión
  redirect('/auth/login');
}

/**
 * Acción para solicitar restablecimiento de contraseña
 * @param {FormData} formData - Datos del formulario con email
 * @returns {Promise<{error?: string, success?: boolean}>} Objeto con error o éxito
 */
export async function forgotPassword(formData) {
  const supabase = await createClient();

  const email = formData.get('email');

  // Validar que el email no esté vacío
  if (!email) {
    return { error: 'Email es requerido' };
  }

  // Enviar email de recuperación
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Acción para actualizar la contraseña
 * @param {FormData} formData - Datos del formulario con la nueva contraseña
 * @returns {Promise<{error?: string}>} Objeto con error si hay algún problema
 */
export async function updatePassword(formData) {
  const supabase = await createClient();

  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Validar que los campos no estén vacíos
  if (!password || !confirmPassword) {
    return { error: 'Contraseña y confirmación son requeridos' };
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' };
  }

  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  // Actualizar la contraseña
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirigir al login después de actualizar la contraseña
  redirect('/auth/login');
}

/**
 * Obtener el usuario actual autenticado
 * @returns {Promise<{user: any | null}>} Usuario actual o null si no está autenticado
 */
export async function getUser() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  return { user };
}

// ============================================================
// ✅ ACTIVO: Login con Google OAuth
// ============================================================
/**
 * Inicia el flujo de autenticación con Google usando OAuth.
 *
 * ¿Cómo funciona?
 *   1. Supabase genera una URL de autorización de Google.
 *   2. Redirigimos al usuario a esa URL (pantalla de Google).
 *   3. El usuario elige su cuenta de Google.
 *   4. Google redirige de vuelta a nuestra app en /auth/callback con un "code".
 *   5. El route handler /auth/callback intercambia el code por una sesión.
 *
 * ⚠️  Esta acción se llama desde GoogleLoginButton.jsx (client component).
 *     Usamos el cliente del NAVEGADOR ahí, no esta server action.
 *     Esta función se mantiene aquí como referencia y alternativa server-side.
 *
 * @returns {Promise<{error?: string}>} Objeto con error si hay algún problema
 */
export async function signInWithGoogle() {
  const supabase = await createClient();

  // "redirectTo" es la URL a la que Google enviará al usuario después del login.
  // DEBE estar registrada en:
  //   - Google Cloud Console → Authorized redirect URIs
  //   - Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Después de que Google confirme la identidad, redirige aquí
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error('[signInWithGoogle] Error al iniciar OAuth:', error.message);
    return { error: error.message };
  }

  // Si todo salió bien, "data.url" tiene la URL de Google a la que redirigir.
  // En un Server Action necesitamos redirigir manualmente.
  if (data?.url) {
    redirect(data.url);
  }

  return { error: 'No se pudo obtener la URL de autenticación de Google' };
}
