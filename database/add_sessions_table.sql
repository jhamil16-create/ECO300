-- =================================================================
-- AGREGAR TABLAS DE LARAVEL (Sesiones y Caché)
-- =================================================================
-- Ejecuta este script si ya tienes la base de datos creada
-- y solo necesitas agregar las tablas de Laravel

-- Crear tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_last_activity (last_activity)
) ENGINE=InnoDB;

-- Crear tabla de caché
CREATE TABLE IF NOT EXISTS cache (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    value MEDIUMTEXT NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_cache_expiration (expiration)
) ENGINE=InnoDB;

-- Crear tabla de bloqueos de caché
CREATE TABLE IF NOT EXISTS cache_locks (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_cache_locks_expiration (expiration)
) ENGINE=InnoDB;

