const prisma = require('../utils/prisma');

// GET /api/empleados - Listar todos los empleados
exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await prisma.empleado.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
};

// GET /api/empleados/:id - Obtener un empleado específico
exports.getEmpleadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await prisma.empleado.findUnique({
            where: { id: parseInt(id) }
        });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        res.json(empleado);
    } catch (error) {
        console.error('Error al obtener empleado:', error);
        res.status(500).json({ error: 'Error al obtener empleado' });
    }
};

// POST /api/empleados - Crear un nuevo empleado
exports.createEmpleado = async (req, res) => {
    try {
        const { nombre, sexo, cargo } = req.body;

        if (!nombre || !sexo || !cargo) {
            return res.status(400).json({ error: 'Nombre, sexo y cargo son requeridos' });
        }

        const empleado = await prisma.empleado.create({
            data: { nombre, sexo, cargo }
        });

        res.status(201).json(empleado);
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(500).json({ error: 'Error al crear empleado' });
    }
};

// PUT /api/empleados/:id - Actualizar un empleado
exports.updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, sexo, cargo } = req.body;

        const empleado = await prisma.empleado.update({
            where: { id: parseInt(id) },
            data: {
                ...(nombre && { nombre }),
                ...(sexo && { sexo }),
                ...(cargo && { cargo })
            }
        });

        res.json(empleado);
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(500).json({ error: 'Error al actualizar empleado' });
    }
};

// DELETE /api/empleados/:id - Eliminar un empleado
exports.deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.empleado.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ error: 'Error al eliminar empleado' });
    }
};
