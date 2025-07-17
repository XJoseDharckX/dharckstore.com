// Modelo para manejar pedidos
const { executeQuery } = require('../config/database');

class Order {
    // Crear nuevo pedido
    static async create(orderData) {
        const {
            customer_name,
            customer_email,
            customer_phone,
            player_id,
            product_id,
            game_id,
            seller_id,
            base_price,
            local_price,
            currency,
            exchange_rate,
            payment_method
        } = orderData;

        // Generar número de pedido único
        const order_number = await this.generateOrderNumber();

        const query = `
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone,
                player_id, product_id, game_id, seller_id, base_price,
                local_price, currency, exchange_rate, payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            order_number, customer_name, customer_email, customer_phone,
            player_id, product_id, game_id, seller_id, base_price,
            local_price, currency, exchange_rate, payment_method
        ];

        const result = await executeQuery(query, params);
        
        // Registrar en historial
        await this.addStatusHistory(result.insertId, null, 'pending', 'Sistema');

        return {
            id: result.insertId,
            order_number,
            ...orderData
        };
    }

    // Generar número de pedido único
    static async generateOrderNumber() {
        const prefix = 'DS';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Obtener pedido por ID
    static async getById(id) {
        const query = `
            SELECT o.*, g.name as game_name, s.name as seller_name,
                   p.name as product_name
            FROM orders o
            LEFT JOIN games g ON o.game_id = g.id
            LEFT JOIN sellers s ON o.seller_id = s.id
            LEFT JOIN products p ON o.product_id = p.id
            WHERE o.id = ?
        `;
        
        const results = await executeQuery(query, [id]);
        return results[0] || null;
    }

    // Obtener pedidos con filtros
    static async getAll(filters = {}) {
        let query = `
            SELECT o.*, g.name as game_name, s.name as seller_name,
                   p.name as product_name
            FROM orders o
            LEFT JOIN games g ON o.game_id = g.id
            LEFT JOIN sellers s ON o.seller_id = s.id
            LEFT JOIN products p ON o.product_id = p.id
            WHERE 1=1
        `;
        
        const params = [];

        if (filters.status) {
            query += ' AND o.status = ?';
            params.push(filters.status);
        }

        if (filters.seller_id) {
            query += ' AND o.seller_id = ?';
            params.push(filters.seller_id);
        }

        if (filters.date_from) {
            query += ' AND DATE(o.created_at) >= ?';
            params.push(filters.date_from);
        }

        if (filters.date_to) {
            query += ' AND DATE(o.created_at) <= ?';
            params.push(filters.date_to);
        }

        query += ' ORDER BY o.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        return await executeQuery(query, params);
    }

    // Actualizar estado del pedido
    static async updateStatus(id, newStatus, notes = '', changedBy = 'Sistema') {
        // Obtener estado actual
        const currentOrder = await this.getById(id);
        if (!currentOrder) {
            throw new Error('Pedido no encontrado');
        }

        const oldStatus = currentOrder.status;

        // Actualizar pedido
        const updateQuery = `
            UPDATE orders 
            SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
            ${newStatus === 'completed' ? ', completed_at = CURRENT_TIMESTAMP' : ''}
            WHERE id = ?
        `;

        await executeQuery(updateQuery, [newStatus, notes, id]);

        // Registrar en historial
        await this.addStatusHistory(id, oldStatus, newStatus, changedBy, notes);

        return await this.getById(id);
    }

    // Agregar al historial de estados
    static async addStatusHistory(orderId, oldStatus, newStatus, changedBy, notes = '') {
        const query = `
            INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await executeQuery(query, [orderId, oldStatus, newStatus, changedBy, notes]);
    }

    // Obtener historial de un pedido
    static async getStatusHistory(orderId) {
        const query = `
            SELECT * FROM order_status_history 
            WHERE order_id = ? 
            ORDER BY created_at ASC
        `;
        
        return await executeQuery(query, [orderId]);
    }

    // Estadísticas de pedidos
    static async getStats(sellerId = null) {
        let query = `
            SELECT 
                COUNT(*) as total_orders,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
                COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
                SUM(CASE WHEN status = 'completed' THEN local_price ELSE 0 END) as total_revenue,
                AVG(CASE WHEN status = 'completed' THEN local_price ELSE NULL END) as avg_order_value
            FROM orders
        `;

        const params = [];
        if (sellerId) {
            query += ' WHERE seller_id = ?';
            params.push(sellerId);
        }

        const results = await executeQuery(query, params);
        return results[0];
    }
}

module.exports = Order;