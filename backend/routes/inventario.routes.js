const router = require('express').Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/', inventarioController.getInventario);
router.get('/alertas/stock', inventarioController.getAlertasStock);
router.get('/:id', inventarioController.getInventarioByProducto);
router.put('/:id', inventarioController.updateInventario);
router.post('/:id/movimiento', inventarioController.registrarMovimiento);

module.exports = router;
