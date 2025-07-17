// Configuración de la API
const API_CONFIG = {
    // URL base para producción (Hostinger)
    BASE_URL: 'https://dharckstore.com/api',
    
    // Endpoints
    ENDPOINTS: {
        ORDERS: '/orders',
        EXCHANGE_RATES: '/exchange-rates',
        EXCHANGE: '/exchange',
        SELLERS: '/sellers',
        GAMES: '/games',
        PRODUCTS: '/products',
        HEALTH: '/health'
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Función para hacer peticiones HTTP con mejor manejo de errores
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
        console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error ${response.status}:`, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Response:`, data);
        
        return data;
    } catch (error) {
        console.error('❌ API Request Error:', error);
        throw error;
    }
};

// Servicios específicos
export const orderService = {
    // Crear nuevo pedido
    create: (orderData) => {
        console.log('📝 Creando pedido:', orderData);
        return apiRequest(API_CONFIG.ENDPOINTS.ORDERS, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    
    // Obtener todos los pedidos
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        const endpoint = `${API_CONFIG.ENDPOINTS.ORDERS}${params.toString() ? '?' + params : ''}`;
        return apiRequest(endpoint);
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
    // Obtener todas las tasas de cambio
    getAll: () => apiRequest(API_CONFIG.ENDPOINTS.EXCHANGE_RATES),
    
    // Obtener tasa específica
    getRate: (from, to) => apiRequest(`${API_CONFIG.ENDPOINTS.EXCHANGE}/${from}/${to}`),
    
    // Convertir cantidad
    convert: (amount, from, to) => apiRequest(API_CONFIG.ENDPOINTS.EXCHANGE, {
        method: 'POST',
        body: JSON.stringify({ amount, from, to })
    })
};

// Servicio de salud de la API
export const healthService = {
    check: () => apiRequest(API_CONFIG.ENDPOINTS.HEALTH)
};

export default API_CONFIG;