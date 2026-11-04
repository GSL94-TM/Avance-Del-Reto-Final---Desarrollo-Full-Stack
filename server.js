const express = require('express');
const cors = require('cors');
require('dotenv').config(); //Carga las variables del archivo .env
const apiRoutes = require('./routes/apiRoutes'); //Se importan rutas

const app = express();

//Middlewares
app.use(cors()); //Permite peticiones desde el frontend
app.use(express.json()); //Habilita la recepción de datos en formato JSON

//Ruta de comprobación básica
app.get('/api/status', (req, res) => {
    res.json({ mensaje: 'Servidor Backend de Café del Valle funcionando correctamente.' });
});

//Monta las rutas en el prefijo /api
app.use('/api', apiRoutes);

//Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});