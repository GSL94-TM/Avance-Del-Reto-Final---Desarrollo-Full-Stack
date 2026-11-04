const express = require('express');
const router = express.Router();

//Se importan controladores y middlewares
const { login } = require('../controllers/authController');
const { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/productosController');
const verificarToken = require('../middlewares/authMiddleware');

//Ruta de Autenticación
router.post('/login', login);

//Rutas CRUD de Productos
router.get('/productos', obtenerProductos); //Operación de lectura ABIERTA
router.post('/productos', verificarToken, crearProducto); //Operación de lectura PROTEGIDA
router.put('/productos/:id', verificarToken, actualizarProducto); //Operación de lectura PROTEGIDA
router.delete('/productos/:id', verificarToken, eliminarProducto); //Operación de lectura PROTEGIDA

module.exports = router;