const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Formato de token inválido. Use el formato 'Bearer <token>'." });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido." });
        }
        return res.status(401).json({ message: "Fallo en la autenticación del token." });
    }
};
