-- Migración: añadir columnas de perfil y empresa a users (para guardar datos desde "Mi cuenta")
-- Ejecutar solo si la tabla users ya existía sin estas columnas (ej. BD creada con script antiguo).
-- En desarrollo con TypeORM synchronize: true no suele hacer falta.

-- Añadir columnas si no existen (PostgreSQL)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS document VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ruc_company VARCHAR(100);
