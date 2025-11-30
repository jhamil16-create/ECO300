const prisma = require('../utils/prisma');

// GET /api/inventario - Listar todo el inventario
exports.getInventario = async (req, res) => {
    try {
        const inventario = await prisma.inventario.findMany({
            include: {
                producto: true,
                movimientos: {
                    orderBy: { fecha: 'desc' },
                    take: 5
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(inventario);
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
};

// GET /api/inventario/:id - Obtener inventario de un producto
exports.getInventarioByProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const inventario = await prisma.inventario.findUnique({
            where: { productoId: parseInt(id) },
            include: {
                producto: true,
                movimientos: {
                    orderBy: { fecha: 'desc' },
                    take: 20
                }
            }
        });

        if (!inventario) {
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        res.json(inventario);
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
};

// PUT /api/inventario/:id - Actualizar configuración de inventario
exports.updateInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidadMinima, cantidadMaxima, ubicacion } = req.body;

        const inventario = await prisma.inventario.update({
            where: { id: parseInt(id) },
            data: {
                ...(cantidadMinima !== undefined && { cantidadMinima: parseFloat(cantidadMinima) }),
                ...(cantidadMaxima !== undefined && { cantidadMaxima: parseFloat(cantidadMaxima) }),
                ...(ubicacion !== undefined && { ubicacion })
            },
            include: { producto: true }
        });

        res.json(inventario);
    } catch (error) {
        console.error('Error al actualizar inventario:', error);
        res.status(500).json({ error: 'Error al actualizar inventario' });
    }
};

// POST /api/inventario/:id/movimiento - Registrar movimiento de inventario
exports.registrarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, cantidad, motivo } = req.body;

        // Validaciones
        if (!tipo || !cantidad) {
            return res.status(400).json({ error: 'Tipo y cantidad son requeridos' });
        }

        if (!['ENTRADA', 'SALIDA'].includes(tipo)) {
            return res.status(400).json({ error: 'Tipo debe ser ENTRADA o SALIDA' });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
        }

        // Actualizar inventario y crear movimiento
        const inventario = await prisma.inventario.findUnique({
            where: { id: parseInt(id) }
        });

        if (!inventario) {
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        const nuevaCantidad = tipo === 'ENTRADA'
            ? inventario.cantidadActual + parseFloat(cantidad)
            : Math.max(0, inventario.cantidadActual - parseFloat(cantidad));

        const resultado = await prisma.inventario.update({
            where: { id: parseInt(id) },
            data: {
                cantidadActual: nuevaCantidad,
                movimientos: {
                    create: {
                        tipo,
                        cantidad: parseFloat(cantidad),
                        motivo: motivo || `Movimiento ${tipo.toLowerCase()} manual`
                    }
                }
            },
            include: {
                producto: true,
                movimientos: {
                    orderBy: { fecha: 'desc' },
                    take: 10
                }
            }
        });

        res.json(resultado);
    } catch (error) {
        console.error('Error al registrar movimiento:', error);
        res.status(500).json({ error: 'Error al registrar movimiento' });
    }
};

// GET /api/inventario/alertas/stock - Obtener alertas de stock
exports.getAlertasStock = async (req, res) => {
    try {
        const inventarios = await prisma.inventario.findMany({
            include: { producto: true }
        });

        const alertas = {
            stockBajo: [],
            stockExcesivo: [],
            stockNormal: []
        };

        inventarios.forEach(inv => {
            if (inv.cantidadActual < inv.cantidadMinima) {
                alertas.stockBajo.push({
                    ...inv,
                    diferencia: inv.cantidadMinima - inv.cantidadActual
                });
            } else if (inv.cantidadActual > inv.cantidadMaxima) {
                alertas.stockExcesivo.push({
                    ...inv,
                    diferencia: inv.cantidadActual - inv.cantidadMaxima
                });
            } else {
                alertas.stockNormal.push(inv);
            }
        });

        res.json(alertas);
    } catch (error) {
        console.error('Error al obtener alertas de stock:', error);
        res.status(500).json({ error: 'Error al obtener alertas de stock' });
    }
};
