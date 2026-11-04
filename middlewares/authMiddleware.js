const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    //Busca el token en la cabecera "Authorization"
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado.' });
    }

    try {
        //El formato estándar es "Bearer <token>"
        const tokenLimpio = token.replace('Bearer ', '');
        const decodificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = decodificado; //Guarda los datos del usuario en la petición
        next(); //Permite que la ruta continúe hacia el controlador
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;