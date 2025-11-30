/**
 * Módulo de cálculos económicos para análisis empresarial
 * Incluye funciones para elasticidad, predicción de demanda, equilibrio y alertas
 */

/**
 * Calcula la elasticidad precio-demanda
 * Fórmula: E = (ΔQ/Q) / (ΔP/P)
 * @param {Array} ventas - Array de objetos con {precioUnitario, cantidad, fecha}
 * @returns {Object} - {elasticidad, interpretacion}
 */
function calcularElasticidad(ventas) {
    if (!ventas || ventas.length < 2) {
        return { elasticidad: null, interpretacion: 'Datos insuficientes' };
    }

    // Ordenar por fecha
    const ventasOrdenadas = [...ventas].sort((a, b) =>
        new Date(a.fecha) - new Date(b.fecha)
    );

    // Tomar última y penúltima venta
    const ventaActual = ventasOrdenadas[ventasOrdenadas.length - 1];
    const ventaAnterior = ventasOrdenadas[ventasOrdenadas.length - 2];

    const deltaQ = ventaActual.cantidad - ventaAnterior.cantidad;
    const deltaP = ventaActual.precioUnitario - ventaAnterior.precioUnitario;

    if (deltaP === 0) {
        return { elasticidad: null, interpretacion: 'Sin cambio de precio' };
    }

    const promedioQ = (ventaActual.cantidad + ventaAnterior.cantidad) / 2;
    const promedioP = (ventaActual.precioUnitario + ventaAnterior.precioUnitario) / 2;

    const elasticidad = (deltaQ / promedioQ) / (deltaP / promedioP);

    let interpretacion;
    if (Math.abs(elasticidad) > 1) {
        interpretacion = 'Demanda elástica (sensible al precio)';
    } else if (Math.abs(elasticidad) < 1) {
        interpretacion = 'Demanda inelástica (poco sensible al precio)';
    } else {
        interpretacion = 'Demanda unitaria';
    }

    return {
        elasticidad: parseFloat(elasticidad.toFixed(2)),
        interpretacion,
        deltaQ,
        deltaP,
    };
}

/**
 * Calcula el punto de equilibrio (break-even point)
 * Fórmula: Q = CF / (P - CV)
 * @param {Number} costosFijos - Costos fijos totales
 * @param {Number} costoVariable - Costo variable unitario
 * @param {Number} precio - Precio de venta unitario
 * @returns {Object} - {unidadesEquilibrio, ingresoEquilibrio, margenContribucion}
 */
function calcularEquilibrio(costosFijos, costoVariable, precio) {
    if (precio <= costoVariable) {
        return {
            unidadesEquilibrio: Infinity,
            ingresoEquilibrio: Infinity,
            margenContribucion: precio - costoVariable,
            viable: false,
            mensaje: 'El precio es menor o igual al costo variable. Negocio no viable.'
        };
    }

    const margenContribucion = precio - costoVariable;
    const unidadesEquilibrio = costosFijos / margenContribucion;
    const ingresoEquilibrio = unidadesEquilibrio * precio;

    return {
        unidadesEquilibrio: parseFloat(unidadesEquilibrio.toFixed(2)),
        ingresoEquilibrio: parseFloat(ingresoEquilibrio.toFixed(2)),
        margenContribucion: parseFloat(margenContribucion.toFixed(2)),
        margenContribucionPorcentaje: parseFloat(((margenContribucion / precio) * 100).toFixed(2)),
        viable: true
    };
}

/**
 * Predice la demanda futura usando regresión lineal simple
 * @param {Array} historicoVentas - Array de ventas históricas con cantidad y fecha
 * @param {Number} diasFuturos - Número de días a futuro para predecir (default: 30)
 * @returns {Object} - {demandaPredicha, tendencia, confianza}
 */
