const mysql = require('mysql2');
require('dotenv').config();

//Crea el grupo de conexiones (Pool) usando las variables del .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Se convierte el pool para usar Promesas (async/await)
const db = pool.promise();

//Se verifica si la conexión es exitosa al arrancar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL.');
        connection.release(); //Libera la conexión
    }
});

module.exports = db;