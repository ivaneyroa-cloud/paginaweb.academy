-- =====================================================
-- MIGRACIÓN COMPLETA - Copiar y pegar TODO en SQL Editor
-- =====================================================

DELETE FROM tarifas_internacionales;
DELETE FROM tarifas_publicas;
DELETE FROM configuraciones;
DELETE FROM categorias;

INSERT INTO configuraciones (id, recargo_fuel, recargo_express, peso_limite_tarifa_internacional, peso_limite_tarifa_publica, precio_kg_extra_internacional, precio_kg_extra_publico)
VALUES (1, 28, 10.00, 32, 32, 81.80, 17.75)
ON CONFLICT (id) DO UPDATE SET
  recargo_fuel = 28, recargo_express = 10.00,
  peso_limite_tarifa_internacional = 32, peso_limite_tarifa_publica = 32,
  precio_kg_extra_internacional = 81.80, precio_kg_extra_publico = 17.75;

INSERT INTO tarifas_internacionales (peso, precio_total_usd) VALUES
  (0.5,229.60),(1.0,279.00),(1.5,339.80),(2.0,393.30),(2.5,447.60),
  (3.0,501.50),(3.5,555.90),(4.0,605.20),(4.5,654.80),(5.0,720.80),
  (5.5,792.30),(6.0,838.30),(6.5,882.10),(7.0,924.70),(7.5,968.50),
  (8.0,1007.60),(8.5,1044.90),(9.0,1081.60),(9.5,1118.40),(10.0,1153.90),
  (10.5,1199.70),(11.0,1245.20),(11.5,1276.50),(12.0,1305.10),(12.5,1342.40),
  (13.0,1371.40),(13.5,1404.90),(14.0,1430.40),(14.5,1465.20),(15.0,1489.80),
  (15.5,1537.10),(16.0,1573.60),(16.5,1607.00),(17.0,1632.00),(17.5,1664.20),
  (18.0,1688.70),(18.5,1721.40),(19.0,1746.50),(19.5,1780.40),(20.0,1811.10),
  (20.5,1851.80),(21.0,1895.50),(21.5,1920.50),(22.0,1944.80),(22.5,1985.10),
  (23.0,2019.00),(23.5,2062.60),(24.0,2097.50),(24.5,2132.10),(25.0,2167.00),
  (25.5,2203.10),(26.0,2236.50),(26.5,2271.80),(27.0,2306.90),(27.5,2341.70),
  (28.0,2376.60),(28.5,2411.00),(29.0,2445.70),(29.5,2480.80),(30.0,2515.50),
  (30.5,2551.20),(31.0,2568.80),(31.5,2574.90);

INSERT INTO tarifas_publicas (peso, precio_por_kg_usd) VALUES
  (0.5,90.00),(1.0,50.00),(1.5,36.66),(2.0,30.00),(2.5,26.00),
  (3.0,23.33),(3.5,21.42),(4.0,20.00),(4.5,18.89),(5.0,28.50),
  (5.5,28.50),(6.0,28.50),(6.5,28.50),(7.0,26.15),(7.5,26.15),
  (8.0,26.15),(8.5,26.15),(9.0,26.15),(9.5,26.15),(10.0,26.15),
  (10.5,26.15),(11.0,23.00),(11.5,23.00),(12.0,23.00),(12.5,23.00),
  (13.0,23.00),(13.5,23.00),(14.0,23.00),(14.5,23.00),(15.0,23.00),
  (15.5,23.00),(16.0,21.95),(16.5,21.95),(17.0,21.95),(17.5,21.95),
  (18.0,21.95),(18.5,21.95),(19.0,21.95),(19.5,21.95),(20.0,21.95),
  (20.5,21.95),(21.0,21.95),(21.5,21.95),(22.0,21.95),(22.5,21.95),
  (23.0,21.95),(23.5,21.95),(24.0,21.95),(24.5,21.95),(25.0,21.95),
  (25.5,21.95),(26.0,21.95),(26.5,21.95),(27.0,21.95),(27.5,21.95),
  (28.0,21.95),(28.5,21.95),(29.0,21.95),(29.5,21.95),(30.0,21.95),
  (30.5,21.95),(31.0,19.00),(31.5,19.00);

INSERT INTO categorias (nombre, derechos_importacion, tasa_estadistica, iva, activa) VALUES
  ('Generico 56%', 32.00, 3.00, 21.00, true),
  ('Fundas de celular', 35.00, 3.00, 21.00, true),
  ('PINS Crocs', 35.00, 3.00, 21.00, true),
  ('Soportes', 35.00, 3.00, 21.00, true),
  ('Bijouterie', 35.00, 3.00, 21.00, true),
  ('Plantillas', 0.00, 3.00, 21.00, true),
  ('Tarjeta grafica', 16.00, 0.00, 10.50, true),
  ('Bolsas plasticas', 18.00, 3.00, 21.00, true),
  ('Smart watch', 0.00, 0.00, 10.50, true),
  ('Maquina/Comercial', 12.60, 3.00, 10.50, true),
  ('vidrio', 18.00, 3.00, 21.00, true),
  ('Malla de reloj', 18.00, 3.00, 21.00, true),
  ('Laminas plasticas', 16.00, 3.00, 21.00, true),
  ('Cargadores', 35.00, 3.00, 21.00, true),
  ('Cintos', 20.00, 3.00, 21.00, true),
  ('Generico 59% (Alta)', 35.00, 3.00, 21.00, true),
  ('Teclados', 0.00, 0.00, 10.50, true),
  ('Parlantes', 35.00, 3.00, 21.00, true),
  ('Ropa/textiles', 20.00, 3.00, 21.00, true),
  ('Repuesto de maquina', 16.00, 3.00, 12.00, true),
  ('Art de aluminio', 12.60, 3.00, 21.00, true),
  ('Generico 52%', 28.00, 3.00, 21.00, true),
  ('Microfonos', 20.00, 3.00, 21.00, true),
  ('Valvula', 12.60, 0.00, 21.00, true),
  ('Modulo de celular (LCD)', 0.00, 0.00, 21.00, true);

SELECT 'tarifas_int' as tabla, COUNT(*) as filas FROM tarifas_internacionales
UNION ALL SELECT 'tarifas_pub', COUNT(*) FROM tarifas_publicas
UNION ALL SELECT 'config', COUNT(*) FROM configuraciones
UNION ALL SELECT 'categorias', COUNT(*) FROM categorias;
