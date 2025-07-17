// Configuración de la base de datos MySQL para Hostinger
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'u875897750_dharckstore',
    password: process.env.DB_PASSWORD || 'Jose35//',
    database: process.env.DB_NAME || 'u875897750_hostinger',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    // Configuración específica para Hostinger
    ssl: false,
    acquireTimeout: 60000,
    timeout: 60000
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Base de datos: ${dbConfig.database}`);
        console.log(`👤 Usuario: ${dbConfig.user}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        return false;
    }
}

// Función para ejecutar queries
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Error ejecutando query:', error);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    executeQuery
};