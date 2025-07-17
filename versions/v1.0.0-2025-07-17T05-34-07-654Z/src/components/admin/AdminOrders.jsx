import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';

function AdminOrders({ orders, setOrders }) {

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      sent: 'status-sent',
      cancelled: 'status-cancelled'
    };
    const statusLabels = {
      pending: 'Pendiente',
      sent: 'Enviado',
      cancelled: 'Cancelado'
    };
    return (
      <span className={`order-status ${statusClasses[status]}`}>
        {statusLabels[status] || 'Desconocido'}
      </span>
    );
  };
  
  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };
  
  const deleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.id !== orderId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold">Gestión de Pedidos</h3>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No hay pedidos pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="gamer-card rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Pedido #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div><span className="font-semibold text-gray-400">Juego:</span> {order.game}</div>
                  <div><span className="font-semibold text-gray-400">Artículo:</span> {order.item.name}</div>
                  <div><span className="font-semibold text-gray-400">Vendedor:</span> {order.seller.name}</div>
                  <div><span className="font-semibold text-gray-400">País:</span> {order.country.name}</div>
              </div>
              
              <div>
                <p className="font-semibold text-gray-400 text-sm">Datos del jugador:</p>
                <div className="text-sm pl-4">
                  {Object.entries(order.playerData).map(([key, value]) => (
                    <p key={key}><span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}</p>
                  ))}
                </div>
              </div>
              
              {order.paymentProof && (
                <div>
                  <p className="font-semibold text-gray-400 text-sm">Comprobante:</p>
                  <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    Ver comprobante
                  </a>
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(order.id, 'sent')}><Check className="w-4 h-4 mr-1" /> Marcar Enviado</Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => updateOrderStatus(order.id, 'cancelled')}><X className="w-4 h-4 mr-1" /> Cancelar</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteOrder(order.id)}><Trash2 className="w-4 h-4 mr-1" /> Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AdminOrders;