import { orderService } from '../config/api.js';

class OrderService {
    // Crear pedido y guardarlo en la base de datos
    static async createOrder(orderData) {
        try {
            // Validar datos requeridos
            const requiredFields = ['customer_name', 'player_id', 'product_id', 'game_id', 'base_price'];
            for (const field of requiredFields) {
                if (!orderData[field]) {
                    throw new Error(`Campo requerido: ${field}`);
                }
            }

            // Enviar a la API
            const response = await orderService.create(orderData);
            
            if (response.success) {
                // También guardar localmente como respaldo
                this.saveLocalOrder(response.order);
                
                // Notificar éxito
                this.showNotification('Pedido creado exitosamente', 'success');
                
                return response.order;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
            
        } catch (error) {
            console.error('Error creando pedido:', error);
            
            // Si falla la conexión, guardar solo localmente
            const localOrder = this.saveLocalOrder({
                ...orderData,
                id: Date.now(),
                order_number: `LOCAL_${Date.now()}`,
                status: 'pending',
                created_at: new Date().toISOString(),
                sync_status: 'pending' // Marcar para sincronizar después
            });
            
            this.showNotification('Pedido guardado localmente. Se sincronizará cuando haya conexión.', 'warning');
            
            return localOrder;
        }
    }

    // Obtener todos los pedidos (combinando locales y remotos)
    static async getAllOrders() {
        try {
            // Intentar obtener pedidos del servidor
            const response = await orderService.getAll();
            
            if (response.success) {
                // Combinar con pedidos locales no sincronizados
                const localOrders = this.getLocalOrders().filter(order => order.sync_status === 'pending');
                
                return {
                    remote: response.orders,
                    local: localOrders,
                    all: [...response.orders, ...localOrders]
                };
            }
        } catch (error) {
            console.error('Error obteniendo pedidos remotos:', error);
            
            // Si falla, devolver solo los locales
            return {
                remote: [],
                local: this.getLocalOrders(),
                all: this.getLocalOrders()
            };
        }
    }

    // Sincronizar pedidos locales con el servidor
    static async syncLocalOrders() {
        const localOrders = this.getLocalOrders().filter(order => order.sync_status === 'pending');
        
        for (const order of localOrders) {
            try {
                const response = await orderService.create(order);
                
                if (response.success) {
                    // Marcar como sincronizado
                    order.sync_status = 'synced';
                    order.remote_id = response.order.id;
                    this.updateLocalOrder(order);
                    
                    console.log(`Pedido ${order.order_number} sincronizado exitosamente`);
                }
            } catch (error) {
                console.error(`Error sincronizando pedido ${order.order_number}:`, error);
            }
        }
    }

    // Guardar pedido localmente
    static saveLocalOrder(order) {
        const orders = this.getLocalOrders();
        orders.push(order);
        localStorage.setItem('dharck_orders', JSON.stringify(orders));
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
        }
    }

    // Mostrar notificaciones
    static showNotification(message, type = 'info') {
        // Implementar sistema de notificaciones
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Aquí puedes integrar con tu sistema de notificaciones preferido
        // Por ejemplo: toast, alert, etc.
    }

    // Verificar conexión y sincronizar automáticamente
    static async autoSync() {
        try {
            // Verificar si hay conexión
            const response = await fetch('/api/health', { method: 'HEAD' });
            
            if (response.ok) {
                await this.syncLocalOrders();
            }
        } catch (error) {
            console.log('Sin conexión al servidor, trabajando offline');
        }
    }
}

// Auto-sincronizar cada 30 segundos si hay conexión
setInterval(() => {
    OrderService.autoSync();
}, 30000);

export default OrderService;