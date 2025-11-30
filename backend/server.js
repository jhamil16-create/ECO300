require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const empleadosRoutes = require("./routes/empleados.routes");
const productosRoutes = require("./routes/productos.routes");
const ventasRoutes = require("./routes/ventas.routes");
const inventarioRoutes = require("./routes/inventario.routes");
const analisisRoutes = require("./routes/analisis.routes");

const prisma = require("./utils/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Vite dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/analisis", analisisRoutes);

// Ruta raíz
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Análisis Económico ECO300",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            empleados: "/api/empleados",
            productos: "/api/productos",
            ventas: "/api/ventas",
            inventario: "/api/inventario",
            analisis: "/api/analisis"
        }
    });
});

// Ruta de salud
app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "OK", database: "Connected" });
    } catch (error) {
        res.status(500).json({ status: "ERROR", database: "Disconnected", error: error.message });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        error: "Error interno del servidor",
        mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Verificar conexión a base de datos y arrancar servidor
async function startServer() {
    try {
        await prisma.$connect();
        console.log("✓ Conexión a PostgreSQL establecida");

        app.listen(PORT, () => {
            console.log(`✓ Servidor backend en http://localhost:${PORT}`);
            console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error("✗ Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\nCerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nCerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
