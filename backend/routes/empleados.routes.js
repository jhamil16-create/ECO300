const router = require('express').Router();
const empleadosController = require('../controllers/empleados.controller');

router.get('/', empleadosController.getEmpleados);
router.get('/:id', empleadosController.getEmpleadoById);
router.post('/', empleadosController.createEmpleado);
router.put('/:id', empleadosController.updateEmpleado);
router.delete('/:id', empleadosController.deleteEmpleado);

module.exports = router;
