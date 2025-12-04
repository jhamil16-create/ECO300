# ECO300 - Sistema de Gestión Empresarial

Sistema de gestión empresarial desarrollado para el curso de Economía para la Gestión (ECO300) de la UAGRM. Este proyecto permite gestionar inventario, ventas, y alertas de manera eficiente, integrando análisis microeconómico avanzado.

## 📋 Descripción

ECO300 es una aplicación web full-stack que proporciona herramientas completas para la gestión empresarial, incluyendo:

- **Gestión de Inventario**: Control de productos con seguimiento de stock actual, nivel óptimo y punto de reorden.
- **Gestión de Ventas**: Registro y seguimiento de transacciones comerciales con detalles por producto.
- **Análisis Económico**: Cálculo automático de métricas microeconómicas clave.
- **Sistema de Alertas**: Notificaciones automáticas para stock crítico y sobreproducción.
- **Dashboard Interactivo**: Panel de control con gráficos en tiempo real y animaciones 3D.
- **Diseño Responsivo**: Interfaz optimizada para móviles con navegación flotante.

## 🧪 Datos de Prueba y Credenciales

Para probar el sistema completo, puedes usar las siguientes credenciales pre-configuradas:

- **Usuario**: `admintest@gmail.com`
- **Contraseña**: `admintest123`

### Generación de Datos
Si deseas reiniciar o generar nuevos datos de prueba (ventas, productos, inventario), ejecuta el siguiente script:

```bash
php test_full_flow.php
```
Este script creará una empresa, un usuario administrador, productos de prueba y transacciones de venta para alimentar los gráficos.

## 📖 Manual de Uso

### 1. Dashboard
El panel principal muestra 4 tarjetas métricas con **efecto Tilt 3D** (responden al movimiento del mouse).
- **Ventas del Mes**: Total monetario de ventas en el mes actual.
- **Producción Actual**: Cantidad total de unidades producidas/vendidas.
- **Costo Promedio**: Costo unitario promedio ponderado.
- **Eficiencia**: Indicador de rendimiento operativo.

### 2. Inventario
- Accede desde el menú lateral (Escritorio) o la barra inferior (Móvil).
- **Crear Producto**: Botón "Nuevo Producto". Ingresa nombre, stock inicial, nivel óptimo y punto de reorden.
- **Alertas**: El sistema marcará en rojo los productos con stock por debajo del punto de reorden.

### 3. Ventas
- **Registrar Venta**: Selecciona productos del catálogo, ajusta cantidades y precios en el carrito, y confirma la venta.
- **Historial**: Visualiza las últimas transacciones registradas.

## 📊 Fórmulas Económicas Utilizadas

El sistema implementa lógica de microeconomía avanzada en `EconomicAnalysisService.php`:

### 1. Predicción de Demanda (Regresión Lineal)
Utiliza el método de mínimos cuadrados para proyectar la demanda del próximo mes basándose en el histórico de los últimos 6 meses.
- **Fórmula**: $y = mx + b$
- Donde $m$ (pendiente) y $b$ (intersección) se calculan a partir de los pares $(mes, cantidad)$.

### 2. Rotación de Inventario
Calcula cuántos días tarda en renovarse el inventario promedio.
- **Fórmula**: $Días = \frac{Stock Promedio \times 360}{Costo de Ventas}$
- Ayuda a identificar productos de lento movimiento ("hueso") o alta rotación.

### 3. Punto de Equilibrio (Break-Even Point)
Determina la cantidad de unidades que se deben vender para cubrir los costos fijos y variables.
- **Fórmula**: $Q_{eq} = \frac{Costos Fijos}{Precio Unitario - Costo Variable Unitario}$

### 4. Elasticidad Precio de la Demanda
Mide la sensibilidad de la demanda ante cambios en el precio (Elasticidad Arco).
- **Fórmula**: $E = \frac{\Delta Q / \bar{Q}}{\Delta P / \bar{P}} = \frac{Q_2 - Q_1}{Q_2 + Q_1} \times \frac{P_2 + P_1}{P_2 - P_1}$
- **Interpretación**:
    - $|E| > 1$: Elástica (sensible al precio).
    - $|E| < 1$: Inelástica (poco sensible).

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 12**: Framework PHP.
- **PHP 8.2+**: Lenguaje del servidor.
- **MariaDB/MySQL**: Base de datos.

### Frontend
- **Vue.js 3**: Framework reactivo.
- **Tailwind CSS**: Estilos y diseño responsivo.
- **Inertia.js**: Monolito moderno.
- **@vueuse/motion**: Animaciones de entrada.
- **@vueuse/core**: Interacciones del mouse (Tilt).

## 🚀 Instalación y Configuración

### 1. Clonar y Dependencias
```bash
git clone <url-repo>
cd ECO300
composer install
npm install
```

### 2. Configurar Entorno (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=eco300
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Base de Datos
```bash
php create_db.php
php artisan migrate
```

### 4. Ejecutar
Terminal 1:
```bash
php artisan serve
```
Terminal 2:
```bash
npm run dev
```

Visita: **http://localhost:8000**

## 🚀 Despliegue a Producción

Para preparar el proyecto para un entorno productivo (VPS, Servidor Dedicado, Cloud), sigue estos pasos críticos:

### 1. Optimización del Backend (Laravel)
En el servidor de producción, instala solo las dependencias necesarias y optimiza la carga:

```bash
# Instalar dependencias sin dev
composer install --optimize-autoloader --no-dev

# Optimizar configuración y rutas
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Construcción del Frontend (Vite)
Genera los archivos estáticos optimizados para producción. Esto creará la carpeta `public/build`.

```bash
npm run build
```

### 3. Configuración del Entorno (.env)
Asegúrate de cambiar estas variables en tu archivo `.env` de producción:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com
```

### 4. Servidor Web (Nginx/Apache)
Configura tu servidor web para apuntar a la carpeta `public/` del proyecto.

**Ejemplo Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/eco300/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

### 5. Permisos
Asegúrate de que las carpetas de almacenamiento tengan permisos de escritura:

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 🚂 Despliegue en Railway

Este proyecto está configurado para desplegarse automáticamente en Railway usando Docker.

### Pasos para Desplegar:

1.  **Subir a GitHub**: Asegúrate de que todo tu código (incluyendo el `Dockerfile` y la carpeta `docker/`) esté en tu repositorio.
2.  **Nuevo Proyecto en Railway**:
    -   Selecciona "Deploy from GitHub repo".
    -   Elige tu repositorio.
3.  **Variables de Entorno**:
    -   En la pestaña "Variables", agrega las siguientes:
        -   `APP_KEY`: (Genera una nueva con `php artisan key:generate --show`)
        -   `APP_DEBUG`: `false`
        -   `APP_URL`: `https://<tu-dominio-railway>.up.railway.app`
        -   `DB_CONNECTION`: `mysql`
        -   `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: (Usa las variables provistas por el servicio MySQL de Railway).
4.  **Base de Datos**:
    -   Agrega un servicio MySQL en tu proyecto Railway.
    -   Conecta las variables automáticamente o cópialas manualmente.
5.  **Despliegue**:
    -   Railway detectará el `Dockerfile` y construirá la imagen.
    -   El proceso puede tardar unos minutos (instalar dependencias PHP y Node).

¡Listo! Tu aplicación estará corriendo en la URL proporcionada por Railway.
