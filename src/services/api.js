// Servicio para comunicarse con la API
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost/api';  // Cambiado a /api para producción, asumiendo mismo dominio

class ApiService {
    // Crear nuevo pedido
    static async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error creando pedido');
            }

            return data;
        } catch (error) {
            console.error('Error en createOrder:', error);
            throw error;
        }
    }

    // Obtener pedidos
    static async getOrders(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo pedidos');
            }

            return data;
        } catch (error) {
            console.error('Error en getOrders:', error);
            throw error;
        }
    }

    // Obtener pedido específico
    static async getOrder(orderId) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo pedido');
            }

            return data;
        } catch (error) {
            console.error('Error en getOrder:', error);
            throw error;
        }
    }

    // Actualizar estado del pedido
    static async updateOrderStatus(orderId, status, notes = '', changedBy = 'Admin') {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    notes,
                    changed_by: changedBy
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error actualizando pedido');
            }

            return data;
        } catch (error) {
            console.error('Error en updateOrderStatus:', error);
            throw error;
        }
    }

    // Obtener tasa de cambio
    static async getExchangeRate(fromCurrency, toCurrency) {
        try {
            const response = await fetch(`${API_BASE_URL}/exchange/rate/${fromCurrency}/${toCurrency}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo tasa de cambio');
            }

            return data;
        } catch (error) {
            console.error('Error en getExchangeRate:', error);
            throw error;
        }
    }

    // Convertir precio
    static async convertPrice(amount, fromCurrency, toCurrency) {
        try {
            const response = await fetch(`${API_BASE_URL}/exchange/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    from_currency: fromCurrency,
                    to_currency: toCurrency
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error convirtiendo precio');
            }

            return data;
        } catch (error) {
            console.error('Error en convertPrice:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    static async getOrderStats(sellerId = null) {
        try {
            const queryParams = sellerId ? `?seller_id=${sellerId}` : '';
            const response = await fetch(`${API_BASE_URL}/orders/stats/summary${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo estadísticas');
            }

            return data;
        } catch (error) {
            console.error('Error en getOrderStats:', error);
            throw error;
        }
    }

    // Verificar estado de la API
    static async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error verificando salud de la API:', error);
            return { status: 'ERROR', database: 'Disconnected' };
        }
    }
}

export default ApiService;