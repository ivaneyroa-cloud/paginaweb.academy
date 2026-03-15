-- ═══════════════════════════════════════════════
-- ONE-TIME SETUP: Set the main owner as superadmin
-- Run this ONCE in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Set ivaneyroa@shippar.net as superadmin
UPDATE perfiles
SET rol = 'superadmin', updated_at = now()
WHERE email = 'ivaneyroa@shippar.net';

-- If email column doesn't exist in perfiles, use auth.users to find the ID:
-- SELECT p.id, u.email, p.rol 
-- FROM perfiles p 
-- JOIN auth.users u ON p.id = u.id 
-- WHERE u.email = 'ivaneyroa@shippar.net';
--
-- Then run:
-- UPDATE perfiles SET rol = 'superadmin', updated_at = now() WHERE id = '<THE_ID>';

-- Verify the update:
SELECT p.id, p.nombre_completo, p.email, p.rol, u.email as auth_email
FROM perfiles p
JOIN auth.users u ON p.id = u.id
WHERE p.rol = 'superadmin' OR u.email = 'ivaneyroa@shippar.net';
