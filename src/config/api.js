// Configuración de la API
const API_CONFIG = {
    // URL base para producción (Hostinger)
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://dharckstore.com/api' 
        : 'http://localhost:3000/api',
    
    // Endpoints
    ENDPOINTS: {
        ORDERS: '/orders',
        EXCHANGE_RATES: '/exchange-rates',
        SELLERS: '/sellers',
        GAMES: '/games',
        PRODUCTS: '/products'
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Función para hacer peticiones HTTP
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Servicios específicos
export const orderService = {
    // Crear nuevo pedido
    create: (orderData) => apiRequest(API_CONFIG.ENDPOINTS.ORDERS, {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    
    // Obtener todos los pedidos
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}?${params}`);
    },
    
    // Obtener pedido por ID
    getById: (id) => apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`),
    
    // Actualizar estado del pedido
    updateStatus: (id, statusData) => apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
    }),
    
    // Obtener estadísticas
    getStats: (sellerId = null) => {
        const params = sellerId ? `?seller_id=${sellerId}` : '';
        return apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}/stats/summary${params}`);
    }
};

export const exchangeRateService = {
    getAll: () => apiRequest(API_CONFIG.ENDPOINTS.EXCHANGE_RATES),
    getRate: (from, to) => apiRequest(`${API_CONFIG.ENDPOINTS.EXCHANGE_RATES}/${from}/${to}`)
};

export default API_CONFIG;