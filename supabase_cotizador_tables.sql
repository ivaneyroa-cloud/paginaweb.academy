-- ============================================================
-- PASO 1: LIMPIEZA — Borrar tablas que no se usan
-- Estas tablas con PascalCase fueron creadas por un ORM
-- (Prisma/NextAuth) y el código NO las referencia.
-- ============================================================

DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "Lesson" CASCADE;
DROP TABLE IF EXISTS "Module" CASCADE;
DROP TABLE IF EXISTS "Quiz" CASCADE;
DROP TABLE IF EXISTS "Resource" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "UserProgress" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;

-- ============================================================
-- PASO 2: TABLAS DEL COTIZADOR
-- ============================================================

-- 1. Categorías de productos (impuestos por categoría)
CREATE TABLE IF NOT EXISTS cotizador_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  import_duty NUMERIC(6,4) NOT NULL DEFAULT 0,
  statistical_fee NUMERIC(6,4) NOT NULL DEFAULT 0,
  iva NUMERIC(6,4) NOT NULL DEFAULT 0,
  iva_10_5 NUMERIC(6,4) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tarifas de flete internacional por rango de peso
CREATE TABLE IF NOT EXISTS cotizador_freight_rates (
  id SERIAL PRIMARY KEY,
  min_weight NUMERIC(8,2) NOT NULL,
  max_weight NUMERIC(8,2) NOT NULL,
  rate NUMERIC(8,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_weight_range CHECK (min_weight <= max_weight),
  CONSTRAINT positive_rate CHECK (rate >= 0)
);

-- 3. Roles de usuarios del cotizador
CREATE TABLE IF NOT EXISTS cotizador_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cotizador_categories_active ON cotizador_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_cotizador_categories_sort ON cotizador_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_cotizador_freight_active ON cotizador_freight_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_cotizador_user_roles_email ON cotizador_user_roles(email);
CREATE INDEX IF NOT EXISTS idx_cotizador_user_roles_user_id ON cotizador_user_roles(user_id);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- Categories: lectura pública, escritura solo admin
ALTER TABLE cotizador_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cotizador_categories_select"
  ON cotizador_categories FOR SELECT
  USING (true);

CREATE POLICY "cotizador_categories_admin"
  ON cotizador_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cotizador_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- Freight rates: lectura pública, escritura solo admin
ALTER TABLE cotizador_freight_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cotizador_freight_rates_select"
  ON cotizador_freight_rates FOR SELECT
  USING (true);

CREATE POLICY "cotizador_freight_rates_admin"
  ON cotizador_freight_rates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cotizador_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- User roles: usuarios ven su propio rol, admins ven todo
ALTER TABLE cotizador_user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cotizador_user_roles_self_select"
  ON cotizador_user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cotizador_user_roles_admin_select"
  ON cotizador_user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cotizador_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "cotizador_user_roles_admin_all"
  ON cotizador_user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cotizador_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- ============================================================
-- SEED DATA: Categorías de productos
-- ============================================================
INSERT INTO cotizador_categories (name, import_duty, statistical_fee, iva, iva_10_5, sort_order) VALUES
  ('GENERICO (59%)', 0.35, 0.03, 0.21, 0, 1),
  ('BILLETERAS (59%)', 0.35, 0.03, 0.21, 0, 2),
  ('REPUESTOS - CABLES (34%)', 0.20, 0.03, 0, 0.105, 3),
  ('REPUESTOS (59%)', 0.35, 0.03, 0.21, 0, 4),
  ('REPUESTOS (40%)', 0.16, 0.03, 0.21, 0, 5),
  ('HERRAMIENTAS (40%)', 0.16, 0.03, 0.21, 0, 6),
  ('REPUESTO FILTRO (46%)', 0.25, 0, 0.21, 0, 7),
  ('REPUESTOS/ACCESORIOS (42%)', 0.18, 0.03, 0.21, 0, 8),
  ('REPUESTOS P/AUTOS (42%)', 0.18, 0.03, 0.21, 0, 9),
  ('MAQUINAS ELÉCTRICAS (23%)', 0.02, 0, 0.21, 0, 10),
  ('FUENTE DE ALIMENTACIÓN (59%)', 0.35, 0.03, 0.21, 0, 11),
  ('LAMINAS DE ALUMINIO (44%)', 0.20, 0.03, 0.21, 0, 12),
  ('APARATOS MECÁNICOS PARA PULVERIZAR/DISPERSAR (27%)', 0.13, 0.03, 0, 0.105, 13),
  ('INTERRUPTORES (11%)', 0, 0, 0, 0.105, 14),
  ('ACCESORIOS PERSONALES (59%)', 0.35, 0.03, 0.21, 0, 15),
  ('IMPRESORA 3D (23%)', 0.126, 0, 0, 0.105, 16),
  ('NOTEBOOK (59%)', 0.455, 0.03, 0, 0.105, 17),
  ('INSUMOS INFORMATICA (30%)', 0.06, 0.03, 0.21, 0, 18),
  ('ARTICULOS INFORMATICA (35%)', 0.14, 0, 0.21, 0, 19),
  ('GENERICO INFORMATICA (21%)', 0, 0, 0.21, 0, 20),
  ('MOUSE (21%)', 0, 0, 0.21, 0, 21),
  ('CABLE USB (30%)', 0.06, 0.03, 0.21, 0, 22),
  ('MOUSE PAD (40%)', 0.16, 0.03, 0.21, 0, 23),
  ('TECLADOS (11%)', 0, 0, 0, 0.105, 24),
  ('SOPORTE PARA CELULAR (59%)', 0.35, 0.03, 0.21, 0, 25),
  ('CELULARES (0%)', 0, 0, 0, 0, 26),
  ('FUNDAS (59%)', 0.35, 0.03, 0.21, 0, 27),
  ('VIDRIO T. CELULAR (50%)', 0.26, 0.03, 0.21, 0, 28),
  ('MODULOS/REPUESTOS CELULAR (32%)', 0.108, 0, 0.21, 0, 29),
  ('AURICULARES (59%)', 0.35, 0.03, 0.21, 0, 30),
  ('SMARTWATCH (11%)', 0, 0, 0, 0.105, 31),
  ('AURICULARES BLUETOOTH (59%)', 0.35, 0.03, 0.21, 0, 32),
  ('RELOJ ANALÓGICO (59%)', 0.35, 0.03, 0.21, 0, 33),
  ('MALLAS SMARTWATCH (59%)', 0.35, 0.03, 0.21, 0, 34),
  ('TRACKERS (42%)', 0.18, 0.03, 0.21, 0, 35),
  ('COMBO SW (11%)', 0, 0, 0, 0.105, 36),
  ('TV BOX 1 (56%)', 0.32, 0.03, 0.21, 0, 37),
  ('TV BOX (14%)', 0, 0.03, 0, 0.105, 38),
  ('LÁMPARA/LUCES LED (56%)', 0.32, 0.03, 0.21, 0, 39),
  ('CONSOLA DE JUEGOS (59%)', 0.35, 0.03, 0.21, 0, 40),
  ('ILUMINACIÓN/SEÑALIZACIÓN PARA BICICLETAS (42%)', 0.18, 0.03, 0.21, 0, 41),
  ('PROYECTORES (40%)', 0.265, 0.03, 0, 0.105, 42),
  ('GENERICO PESCA (40%)', 0.16, 0.03, 0.21, 0, 43),
  ('ANZUELOS (44%)', 0.20, 0.03, 0.21, 0, 44),
  ('RULEMANES (40%)', 0.16, 0.03, 0.21, 0, 45),
  ('OVER GRIPS (59%)', 0.35, 0.03, 0.21, 0, 46),
  ('ARTICULOS DE COTILLON (59%)', 0.35, 0.03, 0.21, 0, 47),
  ('PORTA VELAS (18%)', 0.18, 0, 0, 0, 48),
  ('ARTICULOS PARA MASCOTAS (59%)', 0.35, 0.03, 0.21, 0, 49),
  ('CEPILLOS PARA MASCOTAS (56%)', 0.32, 0.03, 0.21, 0, 50),
  ('BIJOUTERIE/JOYERÍA (59%)', 0.35, 0.03, 0.21, 0, 51),
  ('LLAVEROS (59%)', 0.35, 0.03, 0.21, 0, 52),
  ('MOCHILAS/BOLSOS/CARTERAS/ESTUCHES (44%)', 0.20, 0.03, 0.21, 0, 53),
  ('MARROQUINERÍA (59%)', 0.35, 0.03, 0.21, 0, 54),
  ('FUNDAS PARA CARTAS (42%)', 0.18, 0.03, 0.21, 0, 55),
  ('JUGUETES (59%)', 0.35, 0.03, 0.21, 0, 56),
  ('PERFUMEROS (59%)', 0.35, 0.03, 0.21, 0, 57),
  ('BOLSAS/CAJAS/PACKAGING (59%)', 0.35, 0.03, 0.21, 0, 58),
  ('INDUMENTARIA (44%)', 0.20, 0.03, 0.21, 0, 59),
  ('CALZADO (59%)', 0.35, 0.03, 0.21, 0, 60),
  ('TEXTILES (44%)', 0.20, 0.03, 0.21, 0, 61),
  ('VINCHAS (44%)', 0.20, 0.03, 0.21, 0, 62),
  ('PEINE CON ESPEJO (42%)', 0.18, 0.03, 0.21, 0, 63),
  ('COLITAS PARA PELO (44%)', 0.20, 0.03, 0.21, 0, 64),
  ('CLIPS PARA PELO (44%)', 0.20, 0.03, 0.21, 0, 65),
  ('FUNDAS IMPERMEABLES PVC (42%)', 0.18, 0.03, 0.21, 0, 66),
  ('STICKERS UÑAS (59%)', 0.35, 0.025, 0.21, 0, 67),
  ('TIRAS NASALES / DILATADOR NASAL (59%)', 0.35, 0.03, 0.21, 0, 68),
  ('INSTRUMENTOS/APARATOS PARA ANÁLISIS (23%)', 0.126, 0, 0, 0.105, 69),
  ('GENERICO (56%)', 0.325, 0.03, 0.21, 0, 70),
  ('COMISION PAGO A PROVEE (4%)', 0.035, 0, 0, 0, 71),
  ('ENVIOS PERSONALES (-400 USD) (21%)', 0, 0, 0.21, 0, 72)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- SEED DATA: Tarifas de flete
-- ============================================================
INSERT INTO cotizador_freight_rates (min_weight, max_weight, rate) VALUES
  (0, 4.99, 28.25),
  (5, 6, 28.25),
  (7, 10, 26.15),
  (11, 15, 23.00),
  (16, 30, 21.95),
  (31, 70, 19.00),
  (70.01, 99999, 17.75)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Triggers para auto-update de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cotizador_categories_updated_at ON cotizador_categories;
CREATE TRIGGER update_cotizador_categories_updated_at
  BEFORE UPDATE ON cotizador_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cotizador_freight_rates_updated_at ON cotizador_freight_rates;
CREATE TRIGGER update_cotizador_freight_rates_updated_at
  BEFORE UPDATE ON cotizador_freight_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cotizador_user_roles_updated_at ON cotizador_user_roles;
CREATE TRIGGER update_cotizador_user_roles_updated_at
  BEFORE UPDATE ON cotizador_user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
