// Rutas para manejar pedidos
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ExchangeRate = require('../models/ExchangeRate');

// Crear nuevo pedido
router.post('/', async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            player_id,
            product_id,
            game_id,
            base_price,
            currency,
            payment_method
        } = req.body;

        // Validaciones básicas
        if (!customer_name || !player_id || !product_id || !game_id) {
            return res.status(400).json({
                error: 'Faltan campos requeridos'
            });
        }

        // Obtener tasa de cambio
        const exchangeRate = await ExchangeRate.getRate('USD', currency);
        const localPrice = (base_price * exchangeRate).toFixed(2);

        // Asignar vendedor (por ahora aleatorio)
        const seller_id = Math.floor(Math.random() * 8) + 1;

        const orderData = {
            customer_name,
            customer_email,
            customer_phone,
            player_id,
            product_id,
            game_id,
            seller_id,
            base_price,
            local_price: parseFloat(localPrice),
            currency,
            exchange_rate: exchangeRate,
            payment_method
        };

        const order = await Order.create(orderData);

        res.status(201).json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error creando pedido:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Obtener pedidos
router.get('/', async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            seller_id: req.query.seller_id,
            date_from: req.query.date_from,
            date_to: req.query.date_to,
            limit: req.query.limit || 50
        };

        const orders = await Order.getAll(filters);

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Obtener pedido específico
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                error: 'Pedido no encontrado'
            });
        }

        const history = await Order.getStatusHistory(req.params.id);

        res.json({
            success: true,
            order: order,
            history: history
        });

    } catch (error) {
        console.error('Error obteniendo pedido:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar estado del pedido
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes, changed_by } = req.body;

        if (!status) {
            return res.status(400).json({
                error: 'Estado requerido'
            });
        }

        const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Estado inválido'
            });
        }

        const order = await Order.updateStatus(
            req.params.id, 
            status, 
            notes || '', 
            changed_by || 'Admin'
        );

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error actualizando pedido:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// Estadísticas de pedidos
router.get('/stats/summary', async (req, res) => {
    try {
        const sellerId = req.query.seller_id;
        const stats = await Order.getStats(sellerId);

        res.json({
            success: true,
            stats: stats
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;