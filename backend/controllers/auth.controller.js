const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validación
        if (!username || !password) {
            return res.status(400).json({ message: "Username y password son requeridos" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // Verificar si el usuario ya existe
        const existente = await prisma.usuario.findUnique({
            where: { username }
        });

        if (existente) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: { username, password: hashed }
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: {
                id: usuario.id,
                username: usuario.username
            }
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validación
        if (!username || !password) {
            return res.status(400).json({ message: "Username y password son requeridos" });
        }

        const user = await prisma.usuario.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};
