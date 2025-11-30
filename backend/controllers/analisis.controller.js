const prisma = require('../utils/prisma');
const {
    calcularElasticidad,
    calcularEquilibrio,
    predecirDemanda,
    generarAlertas,
    calcularMetricasEconomicas
} = require('../utils/economics');

// GET /api/analisis/elasticidad/:productoId - Calcular elasticidad precio-demanda
exports.getElasticidad = async (req, res) => {
    try {
        const { productoId } = req.params;

        const ventas = await prisma.venta.findMany({
            where: { productoId: parseInt(productoId) },
            orderBy: { fecha: 'asc' },
            select: { precioUnitario: true, cantidad: true, fecha: true }
        });

        if (ventas.length < 2) {
            return res.status(400).json({ error: 'Se necesitan al menos 2 ventas para calcular elasticidad' });
        }

        const resultado = calcularElasticidad(ventas);

        res.json(resultado);
    } catch (error) {
        console.error('Error al calcular elasticidad:', error);
        res.status(500).json({ error: 'Error al calcular elasticidad' });
    }
};

// GET /api/analisis/equilibrio/:productoId - Calcular punto de equilibrio
exports.getEquilibrio = async (req, res) => {
    try {
        const { productoId } = req.params;

        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(productoId) }
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Obtener costos fijos (para el producto o generales)
        const costosFijos = await prisma.costo.findMany({
            where: {
                tipo: 'FIJO',
                OR: [
                    { productoId: parseInt(productoId) },
                    { productoId: null }
                ]
            }
        });

        const totalCostosFijos = costosFijos.reduce((sum, c) => sum + c.monto, 0);

        const resultado = calcularEquilibrio(
            totalCostosFijos,
            producto.costoProduccion,
            producto.precioVenta
        );

        res.json({
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                precioVenta: producto.precioVenta,
                costoProduccion: producto.costoProduccion
            },
            costosFijos: totalCostosFijos,
            ...resultado
        });
    } catch (error) {
        console.error('Error al calcular equilibrio:', error);
        res.status(500).json({ error: 'Error al calcular equilibrio' });
    }
};

// GET /api/analisis/prediccion/:productoId - Predecir demanda futura
exports.getPrediccion = async (req, res) => {
    try {
        const { productoId } = req.params;
        const { dias = 30 } = req.query;

        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(productoId) }
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Obtener historial de ventas
        const ventas = await prisma.venta.findMany({
            where: { productoId: parseInt(productoId) },
            orderBy: { fecha: 'asc' },
            select: { cantidad: true, fecha: true }
        });

        if (ventas.length < 3) {
            return res.status(400).json({ error: 'Se necesitan al menos 3 ventas para predecir demanda' });
        }

        const prediccion = predecirDemanda(ventas, parseInt(dias));

        // Guardar predicción en la base de datos
        const prediccionGuardada = await prisma.prediccion.create({
            data: {
                productoId: parseInt(productoId),
                demandaPredicha: prediccion.demandaPredicha,
                periodo: `${dias}_dias`,
                fechaPrediccion: new Date(Date.now() + parseInt(dias) * 24 * 60 * 60 * 1000),
                confianza: prediccion.confianza,
                metodo: 'regresion_lineal'
            }
        });

        res.json({
            producto: {
                id: producto.id,
                nombre: producto.nombre
            },
            prediccion: {
                ...prediccion,
                id: prediccionGuardada.id,
                diasFuturos: parseInt(dias),
                fechaPrediccion: prediccionGuardada.fechaPrediccion
            },
            totalVentasHistoricas: ventas.length
        });
    } catch (error) {
        console.error('Error al predecir demanda:', error);
        res.status(500).json({ error: 'Error al predecir demanda' });
    }
};

