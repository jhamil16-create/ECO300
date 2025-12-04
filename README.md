# ECO300 - Sistema de Gestión Empresarial

Sistema de gestión empresarial desarrollado para el curso de Economía para la Gestión (ECO300) de la UAGRM. Este proyecto permite gestionar inventario, ventas, empleados y alertas de manera eficiente.

## 📋 Descripción

ECO300 es una aplicación web full-stack que proporciona herramientas completas para la gestión empresarial, incluyendo:

- **Gestión de Inventario**: Control de productos con seguimiento de stock actual, nivel óptimo y punto de reorden
- **Gestión de Ventas**: Registro y seguimiento de transacciones comerciales con detalles por producto
- **Gestión de Producción**: Control de ciclos de producción, planificación vs real, y eficiencia
- **Gestión de Costos**: Categorización de costos (materias primas, mano de obra, marketing, etc.) y seguimiento de proveedores
- **Predicciones**: Análisis predictivo de ventas basado en factores de demanda y machine learning
- **Sistema de Alertas**: Notificaciones automáticas para stock crítico, sobreproducción, tendencias de ventas y más
- **Dashboard Interactivo**: Panel de control con gráficos en tiempo real, métricas clave y análisis visual
- **Multi-empresa**: Arquitectura que soporta múltiples empresas con datos separados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 12**: Framework PHP para el desarrollo del backend
- **PHP 8.2+**: Lenguaje de programación del servidor
- **MariaDB/MySQL**: Base de datos relacional
- **Laravel Breeze**: Autenticación y scaffolding
- **Inertia.js**: Bridge entre Laravel y Vue.js

### Frontend
- **Vue.js 3**: Framework JavaScript para la interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Inertia.js**: Integración con Laravel sin necesidad de API REST
- **Tailwind CSS**: Framework de utilidades CSS
- **Vite**: Build tool y dev server
- **Chart.js**: Gráficos y visualización de datos
- **Lucide Icons**: Iconos modernos

## 📦 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

1.  **PHP 8.2 o superior**: [Descargar PHP](https://windows.php.net/download/)
    -   Asegúrate de habilitar las extensiones: `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`.
2.  **Composer**: [Descargar Composer](https://getcomposer.org/download/)
3.  **Node.js (LTS) y npm**: [Descargar Node.js](https://nodejs.org/)
4.  **MariaDB o MySQL**: [Descargar XAMPP](https://www.apachefriends.org/es/index.html) (incluye MariaDB) o instalar MySQL por separado.
5.  **Git**: [Descargar Git](https://git-scm.com/)

### Extensiones Recomendadas para VS Code

Para una mejor experiencia de desarrollo, instala estas extensiones:

-   **PHP Intelephense**: Para autocompletado y análisis de PHP.
-   **Vue - Official**: Para soporte de Vue.js y TypeScript.
-   **Tailwind CSS IntelliSense**: Para autocompletado de clases de Tailwind.
-   **Laravel Blade Snippets**: Para sintaxis de Blade (si se usa).
-   **Pretty TypeScript Errors**: Para leer mejor los errores de TS.

## 🚀 Instalación y Configuración

Sigue estos pasos para configurar el proyecto desde cero.

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd ECO300
```

### 2. Instalar Dependencias

Instala las dependencias de PHP (Backend):
```bash
composer install
```

Instala las dependencias de Node.js (Frontend):
```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Abre el archivo `.env` y configura la conexión a la base de datos (MariaDB/MySQL):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eco300
DB_USERNAME=root
DB_PASSWORD=
```
*(Ajusta `DB_USERNAME` y `DB_PASSWORD` según tu configuración local. Si usas XAMPP por defecto, el usuario es `root` y la contraseña está vacía).*

### 4. Generar Clave de Aplicación

```bash
php artisan key:generate
```

### 5. Configurar Base de Datos

#### Opción A: Script Automático (Recomendado)
El proyecto incluye un script para crear la base de datos si no existe:

```bash
php create_db.php
```

#### Opción B: Manual
1.  Abre tu gestor de base de datos (phpMyAdmin, HeidiSQL, DBeaver).
2.  Crea una nueva base de datos llamada `eco300`.

#### Ejecutar Migraciones
Una vez creada la base de datos, ejecuta las migraciones para crear las tablas:

```bash
php artisan migrate
```

*(Opcional) Si deseas poblar la base de datos con datos de prueba:*
```bash
php artisan db:seed
```

## ▶️ Ejecución del Proyecto

Para correr el proyecto, necesitas ejecutar dos terminales simultáneamente.

### Terminal 1: Backend (Laravel)

Inicia el servidor de desarrollo de Laravel:

```bash
php artisan serve
```
Esto iniciará el backend en `http://localhost:8000`.

### Terminal 2: Frontend (Vite)

Inicia el servidor de desarrollo de Vite (para compilar assets y hot reload):

```bash
npm run dev
```

### Acceso a la Aplicación

Abre tu navegador y visita: **[http://localhost:8000](http://localhost:8000)**

> **Nota**: No intentes acceder por el puerto de Vite (5173), ya que Laravel maneja el enrutamiento y la inyección de assets.

