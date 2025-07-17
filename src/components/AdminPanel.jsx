import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';

const AdminPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const orderData = await OrderService.getAllOrders();
            setOrders(orderData.all);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    if (loading) {
        return <div className="text-center py-8">Cargando pedidos...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>
            
            {/* Filtros */}
            <div className="mb-4">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-md border-gray-300"
                >
                    <option value="all">Todos los pedidos</option>
                    <option value="pending">Pendientes</option>
                    <option value="processing">En proceso</option>
                    <option value="completed">Completados</option>
                    <option value="cancelled">Cancelados</option>
                </select>
            </div>

            {/* Lista de pedidos */}
            <div className="grid gap-4">
                {filteredOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">#{order.order_number}</h3>
                                <p className="text-gray-600">{order.customer_name}</p>
                                <p className="text-sm text-gray-500">ID: {order.player_id}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {order.status}
                                </span>
                                <p className="text-lg font-bold mt-1">
                                    ${order.local_price} {order.currency}
                                </p>
                            </div>
                        </div>
                        
                        {order.sync_status === 'pending' && (
                            <div className="mt-2 text-orange-600 text-sm">
                                ⚠️ Pendiente de sincronización
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;