const prisma = require('../utils/prisma');

// GET /api/ventas - Listar todas las ventas
exports.getVentas = async (req, res) => {
    try {
        const { productoId, fechaDesde, fechaHasta, limite } = req.query;

        const where = {};
        if (productoId) where.productoId = parseInt(productoId);
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
            if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
        }

        const ventas = await prisma.venta.findMany({
            where,
            include: { producto: true },
            orderBy: { fecha: 'desc' },
            take: limite ? parseInt(limite) : undefined
        });

        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
};

// GET /api/ventas/:id - Obtener una venta específica
exports.getVentaById = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await prisma.venta.findUnique({
            where: { id: parseInt(id) },
            include: { producto: true }
        });

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.json(venta);
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ error: 'Error al obtener venta' });
    }
};

// POST /api/ventas - Registrar una nueva venta
exports.createVenta = async (req, res) => {
    try {
        const { productoId, cantidad, precioUnitario, fecha } = req.body;

        // Validaciones
        if (!productoId || !cantidad || !precioUnitario) {
            return res.status(400).json({ error: 'ProductoId, cantidad y precioUnitario son requeridos' });
        }

        if (cantidad <= 0 || precioUnitario <= 0) {
            return res.status(400).json({ error: 'Cantidad y precio deben ser mayores a 0' });
        }

        // Verificar que el producto existe
        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(productoId) }
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const precioTotal = parseFloat(cantidad) * parseFloat(precioUnitario);

        // Crear venta y actualizar inventario
        const venta = await prisma.$transaction(async (tx) => {
            // Crear la venta
            const nuevaVenta = await tx.venta.create({
                data: {
                    productoId: parseInt(productoId),
                    cantidad: parseFloat(cantidad),
                    precioUnitario: parseFloat(precioUnitario),
                    precioTotal,
                    fecha: fecha ? new Date(fecha) : new Date()
                },
                include: { producto: true }
            });

            // Actualizar inventario (reducir stock)
            const inventario = await tx.inventario.findUnique({
                where: { productoId: parseInt(productoId) }
            });

            if (inventario) {
                await tx.inventario.update({
                    where: { productoId: parseInt(productoId) },
                    data: {
                        cantidadActual: Math.max(0, inventario.cantidadActual - parseFloat(cantidad)),
                        movimientos: {
                            create: {
                                tipo: 'SALIDA',
                                cantidad: parseFloat(cantidad),
                                motivo: `Venta registrada - ID: ${nuevaVenta.id}`
                            }
                        }
                    }
                });
            }

            return nuevaVenta;
        });

        res.status(201).json(venta);
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ error: 'Error al crear venta' });
    }
};

// DELETE /api/ventas/:id - Eliminar una venta
exports.deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await prisma.venta.findUnique({
            where: { id: parseInt(id) }
        });

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Eliminar y devolver stock al inventario
        await prisma.$transaction(async (tx) => {
            await tx.venta.delete({
                where: { id: parseInt(id) }
            });

            // Devolver al inventario
            const inventario = await tx.inventario.findUnique({
                where: { productoId: venta.productoId }
            });

            if (inventario) {
                await tx.inventario.update({
                    where: { productoId: venta.productoId },
                    data: {
                        cantidadActual: inventario.cantidadActual + venta.cantidad,
                        movimientos: {
                            create: {
                                tipo: 'ENTRADA',
                                cantidad: venta.cantidad,
                                motivo: `Reversión de venta - ID: ${id}`
                            }
                        }
                    }
                });
            }
        });

        res.json({ message: 'Venta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ error: 'Error al eliminar venta' });
    }
};

// GET /api/ventas/estadisticas/resumen - Obtener estadísticas de ventas
exports.getEstadisticasVentas = async (req, res) => {
    try {
        const { productoId, fechaDesde, fechaHasta } = req.query;

        const where = {};
        if (productoId) where.productoId = parseInt(productoId);
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
            if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
        }

        const ventas = await prisma.venta.findMany({ where });

        const totalVentas = ventas.length;
        const totalIngresos = ventas.reduce((sum, v) => sum + v.precioTotal, 0);
        const totalUnidades = ventas.reduce((sum, v) => sum + v.cantidad, 0);
        const precioPromedio = totalVentas > 0 ? totalIngresos / totalUnidades : 0;

        res.json({
            totalVentas,
            totalIngresos: parseFloat(totalIngresos.toFixed(2)),
            totalUnidades: parseFloat(totalUnidades.toFixed(2)),
            precioPromedio: parseFloat(precioPromedio.toFixed(2))
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
