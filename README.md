# ECO300 - Sistema de Gestión Económica Empresarial

## 1. Introducción
**ECO300** es una plataforma integral diseñada para la gestión operativa y el análisis económico de micro y pequeñas empresas. El sistema combina herramientas de administración tradicional (inventario, ventas, producción) con módulos de **Inteligencia de Negocios (BI)** y análisis microeconómico automatizado para facilitar la toma de decisiones estratégicas.

---

## 2. Nivel Técnico
El sistema sigue una arquitectura moderna de **Monolito Modular** utilizando el patrón **MVC (Modelo-Vista-Controlador)** potenciado para comportarse como una **Single Page Application (SPA)**.

*   **Arquitectura de Software**:
    *   **Backend**: Laravel (PHP) actúa como API y controlador de lógica de negocio.
    *   **Frontend**: Vue.js renderiza la interfaz de usuario de forma reactiva.
    *   **Capa de Servicio**: Se implementó un `EconomicAnalysisService` dedicado para encapsular la lógica matemática y estadística compleja (cálculo de elasticidad, predicción de demanda), manteniendo los controladores ligeros.
    *   **Comunicación**: Inertia.js elimina la necesidad de una API REST compleja, permitiendo que el backend envíe datos directamente a los componentes Vue como "props".

---

## 3. Nivel Económico
El valor diferencial de este proyecto radica en la aplicación de teoría microeconómica real sobre los datos operativos:

*   **Teoría de la Producción**:
    *   **Eficiencia Productiva**: Cálculo de la eficiencia basado en *output* real vs. recursos utilizados.
    *   **Análisis de Costos**: Monitoreo de costos medios y marginales para optimizar el nivel de producción.
*   **Gestión de Inventarios**:
    *   **Punto de Reorden**: Alertas automáticas basadas en niveles mínimos de stock para evitar roturas de stock (Costos de Escasez).
    *   **Nivel Óptimo**: Detección de sobreproducción para minimizar Costos de Almacenamiento y Costos de Oportunidad del capital inmovilizado.
*   **Análisis de Demanda**:
    *   **Tendencias de Mercado**: Algoritmos que analizan el historial de ventas (últimos 3 meses) para detectar contracciones en la demanda (`Tendencia Baja`).
    *   **Elasticidad (Implícita)**: El sistema prepara los datos para futuros análisis de sensibilidad precio-demanda.

---

## 4. Funcionalidades Principales
1.  **Dashboard Ejecutivo**:
    *   Visualización de KPIs en tiempo real: Ventas mensuales, Producción actual (en unidades), Costo promedio y Eficiencia.
    *   Gráficas comparativas: *Ventas vs Producción* (análisis de equilibrio) y *Estado de Inventario*.
2.  **Gestión de Inventario**:
    *   CRUD completo de productos y categorías.
    *   Definición de parámetros económicos (Punto de reorden, Nivel óptimo).
3.  **Registro de Ventas**:
    *   Punto de venta (POS) rápido con cálculo automático de totales.
    *   Historial transaccional detallado.
4.  **Sistema de Alertas Inteligentes**:
    *   **Stock Crítico**: Aviso inmediato al cruzar el umbral mínimo.
    *   **Stock Agotado**: Alerta de alta prioridad.
    *   **Sobreproducción**: Advertencia de ineficiencia por exceso de inventario.
    *   **Tendencia Baja**: Detección proactiva de caída en ventas.

---

## 5. Tecnologías Utilizadas
*   **Laravel 10** (PHP): Framework robusto, seguro y escalable para el backend.
*   **Vue.js 3** (Composition API): Framework progresivo para interfaces dinámicas y reactivas.
*   **Inertia.js**: El "pegamento" que permite construir una SPA sin la complejidad de una API separada.
*   **Tailwind CSS**: Framework de utilidad para un diseño moderno, responsivo y rápido.
*   **MariaDB / MySQL**: Base de datos relacional para la integridad de datos transaccionales.
*   **Shadcn UI / Lucide Icons**: Componentes de interfaz profesionales y consistentes.

### ¿Por qué estas tecnologías?
*   **Eficiencia de Desarrollo**: Laravel + Inertia permite desarrollar funcionalidades "Full Stack" a una velocidad superior a la separación tradicional Backend/Frontend.
*   **Experiencia de Usuario (UX)**: Vue.js ofrece una experiencia fluida sin recargas de página, crucial para un sistema de gestión diario.
*   **Mantenibilidad**: TypeScript y el tipado fuerte en el backend aseguran un código más limpio y menos propenso a errores.

---

## 6. Base de Datos y Backend
La interacción entre Laravel y la Base de Datos se maneja en dos niveles para optimizar el rendimiento:

1.  **Eloquent ORM**: Se utiliza para operaciones transaccionales estándar (Crear un producto, Registrar una venta). Esto garantiza que las relaciones (ej. `Producto` -> `Inventario`) se mantengan íntegras y el código sea legible.
    *   *Ejemplo*: `$producto->inventario->Stock_Actual`.
2.  **Query Builder (DB Facade)**: Se utiliza para los análisis económicos pesados y la generación de gráficas en el Dashboard.
    *   *Razón*: Permite realizar agregaciones complejas (SUM, AVG, JOINS múltiples) directamente en el motor de base de datos, siendo mucho más rápido que procesar miles de objetos en memoria PHP.
    *   *Caso de uso*: El cálculo de la "Producción Actual", que suma `produccion_detalle.Cantidad` cruzando con `produccion_registro` y filtrando por fecha.

---

## 7. Flujo de Trabajo de la Web
El flujo típico de un gerente en ECO300 es cíclico y estratégico:

1.  **Input (Operación)**:
    *   El personal registra la **Producción** diaria y las **Ventas** en el sistema.
    *   Se actualizan los niveles de **Inventario**.
2.  **Procesamiento (Sistema)**:
    *   Al cargar, el sistema ejecuta el `EconomicAnalysisService`.
    *   Compara *Stock Actual* vs *Punto de Reorden* y *Nivel Óptimo*.
    *   Analiza la pendiente de la curva de ventas reciente.
3.  **Output (Decisión)**:
    *   El gerente revisa el **Dashboard** para ver la salud general.
    *   Revisa la sección de **Alertas**:
        *   *¿Alerta de Stock Crítico?* -> Acción: Ordenar materia prima.
        *   *¿Alerta de Tendencia Baja?* -> Acción: Lanzar promoción o ajustar precio.
        *   *¿Sobreproducción?* -> Acción: Pausar línea de producción.

Este flujo transforma datos crudos en inteligencia accionable.
