import { orderService, healthService } from '../config/api.js';

class OrderService {
    // Crear pedido y guardarlo en la base de datos
    static async createOrder(orderData) {
        try {
            console.log('🚀 Iniciando creación de pedido:', orderData);
            
            // Validar datos requeridos
            const requiredFields = ['customer_name', 'player_id', 'product_id', 'game_id', 'base_price'];
            for (const field of requiredFields) {
                if (!orderData[field]) {
                    throw new Error(`Campo requerido: ${field}`);
                }
            }

            // Verificar conexión con la API
            try {
                await healthService.check();
                console.log('✅ Conexión con API verificada');
            } catch (healthError) {
                console.warn('⚠️ API no disponible, guardando localmente');
                return this.saveLocalOrder({
                    ...orderData,
                    id: Date.now(),
                    order_number: `LOCAL_${Date.now()}`,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    sync_status: 'pending'
                });
            }

            // Enviar a la API
            console.log('📤 Enviando pedido a la API...');
            const response = await orderService.create(orderData);
            
            if (response && response.success) {
                console.log('✅ Pedido creado exitosamente en el servidor:', response.order);
                
                // También guardar localmente como respaldo
                this.saveLocalOrder({
                    ...response.order,
                    sync_status: 'synced'
                });
                
                // Notificar éxito
                this.showNotification('Pedido creado exitosamente', 'success');
                
                return response.order;
            } else {
                throw new Error(response?.error || 'Error en la respuesta del servidor');
            }
            
        } catch (error) {
            console.error('❌ Error creando pedido:', error);
            
            // Si falla la conexión, guardar solo localmente
            const localOrder = this.saveLocalOrder({
                ...orderData,
                id: Date.now(),
                order_number: `LOCAL_${Date.now()}`,
                status: 'pending',
                created_at: new Date().toISOString(),
                sync_status: 'pending'
            });
            
            this.showNotification('Pedido guardado localmente. Se sincronizará cuando haya conexión.', 'warning');
            
            return localOrder;
        }
    }

    // Obtener todos los pedidos (combinando locales y remotos)
    static async getAllOrders() {
        try {
            console.log('📥 Obteniendo pedidos del servidor...');
            
            // Intentar obtener pedidos del servidor
            const response = await orderService.getAll();
            
            if (response && response.success) {
                console.log('✅ Pedidos obtenidos del servidor:', response.orders?.length || 0);
                
                // Combinar con pedidos locales no sincronizados
                const localOrders = this.getLocalOrders().filter(order => order.sync_status === 'pending');
                
                return {
                    remote: response.orders || [],
                    local: localOrders,
                    all: [...(response.orders || []), ...localOrders]
                };
            }
        } catch (error) {
            console.error('❌ Error obteniendo pedidos remotos:', error);
            
            // Si falla, devolver solo los locales
            const localOrders = this.getLocalOrders();
            return {
                remote: [],
                local: localOrders,
                all: localOrders
            };
        }
    }

    // Sincronizar pedidos locales con el servidor
    static async syncLocalOrders() {
        const localOrders = this.getLocalOrders().filter(order => order.sync_status === 'pending');
        
        if (localOrders.length === 0) {
            console.log('✅ No hay pedidos locales para sincronizar');
            return;
        }
        
        console.log(`🔄 Sincronizando ${localOrders.length} pedidos locales...`);
        
        for (const order of localOrders) {
            try {
                const response = await orderService.create(order);
                
                if (response && response.success) {
                    // Marcar como sincronizado
                    order.sync_status = 'synced';
                    order.remote_id = response.order.id;
                    this.updateLocalOrder(order);
                    
                    console.log(`✅ Pedido ${order.order_number} sincronizado exitosamente`);
                }
            } catch (error) {
                console.error(`❌ Error sincronizando pedido ${order.order_number}:`, error);
            }
        }
    }

    // Guardar pedido localmente
    static saveLocalOrder(order) {
        const orders = this.getLocalOrders();
        orders.push(order);
        localStorage.setItem('dharck_orders', JSON.stringify(orders));
        console.log('💾 Pedido guardado localmente:', order.order_number);
        return order;
    }

    // Obtener pedidos locales
    static getLocalOrders() {
        const orders = localStorage.getItem('dharck_orders');
        return orders ? JSON.parse(orders) : [];
    }

    // Actualizar pedido local
    static updateLocalOrder(updatedOrder) {
        const orders = this.getLocalOrders();
        const index = orders.findIndex(order => order.id === updatedOrder.id);
        
        if (index !== -1) {
            orders[index] = updatedOrder;
            localStorage.setItem('dharck_orders', JSON.stringify(orders));
            console.log('📝 Pedido local actualizado:', updatedOrder.order_number);
        }
    }

    // Mostrar notificaciones
    static showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Crear notificación visual
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Verificar conexión y sincronizar automáticamente
    static async autoSync() {
        try {
            await healthService.check();
            console.log('🔄 Auto-sincronización iniciada...');
            await this.syncLocalOrders();
        } catch (error) {
            console.log('📴 Sin conexión al servidor, trabajando offline');
        }
    }

    // Obtener estadísticas de pedidos
    static async getOrderStats() {
        try {
            const response = await orderService.getStats();
            return response;
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            
            // Calcular estadísticas locales como fallback
            const localOrders = this.getLocalOrders();
            return {
                success: true,
                stats: {
                    total_orders: localOrders.length,
                    pending_orders: localOrders.filter(o => o.status === 'pending').length,
                    completed_orders: localOrders.filter(o => o.status === 'completed').length,
                    total_revenue: localOrders.reduce((sum, o) => sum + (o.final_price || 0), 0)
                },
                source: 'local'
            };
        }
    }
}

// Auto-sincronizar cada 30 segundos si hay conexión
setInterval(() => {
    OrderService.autoSync();
}, 30000);

// Sincronizar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    OrderService.autoSync();
});

export default OrderService;