const router = require('express').Router();
const analisisController = require('../controllers/analisis.controller');

// Análisis económicos
router.get('/elasticidad/:productoId', analisisController.getElasticidad);
router.get('/equilibrio/:productoId', analisisController.getEquilibrio);
router.get('/prediccion/:productoId', analisisController.getPrediccion);

// Alertas
router.get('/alertas', analisisController.getAlertas);
router.post('/alertas/generar', analisisController.generarAlertasAutomaticas);
router.put('/alertas/:id/marcar-leida', analisisController.marcarAlertaLeida);

// Métricas y dashboard
router.get('/metricas', analisisController.getMetricas);
router.get('/dashboard', analisisController.getDashboard);

module.exports = router;
