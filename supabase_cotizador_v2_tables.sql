-- =====================================================
-- PASO 1: Borrar tablas del intento anterior (nombres incorrectos)
-- =====================================================
DROP TABLE IF EXISTS cotizador_user_roles CASCADE;
DROP TABLE IF EXISTS cotizador_freight_rates CASCADE;
DROP TABLE IF EXISTS cotizador_categories CASCADE;

-- =====================================================
-- PASO 2: Crear tablas que espera demo-cliente
-- =====================================================

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  derechos_importacion NUMERIC(8,4) NOT NULL DEFAULT 0,
  tasa_estadistica NUMERIC(8,4) NOT NULL DEFAULT 0,
  iva NUMERIC(8,4) NOT NULL DEFAULT 0,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de tarifas internacionales (proveedor)
CREATE TABLE IF NOT EXISTS tarifas_internacionales (
  id SERIAL PRIMARY KEY,
  peso NUMERIC(8,2) NOT NULL UNIQUE,
  precio_total_usd NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de tarifas públicas (Shippar al cliente)
CREATE TABLE IF NOT EXISTS tarifas_publicas (
  id SERIAL PRIMARY KEY,
  peso NUMERIC(8,2) NOT NULL UNIQUE,
  precio_por_kg_usd NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de configuraciones globales
CREATE TABLE IF NOT EXISTS configuraciones (
  id SERIAL PRIMARY KEY,
  recargo_fuel NUMERIC(6,2) NOT NULL DEFAULT 0,
  peso_limite_tarifa_internacional NUMERIC(8,2) NOT NULL DEFAULT 70,
  precio_kg_extra_internacional NUMERIC(8,2) NOT NULL DEFAULT 17.75,
  recargo_express NUMERIC(6,2) NOT NULL DEFAULT 0,
  peso_limite_tarifa_publica NUMERIC(8,2) NOT NULL DEFAULT 70,
  precio_kg_extra_publico NUMERIC(8,2) NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de cupones de descuento
CREATE TABLE IF NOT EXISTS cupones (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  porcentaje_descuento NUMERIC(5,2) NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de perfiles de usuario (roles)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT,
  rol TEXT NOT NULL DEFAULT 'usuario',
  email TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- PASO 3: RLS Policies
-- =====================================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_public_read" ON categorias FOR SELECT USING (true);

ALTER TABLE tarifas_internacionales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tarifas_int_public_read" ON tarifas_internacionales FOR SELECT USING (true);

ALTER TABLE tarifas_publicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tarifas_pub_public_read" ON tarifas_publicas FOR SELECT USING (true);

ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_read" ON configuraciones FOR SELECT USING (true);

ALTER TABLE cupones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cupones_public_read" ON cupones FOR SELECT USING (true);

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfiles_self_read" ON perfiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "perfiles_self_update" ON perfiles FOR UPDATE USING (auth.uid() = id);

-- Admin policies (admin puede hacer todo)
CREATE POLICY "categorias_admin_all" ON categorias FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "tarifas_int_admin_all" ON tarifas_internacionales FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "tarifas_pub_admin_all" ON tarifas_publicas FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "config_admin_all" ON configuraciones FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "cupones_admin_all" ON cupones FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "perfiles_admin_all" ON perfiles FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- =====================================================
-- PASO 4: Seed data - Categorías (las mismas 72 de antes pero con columnas correctas)
-- =====================================================
INSERT INTO categorias (nombre, derechos_importacion, tasa_estadistica, iva) VALUES
  ('GENERICO (59%)', 35, 3, 21),
  ('BILLETERAS (59%)', 35, 3, 21),
  ('REPUESTOS - CABLES (34%)', 20, 3, 0),
  ('REPUESTOS (59%)', 35, 3, 21),
  ('REPUESTOS (40%)', 16, 3, 21),
  ('HERRAMIENTAS (40%)', 16, 3, 21),
  ('REPUESTO FILTRO (46%)', 25, 0, 21),
  ('REPUESTOS/ACCESORIOS (42%)', 18, 3, 21),
  ('REPUESTOS P/AUTOS (42%)', 18, 3, 21),
  ('MAQUINAS ELECTRICAS (23%)', 2, 0, 21),
  ('FUENTE DE ALIMENTACION (59%)', 35, 3, 21),
  ('LAMINAS DE ALUMINIO (44%)', 20, 3, 21),
  ('APARATOS MECANICOS PULVERIZAR (27%)', 13, 3, 0),
  ('INTERRUPTORES (11%)', 0, 0, 0),
  ('ACCESORIOS PERSONALES (59%)', 35, 3, 21),
  ('IMPRESORA 3D (23%)', 12.6, 0, 0),
  ('NOTEBOOK (59%)', 45.5, 3, 0),
  ('INSUMOS INFORMATICA (30%)', 6, 3, 21),
  ('ARTICULOS INFORMATICA (35%)', 14, 0, 21),
  ('GENERICO INFORMATICA (21%)', 0, 0, 21),
  ('MOUSE (21%)', 0, 0, 21),
  ('CABLE USB (30%)', 6, 3, 21),
  ('MOUSE PAD (40%)', 16, 3, 21),
  ('TECLADOS (11%)', 0, 0, 0),
  ('SOPORTE PARA CELULAR (59%)', 35, 3, 21),
  ('CELULARES (0%)', 0, 0, 0),
  ('FUNDAS (59%)', 35, 3, 21),
  ('VIDRIO T. CELULAR (50%)', 26, 3, 21),
  ('MODULOS/REPUESTOS CELULAR (32%)', 10.8, 0, 21),
  ('AURICULARES (59%)', 35, 3, 21),
  ('SMARTWATCH (11%)', 0, 0, 0),
  ('AURICULARES BLUETOOTH (59%)', 35, 3, 21),
  ('RELOJ ANALOGICO (59%)', 35, 3, 21),
  ('MALLAS SMARTWATCH (59%)', 35, 3, 21),
  ('TRACKERS (42%)', 18, 3, 21),
  ('COMBO SW (11%)', 0, 0, 0),
  ('TV BOX 1 (56%)', 32, 3, 21),
  ('TV BOX (14%)', 0, 3, 0),
  ('LAMPARA/LUCES LED (56%)', 32, 3, 21),
  ('CONSOLA DE JUEGOS (59%)', 35, 3, 21),
  ('ILUMINACION BICICLETAS (42%)', 18, 3, 21),
  ('PROYECTORES (40%)', 26.5, 3, 0),
  ('GENERICO PESCA (40%)', 16, 3, 21),
  ('ANZUELOS (44%)', 20, 3, 21),
  ('RULEMANES (40%)', 16, 3, 21),
  ('OVER GRIPS (59%)', 35, 3, 21),
  ('ARTICULOS DE COTILLON (59%)', 35, 3, 21),
  ('PORTA VELAS (18%)', 18, 0, 0),
  ('ARTICULOS PARA MASCOTAS (59%)', 35, 3, 21),
  ('CEPILLOS PARA MASCOTAS (56%)', 32, 3, 21),
  ('BIJOUTERIE/JOYERIA (59%)', 35, 3, 21),
  ('LLAVEROS (59%)', 35, 3, 21),
  ('MOCHILAS/BOLSOS/CARTERAS (44%)', 20, 3, 21),
  ('MARROQUINERIA (59%)', 35, 3, 21),
  ('FUNDAS PARA CARTAS (42%)', 18, 3, 21),
  ('JUGUETES (59%)', 35, 3, 21),
  ('PERFUMEROS (59%)', 35, 3, 21),
  ('BOLSAS/CAJAS/PACKAGING (59%)', 35, 3, 21),
  ('INDUMENTARIA (44%)', 20, 3, 21),
  ('CALZADO (59%)', 35, 3, 21),
  ('TEXTILES (44%)', 20, 3, 21),
  ('VINCHAS (44%)', 20, 3, 21),
  ('PEINE CON ESPEJO (42%)', 18, 3, 21),
  ('COLITAS PARA PELO (44%)', 20, 3, 21),
  ('CLIPS PARA PELO (44%)', 20, 3, 21),
  ('FUNDAS IMPERMEABLES PVC (42%)', 18, 3, 21),
  ('STICKERS UNAS (59%)', 35, 2.5, 21),
  ('TIRAS NASALES (59%)', 35, 3, 21),
  ('INSTRUMENTOS ANALISIS (23%)', 12.6, 0, 0),
  ('GENERICO (56%)', 32.5, 3, 21),
  ('COMISION PAGO A PROVEE (4%)', 3.5, 0, 0),
  ('ENVIOS PERSONALES -400 USD (21%)', 0, 0, 21)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- PASO 5: Seed data - Configuración inicial
-- =====================================================
INSERT INTO configuraciones (id, recargo_fuel, peso_limite_tarifa_internacional, precio_kg_extra_internacional, recargo_express, peso_limite_tarifa_publica, precio_kg_extra_publico)
VALUES (1, 0, 70, 17.75, 0, 70, 20)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PASO 6: Seed data - Tarifas internacionales (por peso)
-- =====================================================
INSERT INTO tarifas_internacionales (peso, precio_total_usd) VALUES
  (1, 28.25),
  (2, 56.50),
  (3, 84.75),
  (4, 113.00),
  (5, 141.25),
  (6, 169.50),
  (7, 183.05),
  (8, 209.20),
  (9, 235.35),
  (10, 261.50),
  (15, 345.00),
  (20, 439.00),
  (25, 548.75),
  (30, 658.50),
  (35, 665.00),
  (40, 760.00),
  (45, 855.00),
  (50, 950.00),
  (55, 1045.00),
  (60, 1140.00),
  (65, 1235.00),
  (70, 1330.00)
ON CONFLICT (peso) DO NOTHING;

-- Tarifas públicas (Shippar al cliente, por kg)
INSERT INTO tarifas_publicas (peso, precio_por_kg_usd) VALUES
  (1, 28.25),
  (2, 28.25),
  (3, 28.25),
  (4, 28.25),
  (5, 28.25),
  (6, 28.25),
  (7, 26.15),
  (8, 26.15),
  (9, 26.15),
  (10, 26.15),
  (15, 23.00),
  (20, 21.95),
  (25, 21.95),
  (30, 21.95),
  (35, 19.00),
  (40, 19.00),
  (45, 19.00),
  (50, 19.00),
  (55, 19.00),
  (60, 19.00),
  (65, 19.00),
  (70, 19.00)
ON CONFLICT (peso) DO NOTHING;
