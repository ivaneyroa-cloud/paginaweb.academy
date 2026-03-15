-- Agregar columna bloqueado a perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS bloqueado BOOLEAN DEFAULT false;
