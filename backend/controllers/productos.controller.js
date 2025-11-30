const prisma = require('../utils/prisma');

// GET /api/productos - Listar todos los productos
exports.getProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            include: {
                inventarios: true,
                _count: {
                    select: { ventas: true, costos: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// GET /api/productos/:id - Obtener un producto específico
exports.getProductoById = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id) },
            include: {
                ventas: { orderBy: { fecha: 'desc' }, take: 10 },
                inventarios: true,
                costos: true,
                predicciones: { orderBy: { fechaPrediccion: 'desc' }, take: 5 }
            }
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Calcular margen
        const margen = ((producto.precioVenta - producto.costoProduccion) / producto.precioVenta) * 100;

        res.json({ ...producto, margen: margen.toFixed(2) });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

// POST /api/productos - Crear un nuevo producto
exports.createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precioVenta, costoProduccion, unidadMedida } = req.body;

        // Validaciones
        if (!nombre || !precioVenta || !costoProduccion) {
            return res.status(400).json({ error: 'Nombre, precio de venta y costo de producción son requeridos' });
        }

        if (precioVenta <= 0 || costoProduccion <= 0) {
            return res.status(400).json({ error: 'Precio y costo deben ser mayores a 0' });
        }

        const producto = await prisma.producto.create({
            data: {
                nombre,
                descripcion,
                precioVenta: parseFloat(precioVenta),
                costoProduccion: parseFloat(costoProduccion),
                unidadMedida: unidadMedida || 'unidad',
                // Crear inventario inicial automáticamente
                inventarios: {
                    create: {
                        cantidadActual: 0,
                        cantidadMinima: 10,
                        cantidadMaxima: 1000
                    }
                }
            },
            include: { inventarios: true }
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// PUT /api/productos/:id - Actualizar un producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precioVenta, costoProduccion, unidadMedida } = req.body;

        // Validar que el producto existe
        const productoExistente = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });

        if (!productoExistente) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const producto = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: {
                ...(nombre && { nombre }),
                ...(descripcion !== undefined && { descripcion }),
                ...(precioVenta && { precioVenta: parseFloat(precioVenta) }),
                ...(costoProduccion && { costoProduccion: parseFloat(costoProduccion) }),
                ...(unidadMedida && { unidadMedida })
            },
            include: { inventarios: true }
        });

        res.json(producto);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// DELETE /api/productos/:id - Eliminar un producto
exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.producto.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
