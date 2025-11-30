const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // Limpiar datos existentes
    console.log('🗑️  Limpiando datos existentes...');
    await prisma.alerta.deleteMany();
    await prisma.factorExterno.deleteMany();
    await prisma.prediccion.deleteMany();
    await prisma.movimientoInventario.deleteMany();
    await prisma.inventario.deleteMany();
    await prisma.costo.deleteMany();
    await prisma.venta.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.empleado.deleteMany();
    await prisma.usuario.deleteMany();
    console.log('✓ Datos limpiados\n');

    // Hash de contraseñas
    const adminPasswordHash = await bcrypt.hash('123456', 10);
    const demoPasswordHash = await bcrypt.hash('demo123', 10);

    // ===== USUARIOS =====
    console.log('👥 Creando usuarios...');
    const usuarios = await Promise.all([
        // Usuario administrador para demo
        prisma.usuario.create({
            data: {
                username: 'admin@test.com',
                password: adminPasswordHash,
            },
        }),
        prisma.usuario.create({
            data: {
                username: 'maria_textiles',
                password: demoPasswordHash,
            },
        }),
        prisma.usuario.create({
            data: {
                username: 'juan_alimentos',
                password: demoPasswordHash,
            },
        }),
        prisma.usuario.create({
            data: {
                username: 'ana_artesanias',
                password: demoPasswordHash,
            },
        }),
        prisma.usuario.create({
            data: {
                username: 'carlos_panaderia',
                password: demoPasswordHash,
            },
        }),
    ]);
    console.log(`✓ ${usuarios.length} usuarios creados\n`);

    // ===== EMPLEADOS =====
    console.log('👨‍💼 Creando empleados...');
    const empleados = await Promise.all([
        prisma.empleado.create({
            data: { nombre: 'Pedro Mamani', sexo: 'M', cargo: 'Operario Textil' },
        }),
        prisma.empleado.create({
            data: { nombre: 'Rosa Quispe', sexo: 'F', cargo: 'Costurera' },
        }),
        prisma.empleado.create({
            data: { nombre: 'Luis Condori', sexo: 'M', cargo: 'Panadero' },
        }),
        prisma.empleado.create({
            data: { nombre: 'Carmen Flores', sexo: 'F', cargo: 'Vendedora' },
        }),
    ]);
    console.log(`✓ ${empleados.length} empleados creados\n`);

    // ===== PRODUCTOS - María (Textiles) =====
    console.log('📦 Creando productos para María (Textiles)...');
    const productosTextiles = await Promise.all([
        prisma.producto.create({
            data: {
                nombre: 'Aguayo Tradicional',
                descripcion: 'Aguayo andino tejido a mano, multicolor',
                precioVenta: 150,
                costoProduccion: 80,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Poncho de Alpaca',
                descripcion: 'Poncho tejido en lana de alpaca 100%',
                precioVenta: 420,
                costoProduccion: 220,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Chullos Andinos',
                descripcion: 'Gorro andino con orejeras',
                precioVenta: 65,
                costoProduccion: 35,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Faja Tradicional',
                descripcion: 'Faja tejida con diseños típicos',
                precioVenta: 95,
                costoProduccion: 50,
                unidadMedida: 'unidad',
            },
        }),
    ]);
    console.log(`✓ ${productosTextiles.length} productos textiles creados`);

    // ===== PRODUCTOS - Juan (Alimentos) =====
    console.log('📦 Creando productos para Juan (Alimentos)...');
    const productosAlimentos = await Promise.all([
        prisma.producto.create({
            data: {
                nombre: 'Salteñas de Pollo',
                descripcion: 'Salteñas bolivianas relleno de pollo',
                precioVenta: 8,
                costoProduccion: 4.5,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Salteñas de Carne',
                descripcion: 'Salteñas bolivianas relleno de carne',
                precioVenta: 8,
                costoProduccion: 5,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Empanadas de Queso',
                descripcion: 'Empanadas fritas rellenas de queso',
                precioVenta: 5,
                costoProduccion: 2.5,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Api con Pastel',
                descripcion: 'Bebida de maíz morado con pastel',
                precioVenta: 10,
                costoProduccion: 5.5,
                unidadMedida: 'porción',
            },
        }),
    ]);
    console.log(`✓ ${productosAlimentos.length} productos alimenticios creados`);

    // ===== PRODUCTOS - Ana (Artesanías) =====
    console.log('📦 Creando productos para Ana (Artesanías)...');
    const productosArtesanias = await Promise.all([
        prisma.producto.create({
            data: {
                nombre: 'Cerámica Decorativa',
                descripcion: 'Piezas de cerámica pintadas a mano',
                precioVenta: 85,
                costoProduccion: 40,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Collares Artesanales',
                descripcion: 'Collares con semillas y piedras naturales',
                precioVenta: 45,
                costoProduccion: 20,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Figuras de Arcilla',
                descripcion: 'Figuras decorativas de arcilla',
                precioVenta: 35,
                costoProduccion: 15,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Canastos de Totora',
                descripcion: 'Canastos tejidos en fibra de totora',
                precioVenta: 120,
                costoProduccion: 60,
                unidadMedida: 'unidad',
            },
        }),
    ]);
    console.log(`✓ ${productosArtesanias.length} productos artesanales creados`);

    // ===== PRODUCTOS - Carlos (Panadería) =====
    console.log('📦 Creando productos para Carlos (Panadería)...');
    const productosPanaderia = await Promise.all([
        prisma.producto.create({
            data: {
                nombre: 'Marraqueta',
                descripcion: 'Pan tradicional boliviano',
                precioVenta: 0.50,
                costoProduccion: 0.25,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Pan Integral',
                descripcion: 'Pan integral con semillas',
                precioVenta: 1.5,
                costoProduccion: 0.8,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Cuñapé',
                descripcion: 'Pan de queso tradicional',
                precioVenta: 2,
                costoProduccion: 1.2,
                unidadMedida: 'unidad',
            },
        }),
        prisma.producto.create({
            data: {
                nombre: 'Torta de Chocolate',
                descripcion: 'Torta de chocolate casera',
                precioVenta: 85,
                costoProduccion: 45,
                unidadMedida: 'unidad',
            },
        }),
    ]);
    console.log(`✓ ${productosPanaderia.length} productos de panadería creados\n`);

    // Todos los productos
    const todosProductos = [
        ...productosTextiles,
        ...productosAlimentos,
        ...productosArtesanias,
        ...productosPanaderia,
    ];

    // ===== VENTAS (últimos 4 meses) =====
    console.log('💰 Generando ventas históricas...');
    const ventas = [];
    const hoy = new Date();

    for (const producto of todosProductos) {
        // Generar entre 10-20 ventas por producto en los últimos 4 meses
        const numVentas = Math.floor(Math.random() * 11) + 10;

        for (let i = 0; i < numVentas; i++) {
            // Fecha aleatoria en los últimos 120 días
            const diasAtras = Math.floor(Math.random() * 120);
            const fechaVenta = new Date(hoy);
            fechaVenta.setDate(fechaVenta.getDate() - diasAtras);

            // Cantidad aleatoria según el tipo de producto
            let cantidad;
            if (producto.precioVenta < 10) {
                cantidad = Math.floor(Math.random() * 20) + 5; // 5-25 unidades para productos baratos
            } else {
                cantidad = Math.floor(Math.random() * 5) + 1; // 1-5 unidades para productos caros
            }

            ventas.push({
                productoId: producto.id,
                cantidad: cantidad,
                precioUnitario: producto.precioVenta,
                precioTotal: cantidad * producto.precioVenta,
                fecha: fechaVenta,
            });
        }
    }

    await prisma.venta.createMany({ data: ventas });
    console.log(`✓ ${ventas.length} ventas históricas creadas\n`);

    // ===== COSTOS =====
    console.log('💵 Creando costos operativos...');
    const costos = [];

    // Costos fijos generales
    costos.push(
        { tipo: 'FIJO', concepto: 'Alquiler de local', monto: 1200, periodo: 'mensual' },
        { tipo: 'FIJO', concepto: 'Servicios básicos (luz, agua, gas)', monto: 350, periodo: 'mensual' },
        { tipo: 'FIJO', concepto: 'Internet', monto: 150, periodo: 'mensual' },
        { tipo: 'FIJO', concepto: 'Seguros', monto: 200, periodo: 'mensual' },
    );

    // Costos variables por producto
    for (const producto of todosProductos) {
        costos.push({
            productoId: producto.id,
            tipo: 'VARIABLE',
            concepto: `Materia prima - ${producto.nombre}`,
            monto: producto.costoProduccion * 0.7,
            periodo: 'mensual',
        });
        costos.push({
            productoId: producto.id,
            tipo: 'VARIABLE',
            concepto: `Mano de obra - ${producto.nombre}`,
            monto: producto.costoProduccion * 0.3,
            periodo: 'mensual',
        });
    }

    await prisma.costo.createMany({ data: costos });
    console.log(`✓ ${costos.length} costos registrados\n`);

    // ===== INVENTARIO =====
    console.log('📊 Inicializando inventarios...');
    const inventarios = [];

    for (const producto of todosProductos) {
        let cantidadActual, min, max;

        if (producto.precioVenta < 10) {
            // Productos de bajo costo: mayor stock
            cantidadActual = Math.floor(Math.random() * 100) + 50;
            min = 20;
            max = 200;
        } else {
            // Productos de alto costo: menor stock
            cantidadActual = Math.floor(Math.random() * 20) + 10;
            min = 5;
            max = 50;
        }

        inventarios.push({
            productoId: producto.id,
            cantidadActual: cantidadActual,
            cantidadMinima: min,
            cantidadMaxima: max,
            ubicacion: 'Almacén Principal',
        });
    }

    const inventariosCreados = await Promise.all(
        inventarios.map(inv => prisma.inventario.create({ data: inv }))
    );
    console.log(`✓ ${inventariosCreados.length} inventarios creados\n`);

    // ===== MOVIMIENTOS DE INVENTARIO =====
    console.log('📝 Generando movimientos de inventario...');
    const movimientos = [];

    for (const inventario of inventariosCreados) {
        // 5-10 movimientos por inventario
        const numMovimientos = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numMovimientos; i++) {
            const diasAtras = Math.floor(Math.random() * 90);
            const fechaMov = new Date(hoy);
            fechaMov.setDate(fechaMov.getDate() - diasAtras);

            const esEntrada = Math.random() > 0.4; // 60% entradas, 40% salidas

            movimientos.push({
                inventarioId: inventario.id,
                tipo: esEntrada ? 'ENTRADA' : 'SALIDA',
                cantidad: Math.floor(Math.random() * 20) + 5,
                motivo: esEntrada ? 'Compra a proveedor' : 'Venta al público',
                fecha: fechaMov,
            });
        }
    }

    await prisma.movimientoInventario.createMany({ data: movimientos });
    console.log(`✓ ${movimientos.length} movimientos de inventario registrados\n`);

    // ===== PREDICCIONES =====
    console.log('🔮 Generando predicciones de demanda...');
    const predicciones = [];
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    for (const producto of todosProductos) {
        // Calcular promedio de ventas
        const ventasProducto = ventas.filter(v => v.productoId === producto.id);
        const promedioVentas = ventasProducto.reduce((sum, v) => sum + v.cantidad, 0) / ventasProducto.length;

        // Predicción semanal
        predicciones.push({
            productoId: producto.id,
            demandaPredicha: Math.round(promedioVentas * 7),
            periodo: 'semanal',
            fechaPrediccion: new Date(manana.getTime() + 7 * 24 * 60 * 60 * 1000),
            confianza: 0.75,
            metodo: 'promedio_movil',
        });

        // Predicción mensual
        predicciones.push({
            productoId: producto.id,
            demandaPredicha: Math.round(promedioVentas * 30),
            periodo: 'mensual',
            fechaPrediccion: new Date(manana.getTime() + 30 * 24 * 60 * 60 * 1000),
            confianza: 0.68,
            metodo: 'regresion_lineal',
        });
    }

    await prisma.prediccion.createMany({ data: predicciones });
    console.log(`✓ ${predicciones.length} predicciones generadas\n`);

    // ===== ALERTAS =====
    console.log('🔔 Creando alertas del sistema...');
    const alertas = [];

    // Crear algunas alertas basadas en inventario
    for (const inventario of inventariosCreados) {
        if (inventario.cantidadActual < inventario.cantidadMinima) {
            const producto = todosProductos.find(p => p.id === inventario.productoId);
            alertas.push({
                tipo: 'ESCASEZ',
                severidad: 'ALTA',
                titulo: 'Stock Bajo',
                mensaje: `El inventario de ${producto.nombre} está por debajo del mínimo (${inventario.cantidadActual}/${inventario.cantidadMinima})`,
                productoId: producto.id,
                leida: false,
            });
        }

        if (inventario.cantidadActual > inventario.cantidadMaxima * 0.9) {
            const producto = todosProductos.find(p => p.id === inventario.productoId);
            alertas.push({
                tipo: 'SOBREPRODUCCION',
                severidad: 'MEDIA',
                titulo: 'Stock Alto',
                mensaje: `El inventario de ${producto.nombre} está cerca del máximo (${inventario.cantidadActual}/${inventario.cantidadMaxima})`,
                productoId: producto.id,
                leida: false,
            });
        }
    }

    // Alerta de bajo margen
    const productosBajoMargen = todosProductos.filter(p => {
        const margen = ((p.precioVenta - p.costoProduccion) / p.precioVenta) * 100;
        return margen < 30;
    });

    for (const producto of productosBajoMargen) {
        const margen = ((producto.precioVenta - producto.costoProduccion) / producto.precioVenta) * 100;
        alertas.push({
            tipo: 'BAJO_MARGEN',
            severidad: 'MEDIA',
            titulo: 'Margen de Ganancia Bajo',
            mensaje: `${producto.nombre} tiene un margen de solo ${margen.toFixed(1)}%`,
            productoId: producto.id,
            leida: false,
        });
    }

    if (alertas.length > 0) {
        await prisma.alerta.createMany({ data: alertas });
    }
    console.log(`✓ ${alertas.length} alertas creadas\n`);

    // ===== FACTORES EXTERNOS =====
    console.log('🌍 Registrando factores externos...');
    const factoresExternos = [
        {
            tipo: 'INFLACION',
            valor: 3.2,
            descripcion: 'Tasa de inflación anual en Bolivia',
            fuente: 'INE Bolivia',
        },
        {
            tipo: 'ESTACIONALIDAD',
            valor: 1.15,
            descripcion: 'Factor estacional - temporada alta',
            fuente: 'Análisis interno',
        },
        {
            tipo: 'COMPETENCIA',
            valor: 0.85,
            descripcion: 'Índice de competencia en el sector',
            fuente: 'Estudio de mercado',
        },
        {
            tipo: 'CLIMA',
            valor: 1.0,
            descripcion: 'Condiciones climáticas normales',
            fuente: 'SENAMHI',
        },
    ];

    await prisma.factorExterno.createMany({ data: factoresExternos });
    console.log(`✓ ${factoresExternos.length} factores externos registrados\n`);

    console.log('✅ ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${usuarios.length} usuarios`);
    console.log(`   - ${empleados.length} empleados`);
    console.log(`   - ${todosProductos.length} productos`);
    console.log(`   - ${ventas.length} ventas`);
    console.log(`   - ${costos.length} costos`);
    console.log(`   - ${inventariosCreados.length} inventarios`);
    console.log(`   - ${movimientos.length} movimientos`);
    console.log(`   - ${predicciones.length} predicciones`);
    console.log(`   - ${alertas.length} alertas`);
    console.log(`   - ${factoresExternos.length} factores externos`);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   - ADMIN DEMO: admin@test.com / 123456');
    console.log('   - maria_textiles / demo123');
    console.log('   - juan_alimentos / demo123');
    console.log('   - ana_artesanias / demo123');
    console.log('   - carlos_panaderia / demo123');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
