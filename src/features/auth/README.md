# Sistema de Autenticación con Supabase

Este directorio contiene todos los componentes y lógica para el sistema de autenticación de la aplicación usando Supabase.

## 📁 Estructura

```
src/features/auth/
├── components/
│   ├── LoginForm.jsx           # Formulario de inicio de sesión
│   ├── SignUpForm.jsx          # Formulario de registro
│   ├── ForgotPasswordForm.jsx  # Formulario de recuperación de contraseña
│   ├── UpdatePasswordForm.jsx  # Formulario para actualizar contraseña
│   └── UserMenu.jsx            # Menú de usuario en el navbar
└── index.js                     # Exportaciones centralizadas
```

## 🔐 Funcionalidades

### 1. Inicio de Sesión
- Ruta: `/auth/login`
- Permite a usuarios existentes autenticarse con email y contraseña
- Redirige a la página principal tras login exitoso

### 2. Registro de Usuario
- Ruta: `/auth/sign-up`
- Permite crear nuevas cuentas con email y contraseña
- Envía email de confirmación automáticamente
- Requiere confirmación de contraseña

### 3. Recuperación de Contraseña
- Ruta: `/auth/forgot-password`
- Envía enlace de recuperación al email del usuario
- El enlace redirige a `/auth/update-password`

### 4. Actualizar Contraseña
- Ruta: `/auth/update-password`
- Permite establecer nueva contraseña después de recuperación
- Requiere confirmación de la nueva contraseña

### 5. Confirmación de Email
- Ruta: `/auth/confirm`
- Maneja la verificación del email cuando el usuario hace clic en el enlace
- Activa automáticamente la cuenta del usuario

### 6. Manejo de Errores
- Ruta: `/auth/error`
- Muestra errores de autenticación de forma amigable

### 7. Menú de Usuario
- Componente: `UserMenu`
- Muestra información del usuario autenticado
- Opción de cerrar sesión
- Botones de login/registro para usuarios no autenticados
- Integrado en el Navbar

## 🛠️ Acciones del Servidor

Las acciones de autenticación están en `/src/lib/supabase/actions.js`:

- `login(formData)` - Iniciar sesión con email y contraseña
- `signUp(formData)` - Registrar nuevo usuario
- `logout()` - Cerrar sesión
- `forgotPassword(formData)` - Solicitar recuperación de contraseña
- `updatePassword(formData)` - Actualizar contraseña
- `getUser()` - Obtener usuario actual autenticado

## 🔧 Clientes de Supabase

### Cliente del Navegador (`/src/lib/supabase/client.js`)
- Usado en componentes del cliente (Client Components)
- Útil para operaciones en tiempo real y en el navegador

### Cliente del Servidor (`/src/lib/supabase/server.js`)
- Usado en Server Components, Server Actions y Route Handlers
- Maneja cookies automáticamente para mantener la sesión

## 🚀 Middleware

El archivo `/src/middleware.js` se ejecuta en cada solicitud para:
- Actualizar automáticamente la sesión del usuario
- Mantener las cookies de autenticación actualizadas
- Verificar el estado de autenticación

## 📝 Variables de Entorno Necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_supabase_publishable_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 💡 Uso en Componentes

### Obtener usuario autenticado (Cliente)
```javascript
'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Obtener usuario autenticado (Servidor)
```javascript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Usar acciones de autenticación
```javascript
import { logout } from '@/lib/supabase/actions';

// En un componente del cliente
const handleLogout = async () => {
  await logout();
};
```

## 🎨 Estilos

Todos los componentes usan Tailwind CSS y siguen el esquema de colores de la aplicación:
- Color principal: Sky (sky-500, sky-600, sky-700)
- Errores: Red (red-50, red-200, red-700)
- Éxito: Green (green-50, green-200, green-700)

## 🔒 Seguridad

- Las contraseñas deben tener mínimo 6 caracteres
- Todas las acciones se ejecutan en el servidor (Server Actions)
- Las sesiones se manejan mediante cookies HTTP-only
- El middleware actualiza automáticamente las sesiones
