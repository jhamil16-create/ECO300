// Complete database setup: Create tables + Seed data
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function setupDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('🔧 Iniciando setup completo de base de datos...\n');

        // DROP existing tables (in correct order due to foreign keys)
        console.log('🗑️ Eliminando tablas existentes...');
        await client.query('DROP TABLE IF EXISTS "MovimientoInventario" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Prediccion" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Venta" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Costo" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Inventario" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Alerta" CASCADE');
        await client.query('DROP TABLE IF EXISTS "FactorExterno" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Producto" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Empleado" CASCADE');
        console.log('✓ Tablas eliminadas\n');

        // CREATE all tables from schema
        console.log('📋 Creando tablas...');

        // Usuarios (already exists, keep it)
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Usuario" (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);

        // Empleados
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Empleado" (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                sexo VARCHAR(10),
                cargo VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);

        // Productos
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Producto" (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT,
                "precioVenta" FLOAT NOT NULL,
                "costoProduccion" FLOAT NOT NULL,
                "unidadMedida" VARCHAR(50) DEFAULT 'unidad',
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
            )
        `);

        // Ventas
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Venta" (
                id SERIAL PRIMARY KEY,
                "productoId" INTEGER NOT NULL REFERENCES "Producto"(id) ON DELETE CASCADE,
                cantidad FLOAT NOT NULL,
                "precioUnitario" FLOAT NOT NULL,
                "precioTotal" FLOAT NOT NULL,
                fecha TIMESTAMP DEFAULT NOW(),
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_venta_producto ON "Venta"("productoId")');
        await client.query('CREATE INDEX IF NOT EXISTS idx_venta_fecha ON "Venta"(fecha)');

        // Costos
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Costo" (
                id SERIAL PRIMARY KEY,
                "productoId" INTEGER REFERENCES "Producto"(id) ON DELETE SET NULL,
                tipo VARCHAR(50) NOT NULL,
                concepto VARCHAR(255) NOT NULL,
                monto FLOAT NOT NULL,
                periodo VARCHAR(50) DEFAULT 'mensual',
                fecha TIMESTAMP DEFAULT NOW(),
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_costo_producto ON "Costo"("productoId")');
        await client.query('CREATE INDEX IF NOT EXISTS idx_costo_tipo ON "Costo"(tipo)');

        // Inventario
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Inventario" (
                id SERIAL PRIMARY KEY,
                "productoId" INTEGER NOT NULL UNIQUE REFERENCES "Producto"(id) ON DELETE CASCADE,
                "cantidadActual" FLOAT NOT NULL,
                "cantidadMinima" FLOAT DEFAULT 10,
                "cantidadMaxima" FLOAT DEFAULT 1000,
                ubicacion VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
            )
        `);

        // Movimiento Inventario
        await client.query(`
            CREATE TABLE IF NOT EXISTS "MovimientoInventario" (
                id SERIAL PRIMARY KEY,
                "inventarioId" INTEGER NOT NULL REFERENCES "Inventario"(id) ON DELETE CASCADE,
                tipo VARCHAR(50) NOT NULL,
                cantidad FLOAT NOT NULL,
                motivo VARCHAR(255),
                fecha TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_movimiento_inventario ON "MovimientoInventario"("inventarioId")');
        await client.query('CREATE INDEX IF NOT EXISTS idx_movimiento_fecha ON "MovimientoInventario"(fecha)');

        // Predicciones
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Prediccion" (
                id SERIAL PRIMARY KEY,
                "productoId" INTEGER NOT NULL REFERENCES "Producto"(id) ON DELETE CASCADE,
                "demandaPredicha" FLOAT NOT NULL,
                periodo VARCHAR(50) NOT NULL,
                "fechaPrediccion" TIMESTAMP NOT NULL,
                confianza FLOAT DEFAULT 0.7,
                metodo VARCHAR(100) DEFAULT 'regresion_lineal',
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_prediccion_producto ON "Prediccion"("productoId")');
        await client.query('CREATE INDEX IF NOT EXISTS idx_prediccion_fecha ON "Prediccion"("fechaPrediccion")');

        // Alertas
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Alerta" (
                id SERIAL PRIMARY KEY,
                tipo VARCHAR(100) NOT NULL,
                severidad VARCHAR(50) DEFAULT 'MEDIA',
                titulo VARCHAR(255) NOT NULL,
                mensaje TEXT NOT NULL,
                "productoId" INTEGER,
                leida BOOLEAN DEFAULT false,
                fecha TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_alerta_tipo ON "Alerta"(tipo)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_alerta_leida ON "Alerta"(leida)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_alerta_fecha ON "Alerta"(fecha)');

        // Factores Externos
        await client.query(`
            CREATE TABLE IF NOT EXISTS "FactorExterno" (
                id SERIAL PRIMARY KEY,
                tipo VARCHAR(100) NOT NULL,
                valor FLOAT NOT NULL,
                descripcion TEXT,
                fecha TIMESTAMP DEFAULT NOW(),
                fuente VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        await client.query('CREATE INDEX IF NOT EXISTS idx_factor_tipo ON "FactorExterno"(tipo)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_factor_fecha ON "FactorExterno"(fecha)');

        console.log('✓ Todas las tablas creadas\n');

        // Now seed the data
        console.log('🌱 Poblando base de datos con datos de demo...\n');

        // PRODUCTOS
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
        console.log(`✓ ${productosCreados.length} productos creados`);

        // VENTAS (últimos 3 meses)
        console.log('💰 Generando ventas históricas...');
        let totalVentas = 0;
        const hoy = new Date();

        for (const producto of productosCreados) {
            const numVentas = Math.floor(Math.random() * 15) + 10;

            for (let i = 0; i < numVentas; i++) {
                const diasAtras = Math.floor(Math.random() * 90);
                const fechaVenta = new Date(hoy);
                fechaVenta.setDate(fechaVenta.getDate() - diasAtras);

                const cantidad = producto.precioVenta < 10
                    ? Math.floor(Math.random() * 20) + 5
                    : Math.floor(Math.random() * 3) + 1;

                const precioTotal = cantidad * producto.precioVenta;

                await client.query(
                    `INSERT INTO "Venta" ("productoId", cantidad, "precioUnitario", "precioTotal", fecha, "createdAt")
                     VALUES ($1, $2, $3, $4, $5, NOW())`,
                    [producto.id, cantidad, producto.precioVenta, precioTotal, fechaVenta]
                );
                totalVentas++;
            }
        }
        console.log(`✓ ${totalVentas} ventas creadas`);

        // COSTOS
        console.log('💵 Creando costos...');
        const costosFijos = [
            { concepto: 'Alquiler de local', monto: 1200 },
            { concepto: 'Servicios básicos', monto: 350 },
            { concepto: 'Internet', monto: 150 },
        ];

        for (const costo of costosFijos) {
            await client.query(
                `INSERT INTO "Costo" (tipo, concepto, monto, periodo, fecha, "createdAt")
                 VALUES ('FIJO', $1, $2, 'mensual', NOW(), NOW())`,
                [costo.concepto, costo.monto]
            );
        }

        for (const producto of productosCreados) {
            await client.query(
                `INSERT INTO "Costo" ("productoId", tipo, concepto, monto, periodo, fecha, "createdAt")
                 VALUES ($1, 'VARIABLE', $2, $3, 'mensual', NOW(), NOW())`,
                [producto.id, `Materia prima - ${producto.nombre}`, producto.costoProduccion * 0.7]
            );
        }
        console.log('✓ Costos creados');

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
        console.log('✓ Inventarios inicializados');

        // ALERTAS  
        console.log('🔔 Creando alertas...');
        await client.query(
            `INSERT INTO "Alerta" (tipo, severidad, titulo, mensaje, leida, fecha)
             VALUES 
             ('ESCASEZ', 'ALTA', 'Stock Bajo', 'Algunos productos están por debajo del mínimo', false, NOW()),
             ('BAJO_MARGEN', 'MEDIA', 'Margen Reducido', 'Revisar márgenes de ganancia', false, NOW()),
             ('ALTA_DEMANDA', 'BAJA', 'Demanda Creciente', 'Las ventas han aumentado', false, NOW())`
        );
        console.log('✓ Alertas creadas');

        // FACTORES EXTERNOS
        console.log('🌍 Factores externos...');
        await client.query(
            `INSERT INTO "FactorExterno" (tipo, valor, descripcion, fuente, fecha, "createdAt")
             VALUES 
             ('INFLACION', 3.2, 'Tasa de inflación anual en Bolivia', 'INE Bolivia', NOW(), NOW()),
             ('ESTACIONALIDAD', 1.15, 'Factor estacional - temporada alta', 'Análisis interno', NOW(), NOW()),
             ('COMPETENCIA', 0.85, 'Índice de competencia en el sector', 'Estudio de mercado', NOW(), NOW())`
        );
        console.log('✓ Factores externos registrados\n');

        console.log('✅ ¡Setup completado exitosamente!\n');
        console.log('📊 Base de datos lista con:');
        console.log(`   - ${productosCreados.length} productos`);
        console.log(`   - ${totalVentas} ventas`);
        console.log(`   - ${costosFijos.length + productosCreados.length} costos`);
        console.log(`   - ${productosCreados.length} inventarios`);
        console.log('   - 3 alertas');
        console.log('   - 3 factores externos');
        console.log('\n🔑 Login: admin@test.com / 123456');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await client.end();
    }
}

setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