function predecirDemanda(historicoVentas, diasFuturos = 30) {
    if (!historicoVentas || historicoVentas.length < 3) {
        return {
            demandaPredicha: null,
            tendencia: 'Datos insuficientes',
            confianza: 0
        };
    }

    // Ordenar por fecha
    const ventasOrdenadas = [...historicoVentas].sort((a, b) =>
        new Date(a.fecha) - new Date(b.fecha)
    );

    // Convertir fechas a días desde la primera venta
    const fechaInicio = new Date(ventasOrdenadas[0].fecha);
    const datos = ventasOrdenadas.map(v => ({
        x: Math.floor((new Date(v.fecha) - fechaInicio) / (1000 * 60 * 60 * 24)),
        y: v.cantidad
    }));

    // Regresión lineal: y = mx + b
    const n = datos.length;
    const sumX = datos.reduce((sum, d) => sum + d.x, 0);
    const sumY = datos.reduce((sum, d) => sum + d.y, 0);
    const sumXY = datos.reduce((sum, d) => sum + (d.x * d.y), 0);
    const sumX2 = datos.reduce((sum, d) => sum + (d.x * d.x), 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Predecir para días futuros
    const ultimoDia = datos[datos.length - 1].x;
    const diaPrediccion = ultimoDia + diasFuturos;
    const demandaPredicha = m * diaPrediccion + b;

    // Calcular coeficiente de determinación (R²) para confianza
    const yMean = sumY / n;
    const ssTotal = datos.reduce((sum, d) => sum + Math.pow(d.y - yMean, 2), 0);
    const ssResidual = datos.reduce((sum, d) => {
        const yPred = m * d.x + b;
        return sum + Math.pow(d.y - yPred, 2);
    }, 0);
    const r2 = 1 - (ssResidual / ssTotal);

    let tendencia;
    if (m > 0.1) tendencia = 'Creciente';
    else if (m < -0.1) tendencia = 'Decreciente';
    else tendencia = 'Estable';

    return {
        demandaPredicha: Math.max(0, parseFloat(demandaPredicha.toFixed(2))),
        tendencia,
        confianza: parseFloat(Math.max(0, Math.min(1, r2)).toFixed(2)),
        pendiente: parseFloat(m.toFixed(4)),
        intercepto: parseFloat(b.toFixed(2))
    };
}

/**
 * Genera alertas basadas en inventario, ventas y predicciones
 * @param {Object} inventario - Objeto de inventario actual
 * @param {Array} ventasRecientes - Ventas de últimos días
 * @param {Object} prediccion - Predicción de demanda
 * @param {Object} producto - Información del producto
 * @returns {Array} - Array de alertas generadas
 */
function generarAlertas(inventario, ventasRecientes, prediccion, producto) {
    const alertas = [];

    // Alerta de escasez
    if (inventario.cantidadActual < inventario.cantidadMinima) {
        alertas.push({
            tipo: 'ESCASEZ',
            severidad: 'ALTA',
            titulo: `Stock crítico: ${producto.nombre}`,
            mensaje: `El inventario actual (${inventario.cantidadActual}) está por debajo del mínimo (${inventario.cantidadMinima})`,
            productoId: producto.id
        });
    }

    // Alerta de sobreproducción
    if (inventario.cantidadActual > inventario.cantidadMaxima) {
        alertas.push({
            tipo: 'SOBREPRODUCCION',
            severidad: 'MEDIA',
            titulo: `Exceso de inventario: ${producto.nombre}`,
            mensaje: `El inventario actual (${inventario.cantidadActual}) supera el máximo recomendado (${inventario.cantidadMaxima})`,
            productoId: producto.id
        });
    }

    // Alerta de bajo margen
    const margen = ((producto.precioVenta - producto.costoProduccion) / producto.precioVenta) * 100;
    if (margen < 20) {
        alertas.push({
            tipo: 'BAJO_MARGEN',
            severidad: margen < 10 ? 'ALTA' : 'MEDIA',
            titulo: `Margen bajo: ${producto.nombre}`,
            mensaje: `El margen de ganancia es solo ${margen.toFixed(1)}%. Considere ajustar precio o reducir costos.`,
            productoId: producto.id
        });
    }

    // Alerta de alta demanda prevista
    if (prediccion && prediccion.demandaPredicha > inventario.cantidadActual * 1.5) {
        alertas.push({
            tipo: 'ALTA_DEMANDA',
            severidad: 'MEDIA',
            titulo: `Alta demanda prevista: ${producto.nombre}`,
            mensaje: `Se predice demanda de ${prediccion.demandaPredicha} unidades. Inventario actual: ${inventario.cantidadActual}`,
            productoId: producto.id
        });
    }

    // Alerta de ventas bajas
    if (ventasRecientes && ventasRecientes.length > 0) {
        const totalVentasDias = ventasRecientes.reduce((sum, v) => sum + v.cantidad, 0);
        const promedioVentasDiarias = totalVentasDias / 30; // Asumiendo 30 días

        if (promedioVentasDiarias < 1 && inventario.cantidadActual > 50) {
            alertas.push({
                tipo: 'VENTAS_BAJAS',
                severidad: 'BAJA',
                titulo: `Ventas bajas: ${producto.nombre}`,
                mensaje: `Promedio de ${promedioVentasDiarias.toFixed(1)} unidades/día con inventario de ${inventario.cantidadActual}`,
                productoId: producto.id
            });
        }
    }

    return alertas;
}

/**
 * Calcula métricas económicas agregadas
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} costos - Array de todos los costos
 * @returns {Object} - Métricas calculadas
 */
function calcularMetricasEconomicas(ventas, costos) {
    const totalIngresos = ventas.reduce((sum, v) => sum + v.precioTotal, 0);
    const totalCostos = costos.reduce((sum, c) => sum + c.monto, 0);
    const utilidad = totalIngresos - totalCostos;
    const margenUtilidad = totalIngresos > 0 ? (utilidad / totalIngresos) * 100 : 0;

    return {
        totalIngresos: parseFloat(totalIngresos.toFixed(2)),
        totalCostos: parseFloat(totalCostos.toFixed(2)),
        utilidad: parseFloat(utilidad.toFixed(2)),
        margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
        roi: totalCostos > 0 ? parseFloat(((utilidad / totalCostos) * 100).toFixed(2)) : 0
    };
}

module.exports = {
    calcularElasticidad,
    calcularEquilibrio,
    predecirDemanda,
    generarAlertas,
    calcularMetricasEconomicas
};
