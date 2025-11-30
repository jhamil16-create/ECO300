// Complete database seeding script using pg directly
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function seedDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('🌱 Iniciando seed de base de datos...\n');

        // Limpiar datos existentes (excepto Usuario que ya tiene admin)
        console.log('🗑️ Limpiando datos existentes...');
        await client.query('DELETE FROM "Alerta"');
        await client.query('DELETE FROM "FactorExterno"');
        await client.query('DELETE FROM "Prediccion"');
        await client.query('DELETE FROM "MovimientoInventario"');
        await client.query('DELETE FROM "Inventario"');
        await client.query('DELETE FROM "Costo"');
        await client.query('DELETE FROM "Venta"');
        await client.query('DELETE FROM "Producto"');
        console.log('✓ Datos limpiados\n');

        // PRODUCTOS - Panadería Demo
        console.log('📦 Creando productos de Panadería Demo...');
        const productos = [
            { nombre: 'Marraqueta', descripcion: 'Pan tradicional boliviano', precioVenta: 0.50, costoProduccion: 0.25 },
            { nombre: 'Pan Integral', descripcion: 'Pan integral con semillas', precioVenta: 1.5, costoProduccion: 0.8 },
            { nombre: 'Cuñapé', descripcion: 'Pan de queso tradicional', precioVenta: 2, costoProduccion: 1.2 },
            { nombre: 'Torta de Chocolate', descripcion: 'Torta de chocolate casera', precioVenta: 85, costoProduccion: 45 },
            { nombre: 'Pan de Ajo', descripcion: 'Pan especial con mantequilla de ajo', precioVenta: 3.5, costoProduccion: 1.8 },
            { nombre: 'Salteña de Pollo', descripcion: 'Salteña boliviana relleno de pollo', precioVenta: 8, costoProduccion: 4.5 },
        ];

        const productosCreados = [];
        for (const p of productos) {
            const result = await client.query(
                `INSERT INTO "Producto" (nombre, descripcion, "precioVenta", "costoProduccion", "unidadMedida", "createdAt", "updatedAt")
                 VALUES ($1, $2, $3, $4, 'unidad', NOW(), NOW())
                 RETURNING id, nombre, "precioVenta", "costoProduccion"`,
                [p.nombre, p.descripcion, p.precioVenta, p.costoProduccion]
            );
            productosCreados.push(result.rows[0]);
        }
        console.log(`✓ ${productosCreados.length} productos creados\n`);

        // VENTAS (últimos 3 meses)
        console.log('💰 Generando ventas históricas...');
        const ventas = [];
        const hoy = new Date();

        for (const producto of productosCreados) {
            const numVentas = Math.floor(Math.random() * 15) + 10; // 10-25 ventas por producto

            for (let i = 0; i < numVentas; i++) {
                const diasAtras = Math.floor(Math.random() * 90);
                const fechaVenta = new Date(hoy);
                fechaVenta.setDate(fechaVenta.getDate() - diasAtras);

                const cantidad = producto.precioVenta < 10
                    ? Math.floor(Math.random() * 20) + 5  // 5-25 unidades para productos baratos
                    : Math.floor(Math.random() * 3) + 1;   // 1-4 unidades para productos caros

                const precioTotal = cantidad * producto.precioVenta;

                await client.query(
                    `INSERT INTO "Venta" ("productoId", cantidad, "precioUnitario", "precioTotal", fecha, "createdAt")
                     VALUES ($1, $2, $3, $4, $5, NOW())`,
                    [producto.id, cantidad, producto.precioVenta, precioTotal, fechaVenta]
                );
                ventas.push({ producto: producto.nombre, cantidad, total: precioTotal });
            }
        }
        console.log(`✓ ${ventas.length} ventas creadas\n`);

        // COSTOS
        console.log('💵 Creando costos operativos...');
        const costosFijos = [
            { concepto: 'Alquiler de local', monto: 1200 },
            { concepto: 'Servicios básicos (luz, agua, gas)', monto: 350 },
            { concepto: 'Internet', monto: 150 },
            { concepto: 'Seguros', monto: 200 },
        ];

        for (const costo of costosFijos) {
            await client.query(
                `INSERT INTO "Costo" (tipo, concepto, monto, periodo, fecha, "createdAt")
                 VALUES ('FIJO', $1, $2, 'mensual', NOW(), NOW())`,
                [costo.concepto, costo.monto]
            );
        }

        // Costos variables por producto
        for (const producto of productosCreados) {
            await client.query(
                `INSERT INTO "Costo" ("productoId", tipo, concepto, monto, periodo, fecha, "createdAt")
                 VALUES ($1, 'VARIABLE', $2, $3, 'mensual', NOW(), NOW())`,
                [producto.id, `Materia prima - ${producto.nombre}`, producto.costoProduccion * 0.7]
            );
        }
        console.log(`✓ Costos operativos creados\n`);

        // INVENTARIO
        console.log('📊 Inicializando inventarios...');
        for (const producto of productosCreados) {
            const cantidadActual = producto.precioVenta < 10
                ? Math.floor(Math.random() * 100) + 50
                : Math.floor(Math.random() * 20) + 10;

            const min = producto.precioVenta < 10 ? 20 : 5;
            const max = producto.precioVenta < 10 ? 200 : 50;

            await client.query(
                `INSERT INTO "Inventario" ("productoId", "cantidadActual", "cantidadMinima", "cantidadMaxima", ubicacion, "createdAt", "updatedAt")
                 VALUES ($1, $2, $3, $4, 'Almacén Principal', NOW(), NOW())`,
                [producto.id, cantidadActual, min, max]
            );
        }
        console.log(`✓ Inventarios inicializados\n`);

        // ALERTAS
        console.log('🔔 Creando alertas del sistema...');
        const alertas = [
            {
                tipo: 'ESCASEZ',
                severidad: 'ALTA',
                titulo: 'Stock Bajo - Pan Integral',
                mensaje: 'El inventario de Pan Integral está por debajo del mínimo recomendado'
            },
            {
                tipo: 'BAJO_MARGEN',
                severidad: 'MEDIA',
                titulo: 'Margen Reducido',
                mensaje: 'El margen de ganancia en algunos productos es menor al 40%'
            },
            {
                tipo: 'ALTA_DEMANDA',
                severidad: 'BAJA',
                titulo: 'Demanda Creciente - Salteñas',
                mensaje: 'Las ventas de salteñas han aumentado 18% en las últimas 2 semanas'
            }
        ];

        for (const alerta of alertas) {
            await client.query(
                `INSERT INTO "Alerta" (tipo, severidad, titulo, mensaje, leida, fecha)
                 VALUES ($1, $2, $3, $4, false, NOW())`,
                [alerta.tipo, alerta.severidad, alerta.titulo, alerta.mensaje]
            );
        }
        console.log(`✓ ${alertas.length} alertas creadas\n`);

        // FACTORES EXTERNOS
        console.log('🌍 Registrando factores externos...');
        const factoresExternos = [
            { tipo: 'INFLACION', valor: 3.2, descripcion: 'Tasa de inflación anual en Bolivia', fuente: 'INE Bolivia' },
            { tipo: 'ESTACIONALIDAD', valor: 1.15, descripcion: 'Factor estacional - temporada alta', fuente: 'Análisis interno' },
            { tipo: 'COMPETENCIA', valor: 0.85, descripcion: 'Índice de competencia en el sector', fuente: 'Estudio de mercado' },
            { tipo: 'CLIMA', valor: 1.0, descripcion: 'Condiciones climáticas normales', fuente: 'SENAMHI' }
        ];

        for (const factor of factoresExternos) {
            await client.query(
                `INSERT INTO "FactorExterno" (tipo, valor, descripcion, fuente, fecha, "createdAt")
                 VALUES ($1, $2, $3, $4, NOW(), NOW())`,
                [factor.tipo, factor.valor, factor.descripcion, factor.fuente]
            );
        }
        console.log(`✓ ${factoresExternos.length} factores externos registrados\n`);

        console.log('✅ ¡Seed completado exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - ${productosCreados.length} productos`);
        console.log(`   - ${ventas.length} ventas`);
        console.log(`   - ${costosFijos.length + productosCreados.length} costos`);
        console.log(`   - ${productosCreados.length} inventarios`);
        console.log(`   - ${alertas.length} alertas`);
        console.log(`   - ${factoresExternos.length} factores externos`);
        console.log('\n🔑 Credenciales de acceso:');
        console.log('   - admin@test.com / 123456');

    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    } finally {
        await client.end();
    }
}

seedDatabase()
    .then(() => {
        console.log('\n✅ Base de datos lista para usar!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seed falló:', error.message);
        process.exit(1);
    });
