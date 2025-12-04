# Guía de Migración a Nueva Base de Datos MariaDB

## Resumen de Cambios

El proyecto ECO300 ha sido completamente actualizado para trabajar con una nueva estructura de base de datos MariaDB/MySQL que incluye:

- **Arquitectura multi-empresa**: Cada empresa tiene sus propios datos
- **Estructura normalizada**: Tablas separadas para ventas, producción, costos, predicciones
- **Sistema de alertas mejorado**: Con categorización y acciones recomendadas
- **Análisis predictivo**: Tablas para predicciones y análisis inteligente

## Pasos para Migrar

### 1. Backup de Datos Actuales (si aplica)

Si tienes datos en la base de datos anterior, haz un backup:

```bash
# Para SQLite
cp database/database.sqlite database/database.sqlite.backup
```

### 2. Configurar .env para MariaDB/MySQL

Actualiza tu archivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eco300
DB_USERNAME=root
DB_PASSWORD=tu_password
```

### 3. Crear la Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS eco300 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eco300;
```

### 4. Ejecutar el Script SQL

**Opción 1: Desde línea de comandos**

```bash
mysql -u root -p eco300 < database/schema_mariadb.sql
```

**Opción 2: Desde phpMyAdmin o MySQL Workbench**

1. Abre tu cliente SQL
2. Selecciona la base de datos `eco300`
3. Abre el archivo `database/schema_mariadb.sql`
4. Copia y pega todo el contenido
5. Ejecuta el script

### 5. Verificar la Instalación

```sql
SHOW TABLES;
```

Deberías ver todas las tablas creadas:
- Empresas
- Usuarios
- Productos
- Inventario
- Ventas_Cabecera
- Ventas_Detalle
- Produccion_Registro
- Produccion_Detalle
- Registro_Costos
- Alertas
- Y más...

### 6. Crear una Empresa y Usuario de Prueba

```sql
-- Crear empresa de prueba
INSERT INTO Empresas (Nombre, RUC_o_NIT, Ciudad) 
VALUES ('Empresa Demo', '1234567890', 'Santa Cruz');

-- Obtener el ID de la empresa creada (ajusta según tu caso)
SET @empresa_id = LAST_INSERT_ID();

-- Crear usuario de prueba
INSERT INTO Usuarios (ID_Empresa, Nombre, Email, Hash_Password, Rol)
VALUES (
    @empresa_id,
    'Administrador',
    'admin@demo.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'Administrador'
);
```

### 7. Probar el Sistema

1. Inicia los servidores:
   ```bash
   php artisan serve
   npm run dev
   ```

2. Accede a `http://localhost:8000`
3. Inicia sesión con:
   - Email: `admin@demo.com`
   - Password: `password`

## Estructura de Tablas Principales

### Gestión
- **Empresas**: Información de las empresas registradas
- **Usuarios**: Usuarios del sistema vinculados a empresas

### Catálogo
- **Productos**: Productos de cada empresa
- **Proveedores**: Proveedores de la empresa

### Inventario
- **Inventario**: Estado actual de stock por producto
- **Historico_Stock**: Historial de movimientos de inventario

### Transacciones
- **Ventas_Cabecera**: Encabezados de ventas
- **Ventas_Detalle**: Detalles de productos vendidos
- **Produccion_Registro**: Registros de producción
- **Produccion_Detalle**: Detalles de productos producidos
- **Produccion_Planificada**: Planificación de producción

### Costos
- **Costos_Categoria**: Categorías de costos
- **Registro_Costos**: Registro de gastos
- **Proveedor_Detalle**: Detalles de proveedores

### Análisis
- **Factores_Prediccion**: Factores de demanda
- **Prediccion_Ventas_Total**: Predicciones generales
- **Prediccion_Ventas_Producto**: Predicciones por producto
- **Analisis_Inteligente**: Insights generados por ML

### Alertas
- **Alertas**: Sistema de notificaciones
- **Alerta_Producto**: Relación alertas-productos

## Notas Importantes

1. **Multi-empresa**: Todos los datos están vinculados a una empresa mediante `ID_Empresa`
2. **Nombres de campos**: Los campos usan nomenclatura en español (Nombre, Fecha_Venta, etc.)
3. **Claves primarias**: Usan el formato `ID_Tabla` (ej: ID_Producto, ID_Venta)
4. **Timestamps**: Algunas tablas usan campos personalizados como `Fecha_Registro`, `Fecha_Venta`

## Solución de Problemas

### Error: "Table doesn't exist"
Asegúrate de haber ejecutado el script SQL completo.

### Error: "Access denied for user"
Verifica las credenciales en tu archivo `.env`.

### Error: "Unknown column"
Verifica que el script SQL se haya ejecutado correctamente y que todas las tablas estén creadas.

