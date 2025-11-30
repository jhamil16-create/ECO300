const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Database Connection Tests', () => {
    beforeAll(async () => {
        // Conectar antes de todos los tests
        await prisma.$connect();
    });

    afterAll(async () => {
        // Desconectar después de todos los tests
        await prisma.$disconnect();
    });

    test('should connect to PostgreSQL successfully', async () => {
        const result = await prisma.$queryRaw`SELECT 1 as connected`;
        expect(result).toBeDefined();
        expect(result[0].connected).toBe(1);
    });

    test('should verify Prisma models are accessible', () => {
        expect(prisma.producto).toBeDefined();
        expect(prisma.venta).toBeDefined();
        expect(prisma.inventario).toBeDefined();
        expect(prisma.prediccion).toBeDefined();
        expect(prisma.alerta).toBeDefined();
        expect(prisma.costo).toBeDefined();
        expect(prisma.factoExterno).toBeDefined();
        expect(prisma.usuario).toBeDefined();
        expect(prisma.empleado).toBeDefined();
    });

    describe('CRUD Operations - Producto', () => {
        let testProductoId;

        test('should create a new producto', async () => {
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Test Producto',
                    descripcion: 'Producto de prueba',
                    precioVenta: 100.00,
                    costoProduccion: 50.00,
                    unidadMedida: 'unidad'
                }
            });

            expect(producto).toBeDefined();
            expect(producto.id).toBeDefined();
            expect(producto.nombre).toBe('Test Producto');
            expect(producto.precioVenta).toBe(100.00);
            expect(producto.costoProduccion).toBe(50.00);

            testProductoId = producto.id;
        });

        test('should read the created producto', async () => {
            const producto = await prisma.producto.findUnique({
                where: { id: testProductoId }
            });

            expect(producto).toBeDefined();
            expect(producto.nombre).toBe('Test Producto');
        });

        test('should update the producto', async () => {
            const updated = await prisma.producto.update({
                where: { id: testProductoId },
                data: { precioVenta: 120.00 }
            });

            expect(updated.precioVenta).toBe(120.00);
        });

        test('should delete the producto', async () => {
            await prisma.producto.delete({
                where: { id: testProductoId }
            });

            const deleted = await prisma.producto.findUnique({
                where: { id: testProductoId }
            });

            expect(deleted).toBeNull();
        });
    });

    describe('CRUD Operations - Venta', () => {
        let testProductoId;
        let testVentaId;

        beforeAll(async () => {
            // Crear producto de prueba
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Producto para Venta Test',
                    precioVenta: 80.00,
                    costoProduccion: 40.00,
                    inventarios: {
                        create: {
                            cantidadActual: 100,
                            cantidadMinima: 10,
                            cantidadMaxima: 200
                        }
                    }
                }
            });
            testProductoId = producto.id;
        });

        afterAll(async () => {
            // Limpiar
            await prisma.producto.delete({ where: { id: testProductoId } });
        });

        test('should create a venta', async () => {
            const venta = await prisma.venta.create({
                data: {
                    productoId: testProductoId,
                    cantidad: 5,
                    precioUnitario: 80.00,
                    precioTotal: 400.00
                }
            });

            expect(venta).toBeDefined();
            expect(venta.cantidad).toBe(5);
            expect(venta.precioTotal).toBe(400.00);

            testVentaId = venta.id;
        });

        test('should read ventas by producto', async () => {
            const ventas = await prisma.venta.findMany({
                where: { productoId: testProductoId }
            });

            expect(ventas.length).toBeGreaterThan(0);
        });

        test('should delete venta', async () => {
            await prisma.venta.delete({ where: { id: testVentaId } });

            const deleted = await prisma.venta.findUnique({
                where: { id: testVentaId }
            });

            expect(deleted).toBeNull();
        });
    });

    describe('Inventario Operations', () => {
        let testProductoId;
        let testInventarioId;

        beforeAll(async () => {
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Producto Inventario Test',
                    precioVenta: 60.00,
                    costoProduccion: 30.00,
                    inventarios: {
                        create: {
                            cantidadActual: 50,
                            cantidadMinima: 15,
                            cantidadMaxima: 150
                        }
                    }
                },
                include: { inventarios: true }
            });

            testProductoId = producto.id;
            testInventarioId = producto.inventarios[0].id;
        });

        afterAll(async () => {
            await prisma.producto.delete({ where: { id: testProductoId } });
        });

        test('should update inventario quantity', async () => {
            const updated = await prisma.inventario.update({
                where: { id: testInventarioId },
                data: { cantidadActual: 75 }
            });

            expect(updated.cantidadActual).toBe(75);
        });

        test('should create movimento inventario', async () => {
            const movimiento = await prisma.movimientoInventario.create({
                data: {
                    inventarioId: testInventarioId,
                    tipo: 'ENTRADA',
                    cantidad: 25,
                    motivo: 'Reposición de stock test'
                }
            });

            expect(movimiento).toBeDefined();
            expect(movimiento.tipo).toBe('ENTRADA');
            expect(movimiento.cantidad).toBe(25);
        });

        test('should retrieve movimientos', async () => {
            const movimientos = await prisma.movimientoInventario.findMany({
                where: { inventarioId: testInventarioId }
            });

            expect(movimientos.length).toBeGreaterThan(0);
        });
    });
});
