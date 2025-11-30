require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
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

// Database helper
async function getDbClient() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    return client;
}

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// AUTH ROUTES
app.post("/api/auth/login", async (req, res) => {
    const client = await getDbClient();
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username y password son requeridos" });
        }

        const result = await client.query(
            'SELECT id, username, password FROM "Usuario" WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    } finally {
        await client.end();
    }
});

// DASHBOARD / ANALYSIS ROUTES
app.get("/api/analisis/dashboard", authenticateToken, async (req, res) => {
    const client = await getDbClient();
    try {
        // Get total sales
        const salesResult = await client.query(
            'SELECT SUM("precioTotal") as total FROM "Venta" WHERE fecha >= NOW() - INTERVAL \'30 days\''
        );

        // Get total inventory value
        const inventoryResult = await client.query(
            `SELECT SUM(i."cantidadActual" * p."precioVenta") as total
             FROM "Inventario" i
             JOIN "Producto" p ON i."productoId" = p.id`
        );

        // Get average cost
        const costResult = await client.query(
            'SELECT AVG(monto) as promedio FROM "Costo"'
        );

        // Sales by month (last 6 months)
        const salesByMonth = await client.query(
            `SELECT 
                TO_CHAR(fecha, 'Mon') as mes,
                SUM("precioTotal") as total,
                SUM(cantidad) as unidades
             FROM "Venta"
             WHERE fecha >= NOW() - INTERVAL '6 months'
             GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
             ORDER BY EXTRACT(MONTH FROM fecha)`
        );

        // Inventory status
        const inventoryStatus = await client.query(
            `SELECT 
                p.nombre,
                i."cantidadActual" as actual,
                i."cantidadMinima" as minimo,
                i."cantidadMaxima" as optimo
             FROM "Inventario" i
             JOIN "Producto" p ON i."productoId" = p.id
             LIMIT 10`
        );

        res.json({
            metricas: {
                ventasMes: parseFloat(salesResult.rows[0]?.total || 0),
                produccionActual: parseFloat(inventoryResult.rows[0]?.total || 0),
                costoPromedio: parseFloat(costResult.rows[0]?.promedio || 0),
                eficiencia: 85
            },
            ventasPorMes: salesByMonth.rows,
            inventarioEstado: inventoryStatus.rows
        });
    } catch (error) {
        console.error("Error en dashboard:", error);
        res.status(500).json({ message: "Error al obtener datos del dashboard", error: error.message });
    } finally {
        await client.end();
    }
});

// PRODUCTS ROUTES
app.get("/api/productos", authenticateToken, async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query(
            'SELECT * FROM "Producto" ORDER BY nombre'
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// SALES ROUTES
app.get("/api/ventas", authenticateToken, async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query(
            `SELECT v.*, p.nombre as producto_nombre
             FROM "Venta" v
             JOIN "Producto" p ON v."productoId" = p.id
             ORDER BY v.fecha DESC
             LIMIT 100`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// INVENTORY  ROUTES
app.get("/api/inventario", authenticateToken, async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query(
            `SELECT i.*, p.nombre as producto_nombre
             FROM "Inventario" i
             JOIN "Producto" p ON i."productoId" = p.id
             ORDER BY p.nombre`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// ALERTS ROUTES
app.get("/api/alertas", authenticateToken, async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query(
            'SELECT * FROM "Alerta" ORDER BY fecha DESC LIMIT 50'
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// Root route
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Análisis Económico ECO300",
        version: "2.0.0 (Standalone)",
        status: "OK",
        endpoints: [
            "POST /api/auth/login",
            "GET /api/analisis/dashboard",
            "GET /api/productos",
            "GET /api/ventas",
            "GET /api/inventario",
            "GET /api/alertas"
        ]
    });
});

// Health check
app.get("/health", async (req, res) => {
    try {
        const client = await getDbClient();
        await client.query('SELECT 1');
        await client.end();
        res.json({ status: "OK", database: "Connected" });
    } catch (error) {
        res.status(500).json({ status: "ERROR", database: "Disconnected", error: error.message });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        error: "Error interno del servidor",
        mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Servidor backend en http://localhost:${PORT}`);
    console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ CORS habilitado para: http://localhost:5173, http://localhost:5174`);
    console.log(`✓ Endpoints disponibles: 6 rutas API`);
});