// GET /api/analisis/alertas - Obtener todas las alertas activas
exports.getAlertas = async (req, res) => {
    try {
        const { leida, tipo, severidad } = req.query;

        const where = {};
        if (leida !== undefined) where.leida = leida === 'true';
        if (tipo) where.tipo = tipo;
        if (severidad) where.severidad = severidad;

        const alertas = await prisma.alerta.findMany({
            where,
            orderBy: [
                { leida: 'asc' },
                { fecha: 'desc' }
            ]
        });

        res.json(alertas);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};

// POST /api/analisis/alertas/generar - Generar alertas para todos los productos
exports.generarAlertasAutomaticas = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            include: { inventarios: true }
        });

        const alertasGeneradas = [];

        for (const producto of productos) {
            if (!producto.inventarios || producto.inventarios.length === 0) continue;

            const inventario = producto.inventarios[0];

            // Obtener ventas recientes (últimos 30 días)
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 30);

            const ventasRecientes = await prisma.venta.findMany({
                where: {
                    productoId: producto.id,
                    fecha: { gte: fechaLimite }
                }
            });

            // Obtener predicción más reciente
            const prediccion = await prisma.prediccion.findFirst({
                where: { productoId: producto.id },
                orderBy: { createdAt: 'desc' }
            });

            // Generar alertas
            const alertas = generarAlertas(inventario, ventasRecientes, prediccion, producto);

            // Guardar alertas en la base de datos
            for (const alerta of alertas) {
                const alertaGuardada = await prisma.alerta.create({
                    data: alerta
                });
                alertasGeneradas.push(alertaGuardada);
            }
        }

        res.json({
            total: alertasGeneradas.length,
            alertas: alertasGeneradas
        });
    } catch (error) {
        console.error('Error al generar alertas:', error);
        res.status(500).json({ error: 'Error al generar alertas' });
    }
};

// PUT /api/analisis/alertas/:id/marcar-leida - Marcar alerta como leída
exports.marcarAlertaLeida = async (req, res) => {
    try {
        const { id } = req.params;

        const alerta = await prisma.alerta.update({
            where: { id: parseInt(id) },
            data: { leida: true }
        });

        res.json(alerta);
    } catch (error) {
        console.error('Error al marcar alerta:', error);
        res.status(500).json({ error: 'Error al marcar alerta' });
    }
};

// GET /api/analisis/metricas - Obtener métricas económicas generales
exports.getMetricas = async (req, res) => {
    try {
        const { fechaDesde, fechaHasta } = req.query;

        const where = {};
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
            if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
        }

        // Obtener ventas y costos
        const ventas = await prisma.venta.findMany({
            where: fechaDesde || fechaHasta ? { fecha: where.fecha } : {}
        });

        const costos = await prisma.costo.findMany({
            where: fechaDesde || fechaHasta ? { fecha: where.fecha } : {}
        });

        const metricas = calcularMetricasEconomicas(ventas, costos);

        // Información adicional
        const totalProductos = await prisma.producto.count();
        const alertasActivas = await prisma.alerta.count({
            where: { leida: false }
        });

        res.json({
            ...metricas,
            totalProductos,
            alertasActivas,
            totalVentas: ventas.length,
            totalCostosRegistrados: costos.length
        });
    } catch (error) {
        console.error('Error al obtener métricas:', error);
        res.status(500).json({ error: 'Error al obtener métricas' });
    }
};

// GET /api/analisis/dashboard - Dashboard completo con todas las métricas
exports.getDashboard = async (req, res) => {
    try {
        // Métricas generales
        const totalProductos = await prisma.producto.count();
        const totalVentas = await prisma.venta.count();
        const alertasActivas = await prisma.alerta.count({ where: { leida: false } });

        // Ventas y costos
        const ventas = await prisma.venta.findMany();
        const costos = await prisma.costo.findMany();
        const metricas = calcularMetricasEconomicas(ventas, costos);

        // Productos más vendidos
        const productosVentas = await prisma.venta.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true, precioTotal: true },
            orderBy: { _sum: { cantidad: 'desc' } },
            take: 5
        });

        const topProductos = await Promise.all(
            productosVentas.map(async (pv) => {
                const producto = await prisma.producto.findUnique({
                    where: { id: pv.productoId }
                });
                return {
                    ...producto,
                    cantidadVendida: pv._sum.cantidad,
                    ingresoTotal: pv._sum.precioTotal
                };
            })
        );

        // Inventario con alertas
        const inventariosBajos = await prisma.inventario.count({
            where: {
                cantidadActual: { lt: prisma.raw('cantidad_minima') }
            }
        });

        // Ventas recientes (últimos 7 días)
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);

        const ventasRecientes = await prisma.venta.count({
            where: { fecha: { gte: hace7Dias } }
        });

        res.json({
            resumen: {
                totalProductos,
                totalVentas,
                ventasRecientes,
                alertasActivas,
                inventariosBajos
            },
            metricas,
            topProductos,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error al obtener dashboard:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};
