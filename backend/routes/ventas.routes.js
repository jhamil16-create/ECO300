const router = require('express').Router();
const ventasController = require('../controllers/ventas.controller');

router.get('/', ventasController.getVentas);
router.get('/estadisticas/resumen', ventasController.getEstadisticasVentas);
router.get('/:id', ventasController.getVentaById);
router.post('/', ventasController.createVenta);
router.delete('/:id', ventasController.deleteVenta);

module.exports = router;
