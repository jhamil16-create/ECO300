const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Configurar app de prueba
const app = express();
app.use(express.json());

const productosRoutes = require('../routes/productos.routes');
const ventasRoutes = require('../routes/ventas.routes');
const inventarioRoutes = require('../routes/inventario.routes');
const analisisRoutes = require('../routes/analisis.routes');

app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/analisis', analisisRoutes);

const prisma = new PrismaClient();

describe('API Endpoints Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Productos API', () => {
        let testProductoId;

        test('POST /api/productos - should create producto', async () => {
            const response = await request(app)
                .post('/api/productos')
                .send({
                    nombre: 'API Test Producto',
                    descripcion: 'Testing API',
                    precioVenta: 150,
                    costoProduccion: 75,
                    unidadMedida: 'kg'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nombre).toBe('API Test Producto');
            expect(response.body.inventarios).toBeDefined();

            testProductoId = response.body.id;
        });

        test('GET /api/productos - should list productos', async () => {
            const response = await request(app).get('/api/productos');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        test('GET /api/productos/:id - should get specific producto', async () => {
            const response = await request(app).get(`/api/productos/${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testProductoId);
            expect(response.body.margen).toBeDefined();
        });

        test('PUT /api/productos/:id - should update producto', async () => {
            const response = await request(app)
                .put(`/api/productos/${testProductoId}`)
                .send({ precioVenta: 180 });

            expect(response.status).toBe(200);
            expect(response.body.precioVenta).toBe(180);
        });

        test('POST /api/productos - should validate required fields', async () => {
            const response = await request(app)
                .post('/api/productos')
                .send({ nombre: 'Incomplete' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('DELETE /api/productos/:id - should delete producto', async () => {
            const response = await request(app).delete(`/api/productos/${testProductoId}`);

            expect(response.status).toBe(200);

            const checkDeleted = await request(app).get(`/api/productos/${testProductoId}`);
            expect(checkDeleted.status).toBe(404);
        });
    });

    describe('Ventas API', () => {
        let testProductoId;
        let testVentaId;

        beforeAll(async () => {
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Producto para Ventas API',
                    precioVenta: 100,
                    costoProduccion: 50,
                    inventarios: {
                        create: { cantidadActual: 100, cantidadMinima: 10, cantidadMaxima: 200 }
                    }
                }
            });
            testProductoId = producto.id;
        });

        afterAll(async () => {
            await prisma.producto.delete({ where: { id: testProductoId } });
        });

        test('POST /api/ventas - should create venta', async () => {
            const response = await request(app)
                .post('/api/ventas')
                .send({
                    productoId: testProductoId,
                    cantidad: 10,
                    precioUnitario: 100
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.precioTotal).toBe(1000);

            testVentaId = response.body.id;
        });

        test('GET /api/ventas - should list ventas', async () => {
            const response = await request(app).get('/api/ventas');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('GET /api/ventas - should filter by productoId', async () => {
            const response = await request(app)
                .get(`/api/ventas?productoId=${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body.every(v => v.productoId === testProductoId)).toBe(true);
        });

        test('GET /api/ventas/estadisticas/resumen - should get statistics', async () => {
            const response = await request(app)
                .get(`/api/ventas/estadisticas/resumen?productoId=${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('totalVentas');
            expect(response.body).toHaveProperty('totalIngresos');
        });

        test('DELETE /api/ventas/:id - should delete venta', async () => {
            const response = await request(app).delete(`/api/ventas/${testVentaId}`);

            expect(response.status).toBe(200);
        });
    });

    describe('Inventario API', () => {
        let testProductoId;
        let testInventarioId;

        beforeAll(async () => {
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Producto Inventario API',
                    precioVenta: 80,
                    costoProduccion: 40,
                    inventarios: {
                        create: { cantidadActual: 60, cantidadMinima: 20, cantidadMaxima: 150 }
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

        test('GET /api/inventario - should list all inventario', async () => {
            const response = await request(app).get('/api/inventario');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('GET /api/inventario/:id - should get inventario by producto', async () => {
            const response = await request(app).get(`/api/inventario/${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body.productoId).toBe(testProductoId);
        });

        test('POST /api/inventario/:id/movimiento - should register ENTRADA', async () => {
            const response = await request(app)
                .post(`/api/inventario/${testInventarioId}/movimiento`)
                .send({
                    tipo: 'ENTRADA',
                    cantidad: 20,
                    motivo: 'Reposición API test'
                });

            expect(response.status).toBe(200);
            expect(response.body.cantidadActual).toBeGreaterThan(60);
        });

        test('POST /api/inventario/:id/movimiento - should register SALIDA', async () => {
            const currentState = await prisma.inventario.findUnique({ where: { id: testInventarioId } });

            const response = await request(app)
                .post(`/api/inventario/${testInventarioId}/movimiento`)
                .send({
                    tipo: 'SALIDA',
                    cantidad: 10,
                    motivo: 'Venta API test'
                });

            expect(response.status).toBe(200);
            expect(response.body.cantidadActual).toBeLessThan(currentState.cantidadActual);
        });

        test('GET /api/inventario/alertas/stock - should get stock alerts', async () => {
            const response = await request(app).get('/api/inventario/alertas/stock');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('stockBajo');
            expect(response.body).toHaveProperty('stockExcesivo');
            expect(response.body).toHaveProperty('stockNormal');
        });
    });

    describe('Analisis API', () => {
        let testProductoId;

        beforeAll(async () => {
            // Crear producto con ventas históricas
            const producto = await prisma.producto.create({
                data: {
                    nombre: 'Producto Análisis API',
                    precioVenta: 120,
                    costoProduccion: 60,
                    inventarios: {
                        create: { cantidadActual: 40, cantidadMinima: 10, cantidadMaxima: 100 }
                    },
                    ventas: {
                        createMany: {
                            data: [
                                { cantidad: 20, precioUnitario: 100, precioTotal: 2000, fecha: new Date('2024-01-01') },
                                { cantidad: 25, precioUnitario: 110, precioTotal: 2750, fecha: new Date('2024-01-08') },
                                { cantidad: 30, precioUnitario: 120, precioTotal: 3600, fecha: new Date('2024-01-15') }
                            ]
                        }
                    }
                }
            });
            testProductoId = producto.id;

            // Crear costos fijos
            await prisma.costo.create({
                data: {
                    productoId: testProductoId,
                    tipo: 'FIJO',
                    concepto: 'Alquiler',
                    monto: 5000
                }
            });
        });

        afterAll(async () => {
            await prisma.producto.delete({ where: { id: testProductoId } });
        });

        test('GET /api/analisis/elasticidad/:productoId - should calculate elasticity', async () => {
            const response = await request(app)
                .get(`/api/analisis/elasticidad/${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('elasticidad');
            expect(response.body).toHaveProperty('interpretacion');
        });

        test('GET /api/analisis/equilibrio/:productoId - should calculate break-even', async () => {
            const response = await request(app)
                .get(`/api/analisis/equilibrio/${testProductoId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('unidadesEquilibrio');
            expect(response.body).toHaveProperty('ingresoEquilibrio');
            expect(response.body).toHaveProperty('viable');
            expect(response.body.viable).toBe(true);
        });

        test('GET /api/analisis/prediccion/:productoId - should predict demand', async () => {
            const response = await request(app)
                .get(`/api/analisis/prediccion/${testProductoId}?dias=30`);

            expect(response.status).toBe(200);
            expect(response.body.prediccion).toHaveProperty('demandaPredicha');
            expect(response.body.prediccion).toHaveProperty('tendencia');
            expect(response.body.prediccion).toHaveProperty('confianza');
        });

        test('POST /api/analisis/alertas/generar - should generate automatic alerts', async () => {
            const response = await request(app)
                .post('/api/analisis/alertas/generar');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('alertas');
            expect(Array.isArray(response.body.alertas)).toBe(true);
        });

        test('GET /api/analisis/alertas - should list alerts', async () => {
            const response = await request(app).get('/api/analisis/alertas');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('GET /api/analisis/metricas - should get economic metrics', async () => {
            const response = await request(app).get('/api/analisis/metricas');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('totalIngresos');
            expect(response.body).toHaveProperty('utilidad');
            expect(response.body).toHaveProperty('margenUtilidad');
            expect(response.body).toHaveProperty('roi');
        });

        test('GET /api/analisis/dashboard - should get complete dashboard', async () => {
            const response = await request(app).get('/api/analisis/dashboard');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('resumen');
            expect(response.body).toHaveProperty('metricas');
            expect(response.body).toHaveProperty('topProductos');
        });
    });
});
