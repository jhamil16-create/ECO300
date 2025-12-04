-- =================================================================
-- SCRIPT DDL PARA MARIADB / MYSQL - ECO300
-- =================================================================
-- Desactivar temporalmente la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- =================================================================
-- 1. TABLAS DE GESTIÓN (USUARIOS Y EMPRESAS)
-- =================================================================

-- 1.1. Empresas (Microempresas registradas)
DROP TABLE IF EXISTS Empresas;
CREATE TABLE Empresas (
    ID_Empresa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    RUC_o_NIT VARCHAR(20) UNIQUE NOT NULL,
    Ciudad VARCHAR(50),
    Fecha_Registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1.2. Usuarios (Acceso al sistema)
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
    ID_Usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Hash_Password VARCHAR(255) NOT NULL, 
    Rol VARCHAR(20) DEFAULT 'Empleado',
    remember_token VARCHAR(100) NULL,
    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================
-- 2. TABLAS DE CATÁLOGO Y MAESTROS (DATOS BASE)
-- =================================================================

-- 2.1. Productos (Lo que la empresa produce o vende)
DROP TABLE IF EXISTS Productos;
CREATE TABLE Productos (
    ID_Producto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Unidad_Medida VARCHAR(10),
    CONSTRAINT fk_producto_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 2.2. Proveedores
DROP TABLE IF EXISTS Proveedores;
CREATE TABLE Proveedores (
    ID_Proveedor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Categoria_Principal VARCHAR(50),
    CONSTRAINT fk_proveedor_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================
-- 3. TABLAS DE INVENTARIO Y CONTROL
-- =================================================================

-- 3.1. Inventario (Estado actual y parámetros clave)
DROP TABLE IF EXISTS Inventario;
CREATE TABLE Inventario (
    ID_Inventario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Producto INTEGER UNIQUE NOT NULL,
    Stock_Actual INTEGER NOT NULL,
    Nivel_Optimo INTEGER,
    Punto_Reorden INTEGER,
    Fecha_Ultima_Act DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventario_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3.2. Historico_Stock (Para la gráfica de Rotación)
DROP TABLE IF EXISTS Historico_Stock;
CREATE TABLE Historico_Stock (
    ID_Historico BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Producto INTEGER NOT NULL,
    Fecha DATETIME NOT NULL,
    Tipo_Movimiento VARCHAR(20) NOT NULL,
    Cantidad_Cambio INTEGER NOT NULL,
    CONSTRAINT fk_historico_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =================================================================
-- 4. TABLAS DE TRANSACCIONES (VENTAS Y PRODUCCIÓN)
-- =================================================================

-- 4.1. Ventas_Cabecera (Registro general de la transacción)
DROP TABLE IF EXISTS Ventas_Cabecera;
CREATE TABLE Ventas_Cabecera (
    ID_Venta BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Fecha_Venta DATETIME NOT NULL,
    Total_Venta NUMERIC(12, 2) NOT NULL,
    Ticket_Promedio NUMERIC(10, 2),
    CONSTRAINT fk_venta_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4.2. Ventas_Detalle (Los productos incluidos en cada venta)
DROP TABLE IF EXISTS Ventas_Detalle;
CREATE TABLE Ventas_Detalle (
    ID_Detalle BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Venta BIGINT NOT NULL,
    ID_Producto INTEGER NOT NULL,
    Cantidad INTEGER NOT NULL,
    Precio_Unit NUMERIC(10, 2) NOT NULL,
    Total NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (ID_Venta) REFERENCES Ventas_Cabecera (ID_Venta) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4.3. Produccion_Registro (Ciclo o Lote de producción)
DROP TABLE IF EXISTS Produccion_Registro;
CREATE TABLE Produccion_Registro (
    ID_Produccion BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Fecha DATETIME NOT NULL,
    Costo_Total NUMERIC(12, 2),
    Eficiencia NUMERIC(5, 2),
    CONSTRAINT fk_produccion_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4.4. Produccion_Detalle (Productos producidos en el lote)
DROP TABLE IF EXISTS Produccion_Detalle;
CREATE TABLE Produccion_Detalle (
    ID_Detalle BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Produccion BIGINT NOT NULL,
    ID_Producto INTEGER NOT NULL,
    Cantidad INTEGER NOT NULL,
    Costo_Unit NUMERIC(10, 2),
    CONSTRAINT fk_prod_detalle_registro
        FOREIGN KEY (ID_Produccion) REFERENCES Produccion_Registro (ID_Produccion) ON DELETE CASCADE,
    CONSTRAINT fk_prod_detalle_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4.5. Produccion_Planificada (Para comparación Planificado vs Real)
DROP TABLE IF EXISTS Produccion_Planificada;
CREATE TABLE Produccion_Planificada (
    ID_Plan INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    ID_Producto INTEGER NOT NULL,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE NOT NULL,
    Cantidad_Planificada INTEGER NOT NULL,
    CONSTRAINT fk_plan_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE,
    CONSTRAINT fk_plan_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =================================================================
-- 5. TABLAS DE COSTOS Y PROVEEDORES
-- =================================================================

-- 5.1. Costos_Categoria (Materias primas, Mano de obra, Marketing, etc.)
DROP TABLE IF EXISTS Costos_Categoria;
CREATE TABLE Costos_Categoria (
    ID_Categoria INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Nombre_Categoria VARCHAR(50) NOT NULL,
    CONSTRAINT fk_categoria_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5.2. Registro_Costos (Cada transacción de gasto)
DROP TABLE IF EXISTS Registro_Costos;
CREATE TABLE Registro_Costos (
    ID_Costo BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    ID_Categoria INTEGER NOT NULL,
    ID_Proveedor INTEGER,
    Monto NUMERIC(12, 2) NOT NULL,
    Fecha DATE NOT NULL,
    CONSTRAINT fk_costo_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE,
    CONSTRAINT fk_costo_categoria
        FOREIGN KEY (ID_Categoria) REFERENCES Costos_Categoria (ID_Categoria) ON DELETE RESTRICT,
    CONSTRAINT fk_costo_proveedor
        FOREIGN KEY (ID_Proveedor) REFERENCES Proveedores (ID_Proveedor) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5.3. Proveedor_Detalle (Datos variables del proveedor para reportes)
DROP TABLE IF EXISTS Proveedor_Detalle;
CREATE TABLE Proveedor_Detalle (
    ID_Detalle INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Proveedor INTEGER UNIQUE NOT NULL,
    Costo_Mensual NUMERIC(12, 2),
    Confiabilidad NUMERIC(5, 2),
    Ultimo_Pedido DATE,
    CONSTRAINT fk_detalle_proveedor
        FOREIGN KEY (ID_Proveedor) REFERENCES Proveedores (ID_Proveedor) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================
-- 6. TABLAS DE PREDICCIONES Y ANÁLISIS
-- =================================================================

-- 6.1. Factores_Prediccion (Factores de Demanda Analizados)
DROP TABLE IF EXISTS Factores_Prediccion;
CREATE TABLE Factores_Prediccion (
    ID_Factor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Nombre_Factor VARCHAR(50) NOT NULL,
    Porcentaje_Impacto NUMERIC(5, 2),
    Descripcion TEXT,
    CONSTRAINT fk_factor_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.2. Prediccion_Ventas_Total (Predicción Total y Gráfica 6 Meses)
DROP TABLE IF EXISTS Prediccion_Ventas_Total;
CREATE TABLE Prediccion_Ventas_Total (
    ID_Prediccion BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Fecha_Ejecucion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Fecha_Inicio_Periodo DATE NOT NULL,
    Monto_Predicho NUMERIC(12, 2) NOT NULL,
    Confianza_Modelo NUMERIC(5, 2),
    Analisis_General TEXT,
    CONSTRAINT fk_prediccion_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6.3. Prediccion_Ventas_Producto (Detalle de predicciones por producto)
DROP TABLE IF EXISTS Prediccion_Ventas_Producto;
CREATE TABLE Prediccion_Ventas_Producto (
    ID_Registro BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Prediccion BIGINT NOT NULL,
    ID_Producto INTEGER NOT NULL,
    Ventas_Actuales NUMERIC(12, 2),
    Monto_Predicho NUMERIC(12, 2) NOT NULL,
    Confianza NUMERIC(5, 2),
    Recomendacion TEXT,
    CONSTRAINT fk_registro_prediccion
        FOREIGN KEY (ID_Prediccion) REFERENCES Prediccion_Ventas_Total (ID_Prediccion) ON DELETE CASCADE,
    CONSTRAINT fk_registro_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6.4. Analisis_Inteligente (Insights generados por ML)
DROP TABLE IF EXISTS Analisis_Inteligente;
CREATE TABLE Analisis_Inteligente (
    ID_Analisis INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Fecha_Generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Titulo VARCHAR(100) NOT NULL,
    Insight TEXT NOT NULL,
    Prioridad INTEGER DEFAULT 3,
    CONSTRAINT fk_analisis_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================
-- 7. TABLAS DE GESTIÓN DE ALERTAS
-- =================================================================

-- 7.1. Alertas (Registro de todas las notificaciones generadas)
DROP TABLE IF EXISTS Alertas;
CREATE TABLE Alertas (
    ID_Alerta BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Empresa INTEGER NOT NULL,
    Fecha_Hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo VARCHAR(20) NOT NULL,
    Categoria VARCHAR(20) NOT NULL,
    Mensaje TEXT NOT NULL,
    Accion_Recomendada TEXT,
    Leida BOOLEAN DEFAULT FALSE,
    Fecha_Leida DATETIME,
    CONSTRAINT fk_alerta_empresa
        FOREIGN KEY (ID_Empresa) REFERENCES Empresas (ID_Empresa) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7.2. Alerta_Producto (Relación entre una alerta y el producto afectado)
DROP TABLE IF EXISTS Alerta_Producto;
CREATE TABLE Alerta_Producto (
    ID_Relacion BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_Alerta BIGINT NOT NULL,
    ID_Producto INTEGER NOT NULL,
    CONSTRAINT fk_relacion_alerta
        FOREIGN KEY (ID_Alerta) REFERENCES Alertas (ID_Alerta) ON DELETE CASCADE,
    CONSTRAINT fk_relacion_producto
        FOREIGN KEY (ID_Producto) REFERENCES Productos (ID_Producto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================
-- 8. TABLAS DE LARAVEL (Sesiones y Caché)
-- =================================================================

-- 8.1. Sessions (Para el manejo de sesiones de Laravel)
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_last_activity (last_activity)
) ENGINE=InnoDB;

-- 8.2. Cache (Para el sistema de caché de Laravel)
DROP TABLE IF EXISTS cache;
CREATE TABLE cache (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    value MEDIUMTEXT NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_cache_expiration (expiration)
) ENGINE=InnoDB;

-- 8.3. Cache Locks (Para bloqueos de caché de Laravel)
DROP TABLE IF EXISTS cache_locks;
CREATE TABLE cache_locks (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INT NOT NULL,
    INDEX idx_cache_locks_expiration (expiration)
) ENGINE=InnoDB;

-- =================================================================
-- 9. ÍNDICES PARA OPTIMIZACIÓN
-- =================================================================

CREATE INDEX idx_ventas_empresa_fecha ON Ventas_Cabecera (ID_Empresa, Fecha_Venta DESC);
CREATE INDEX idx_produccion_empresa_fecha ON Produccion_Registro (ID_Empresa, Fecha DESC);
CREATE INDEX idx_costos_empresa_fecha ON Registro_Costos (ID_Empresa, Fecha DESC);
CREATE INDEX idx_alertas_empresa_fecha_leida ON Alertas (ID_Empresa, Fecha_Hora DESC, Leida);
CREATE INDEX idx_usuarios_empresa ON Usuarios (ID_Empresa);
CREATE INDEX idx_inventario_producto ON Inventario (ID_Producto);
CREATE INDEX idx_registro_costos_categoria ON Registro_Costos (ID_Categoria);
CREATE INDEX idx_prediccion_producto ON Prediccion_Ventas_Producto (ID_Producto);

-- Reactivar la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

