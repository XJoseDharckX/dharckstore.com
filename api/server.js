// Servidor principal de la API
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/orders', require('./routes/orders'));
app.use('/api/exchange', require('./routes/exchange'));

// Ruta de salud
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        status: 'OK',
        database: dbStatus ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor API ejecutándose en puerto ${PORT}`);
    
    // Probar conexión a la base de datos
    await testConnection();
});

module.exports = app;