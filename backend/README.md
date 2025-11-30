# ECO300 - Sistema de Análisis Económico Empresarial

Backend de análisis económico para PYMEs con predicción de demanda, alertas automáticas y análisis microeconómico.

## 🚀 Tecnologías

- **Node.js** + **Express** - Backend API RESTful
- **PostgreSQL** - Base de datos
- **Prisma ORM** - Gestión de base de datos
- **Jest** + **Supertest** - Testing
- **dotenv** - Variables de entorno

## 📋 Prerequisitos

- Node.js >= 16.x
- PostgreSQL >= 12.x
- npm o yarn

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus credenciales:

```bash
copy .env.example .env
```

Edita `.env` y configura tu conexión a PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/eco300_db"
JWT_SECRET="tu_clave_secreta_muy_segura_aqui"
PORT=3000
NODE_ENV="development"
```

### 3. Generar Cliente Prisma

```bash
npm run prisma:generate
```

### 4. Ejecutar Migraciones

```bash
npm run prisma:migrate
```

Esto creará la base de datos y todas las tablas necesarias.

## 🎯 Ejecutar la Aplicación

### Modo Desarrollo (con auto-reload)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📊 Modelos de Datos

### Modelos Económicos

- **Producto** - Productos con precios y costos
- **Venta** - Registro de ventas
- **Inventario** - Control de stock
- **MovimientoInventario** - Historial de movimientos
- **Costo** - Costos fijos y variables
- **Prediccion** - Predicciones de demanda generadas
- **Alerta** - Alertas automáticas del sistema
- **FactorExterno** - Factores externos (inflación, clima, etc.)

### Modelos Auxiliares

- **Usuario** - Usuarios del sistema
- **Empleado** - Empleados de la empresa

## 🔗 Endpoints Principales

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `GET /api/productos/:id` - Ver producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta (actualiza inventario automáticamente)
- `GET /api/ventas/estadisticas/resumen` - Estadísticas de ventas
- `DELETE /api/ventas/:id` - Eliminar venta (devuelve stock)

### Inventario
- `GET /api/inventario` - Ver todo el inventario
- `GET /api/inventario/:productoId` - Ver inventario de producto
- `POST /api/inventario/:id/movimiento` - Registrar entrada/salida
- `GET /api/inventario/alertas/stock` - Alertas de stock (bajo/excesivo)

### Análisis Económico
- `GET /api/analisis/elasticidad/:productoId` - Calcular elasticidad precio-demanda
- `GET /api/analisis/equilibrio/:productoId` - Punto de equilibrio (break-even)
- `GET /api/analisis/prediccion/:productoId?dias=30` - Predecir demanda futura
- `GET /api/analisis/alertas` - Ver alertas activas
- `POST /api/analisis/alertas/generar` - Generar alertas automáticas
- `GET /api/analisis/metricas` - Métricas económicas globales
- `GET /api/analisis/dashboard` - Dashboard completo

## 🧪 Testing

### Ejecutar Todos los Tests

```bash
npm test
```

### Tests Específicos

```bash
npm run test:db          # Tests de base de datos
npm run test:api         # Tests de API
npm run test:economics   # Tests de cálculos económicos
```

### Tests con Coverage

```bash
npm test
```

El reporte de coverage estará en `coverage/lcov-report/index.html`

## 🛠️ Utilidades de Desarrollo

### Prisma Studio (Interfaz Visual para DB)

```bash
npm run prisma:studio
```

Abre una interfaz web en `http://localhost:5555` para ver y editar datos.

### Ver Schema de la DB

```bash
npx prisma studio
```

## 📈 Cálculos Económicos Implementados

### 1. Elasticidad Precio-Demanda

Fórmula: `E = (ΔQ/Q) / (ΔP/P)`

Calcula cuán sensible es la demanda a cambios de precio.

### 2. Punto de Equilibrio

Fórmula: `Q = Costos Fijos / (Precio - Costo Variable)`

Determina las unidades que debes vender para cubrir costos.

### 3. Predicción de Demanda

Usa regresión lineal simple para predecir demanda futura basado en ventas históricas.

Fórmula: `y = mx + b`

### 4. Generación de Alertas Automáticas

- **ESCASEZ**: Stock por debajo del mínimo
- **SOBREPRODUCCION**: Stock por encima del máximo
- **BAJO_MARGEN**: Margen de ganancia < 20%
- **ALTA_DEMANDA**: Predicción supera inventario
- **VENTAS_BAJAS**: Ventas inferiores al promedio

## 🔍 Health Check

Verifica el estado del servidor y la conexión a la base de datos:

```bash
curl http://localhost:3000/health
```

Respuesta exitosa:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

## 📝 Notas Importantes

1. **IMPORTANTE**: Nunca subas el archivo `.env` a control de versiones
2. El archivo `prisma.config.ts` fue eliminado (no es parte de Prisma)
3. Las ventas actualizan automáticamente el inventario mediante transacciones
4. Las predicciones se guardan automáticamente en la base de datos
5. Las alertas se pueden generar manualmente o automáticamente

## 🐛 Troubleshooting

### Error de Conexión a PostgreSQL

- Verifica que PostgreSQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Verifica que la base de datos exista

### Error "Prisma Client is not generated"

Ejecuta:
```bash
npm run prisma:generate
```

### Tests Fallan

- Asegúrate de que la base de datos esté corriendo
- Verifica que las migraciones estén actualizadas: `npm run prisma:migrate`

## 📚 Próximos Pasos

1. Implementar autenticación JWT completa
2. Agregar más factores externos (APIs de clima, inflación)
3. Mejorar algoritmos de predicción (ARIMA, ML)
4. Dashboard frontend con React
5. Reportes en PDF
6. Integración con servicios de mensajería para alertas

## 👥 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

**ECO300** - Ayudando a PYMEs a optimizar producción y recursos mediante análisis económico predicativo 📊
