import React, { useState } from 'react';
import OrderService from '../services/OrderService';

const OrderForm = ({ product, game, onOrderComplete }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        player_id: '',
        payment_method: 'transferencia'
    });
    
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                product_id: product.id,
                game_id: game.id,
                base_price: product.base_price,
                currency: 'USD' // o la moneda seleccionada por el usuario
            };

            const order = await OrderService.createOrder(orderData);
            
            // Notificar al componente padre
            onOrderComplete(order);
            
            // Limpiar formulario
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                player_id: '',
                payment_method: 'transferencia'
            });

        } catch (error) {
            console.error('Error al crear pedido:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Nombre del Cliente *
                </label>
                <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    ID del Jugador *
                </label>
                <input
                    type="text"
                    required
                    value={formData.player_id}
                    onChange={(e) => setFormData({...formData, player_id: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            {/* Más campos... */}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Procesando...' : 'Crear Pedido'}
            </button>
        </form>
    );
};

export default OrderForm;