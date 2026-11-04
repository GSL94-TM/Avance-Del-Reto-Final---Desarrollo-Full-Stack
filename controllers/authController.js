const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = (req, res) => {
    const { usuario, password } = req.body;
    
    //Simulación: Validamos credenciales fijas
    if (usuario === 'admin' && password === 'cafe2026') {
        const payload = { usuario: 'admin', rol: 'administrador' };
        //Se Frima el token usando la clave secreta generada en dotenv
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        
        res.json({ mensaje: 'Autenticación exitosa', token });
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
};

module.exports = { login };