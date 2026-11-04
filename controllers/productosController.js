const db = require('../models/db'); //Importa la conexión MySQL

//Se crea un nuevo producto (Operación protegida)
const crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, estado } = req.body;
    try {
        const [resultado] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, precio, estado]
        );
        res.status(201).json({ id: resultado.insertId, nombre, mensaje: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
};

//Se leen todos los productos (Operación abierta)
const obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
    }
};

//Se actualiza un producto existente (Operación protegida)
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, estado } = req.body;
    try {
        await db.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id = ?',
            [nombre, descripcion, precio, estado, id]
        );
        res.json({ mensaje: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
};

// Se elimina un producto (Operación protegida)
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
};

module.exports = { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto };