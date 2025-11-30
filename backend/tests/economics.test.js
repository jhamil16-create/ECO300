const {
    calcularElasticidad,
    calcularEquilibrio,
    predecirDemanda,
    generarAlertas,
    calcularMetricasEconomicas
} = require('../utils/economics');

describe('Economic Calculations Tests', () => {
    describe('calcularElasticidad', () => {
        test('should calculate elasticity with valid data', () => {
            const ventas = [
                { precioUnitario: 100, cantidad: 50, fecha: '2024-01-01' },
                { precioUnitario: 90, cantidad: 60, fecha: '2024-01-02' }
            ];

            const resultado = calcularElasticidad(ventas);

            expect(resultado.elasticidad).toBeDefined();
            expect(resultado.interpretacion).toBeDefined();
            expect(typeof resultado.elasticidad).toBe('number');
        });

        test('should return null with insufficient data', () => {
            const ventas = [{ precioUnitario: 100, cantidad: 50, fecha: '2024-01-01' }];

            const resultado = calcularElasticidad(ventas);

            expect(resultado.elasticidad).toBeNull();
            expect(resultado.interpretacion).toBe('Datos insuficientes');
        });

        test('should identify elastic demand', () => {
            // Cambio grande en cantidad vs cambio pequeño en precio = elástico
            const ventas = [
                { precioUnitario: 100, cantidad: 50, fecha: '2024-01-01' },
                { precioUnitario: 95, cantidad: 80, fecha: '2024-01-02' }
            ];

            const resultado = calcularElasticidad(ventas);

            expect(Math.abs(resultado.elasticidad)).toBeGreaterThan(1);
            expect(resultado.interpretacion).toContain('elástica');
        });

        test('should handle zero price change', () => {
            const ventas = [
                { precioUnitario: 100, cantidad: 50, fecha: '2024-01-01' },
                { precioUnitario: 100, cantidad: 60, fecha: '2024-01-02' }
            ];

            const resultado = calcularElasticidad(ventas);

            expect(resultado.elasticidad).toBeNull();
            expect(resultado.interpretacion).toBe('Sin cambio de precio');
        });
    });

    describe('calcularEquilibrio', () => {
        test('should calculate break-even point correctly', () => {
            const costosFijos = 10000;
            const costoVariable = 50;
            const precio = 100;

            const resultado = calcularEquilibrio(costosFijos, costoVariable, precio);

            expect(resultado.unidadesEquilibrio).toBe(200);
            expect(resultado.ingresoEquilibrio).toBe(20000);
            expect(resultado.margenContribucion).toBe(50);
            expect(resultado.viable).toBe(true);
        });

        test('should identify non-viable business', () => {
            const costosFijos = 10000;
            const costoVariable = 100;
            const precio = 90;

            const resultado = calcularEquilibrio(costosFijos, costoVariable, precio);

            expect(resultado.viable).toBe(false);
            expect(resultado.unidadesEquilibrio).toBe(Infinity);
        });

        test('should calculate margin percentage', () => {
            const costosFijos = 5000;
            const costoVariable = 60;
            const precio = 100;

            const resultado = calcularEquilibrio(costosFijos, costoVariable, precio);

            expect(resultado.margenContribucionPorcentaje).toBe(40);
        });

        test('should handle exact break-even price', () => {
            const costosFijos = 1000;
            const costoVariable = 50;
            const precio = 50;

            const resultado = calcularEquilibrio(costosFijos, costoVariable, precio);

            expect(resultado.viable).toBe(false);
        });
    });

    describe('predecirDemanda', () => {
        test('should predict demand with linear regression', () => {
            const ventas = [
                { cantidad: 10, fecha: '2024-01-01' },
                { cantidad: 15, fecha: '2024-01-08' },
                { cantidad: 20, fecha: '2024-01-15' },
                { cantidad: 25, fecha: '2024-01-22' }
            ];

            const resultado = predecirDemanda(ventas, 7);

            expect(resultado.demandaPredicha).toBeDefined();
            expect(resultado.demandaPredicha).toBeGreaterThan(0);
            expect(resultado.tendencia).toBeDefined();
            expect(resultado.confianza).toBeGreaterThanOrEqual(0);
            expect(resultado.confianza).toBeLessThanOrEqual(1);
        });

        test('should identify growing trend', () => {
            const ventas = [
                { cantidad: 10, fecha: '2024-01-01' },
                { cantidad: 20, fecha: '2024-01-08' },
                { cantidad: 30, fecha: '2024-01-15' }
            ];

            const resultado = predecirDemanda(ventas);

            expect(resultado.tendencia).toBe('Creciente');
            expect(resultado.pendiente).toBeGreaterThan(0);
        });

        test('should identify decreasing trend', () => {
            const ventas = [
                { cantidad: 30, fecha: '2024-01-01' },
                { cantidad: 20, fecha: '2024-01-08' },
                { cantidad: 10, fecha: '2024-01-15' }
            ];

            const resultado = predecirDemanda(ventas);

            expect(resultado.tendencia).toBe('Decreciente');
            expect(resultado.pendiente).toBeLessThan(0);
        });

        test('should return null with insufficient data', () => {
            const ventas = [
                { cantidad: 10, fecha: '2024-01-01' },
                { cantidad: 15, fecha: '2024-01-08' }
            ];

            const resultado = predecirDemanda(ventas);

            expect(resultado.demandaPredicha).toBeNull();
            expect(resultado.tendencia).toBe('Datos insuficientes');
        });
    });

    describe('generarAlertas', () => {
        test('should generate low stock alert', () => {
            const inventario = { cantidadActual: 5, cantidadMinima: 10, cantidadMaxima: 100 };
            const producto = { id: 1, nombre: 'Test', precioVenta: 100, costoProduccion: 50 };

            const alertas = generarAlertas(inventario, [], null, producto);

            const escasezAlert = alertas.find(a => a.tipo === 'ESCASEZ');
            expect(escasezAlert).toBeDefined();
            expect(escasezAlert.severidad).toBe('ALTA');
        });

        test('should generate overstock alert', () => {
            const inventario = { cantidadActual: 150, cantidadMinima: 10, cantidadMaxima: 100 };
            const producto = { id: 1, nombre: 'Test', precioVenta: 100, costoProduccion: 50 };

            const alertas = generarAlertas(inventario, [], null, producto);

            const sobreproduccionAlert = alertas.find(a => a.tipo === 'SOBREPRODUCCION');
            expect(sobreproduccionAlert).toBeDefined();
        });

        test('should generate low margin alert', () => {
            const inventario = { cantidadActual: 50, cantidadMinima: 10, cantidadMaxima: 100 };
            const producto = { id: 1, nombre: 'Test', precioVenta: 100, costoProduccion: 95 };

            const alertas = generarAlertas(inventario, [], null, producto);

            const bajoMargenAlert = alertas.find(a => a.tipo === 'BAJO_MARGEN');
            expect(bajoMargenAlert).toBeDefined();
            expect(bajoMargenAlert.severidad).toBe('ALTA');
        });

        test('should generate high demand alert', () => {
            const inventario = { cantidadActual: 20, cantidadMinima: 10, cantidadMaxima: 100 };
            const prediccion = { demandaPredicha: 50 };
            const producto = { id: 1, nombre: 'Test', precioVenta: 100, costoProduccion: 50 };

            const alertas = generarAlertas(inventario, [], prediccion, producto);

            const altaDemandaAlert = alertas.find(a => a.tipo === 'ALTA_DEMANDA');
            expect(altaDemandaAlert).toBeDefined();
        });

        test('should not generate alerts for healthy stock', () => {
            const inventario = { cantidadActual: 50, cantidadMinima: 10, cantidadMaxima: 100 };
            const producto = { id: 1, nombre: 'Test', precioVenta: 100, costoProduccion: 50 };

            const alertas = generarAlertas(inventario, [], null, producto);

            // Solo debería tener alertas de ventas bajas si aplica
            expect(alertas.length).toBeLessThanOrEqual(1);
        });
    });

    describe('calcularMetricasEconomicas', () => {
        test('should calculate economic metrics correctly', () => {
            const ventas = [
                { precioTotal: 1000 },
                { precioTotal: 1500 },
                { precioTotal: 2000 }
            ];

            const costos = [
                { monto: 500 },
                { monto: 700 }
            ];

            const resultado = calcularMetricasEconomicas(ventas, costos);

            expect(resultado.totalIngresos).toBe(4500);
            expect(resultado.totalCostos).toBe(1200);
            expect(resultado.utilidad).toBe(3300);
            expect(resultado.margenUtilidad).toBeCloseTo(73.33, 1);
            expect(resultado.roi).toBeCloseTo(275, 0);
        });

        test('should handle zero sales', () => {
            const ventas = [];
            const costos = [{ monto: 500 }];

            const resultado = calcularMetricasEconomicas(ventas, costos);

            expect(resultado.totalIngresos).toBe(0);
            expect(resultado.totalCostos).toBe(500);
            expect(resultado.utilidad).toBe(-500);
            expect(resultado.margenUtilidad).toBe(0);
        });

        test('should handle zero costs', () => {
            const ventas = [{ precioTotal: 1000 }];
            const costos = [];

            const resultado = calcularMetricasEconomicas(ventas, costos);

            expect(resultado.totalIngresos).toBe(1000);
            expect(resultado.totalCostos).toBe(0);
            expect(resultado.utilidad).toBe(1000);
            expect(resultado.roi).toBe(0);
        });
    });
});
