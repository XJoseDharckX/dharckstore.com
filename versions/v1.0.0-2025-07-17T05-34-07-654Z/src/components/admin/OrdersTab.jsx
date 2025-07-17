import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Trash2, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function OrdersTab({ orders, updateOrders, items, sellers }) {
  const statusClasses = {
    pending: 'status-pending',
    sent: 'status-sent',
    cancelled: 'status-cancelled',
  };
  const statusLabels = {
    pending: 'Pendiente',
    sent: 'Enviado',
    cancelled: 'Cancelado',
  };

  const getStatusBadge = (status) => (
    <span className={`order-status ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        if (newStatus === 'sent' && order.status !== 'sent') {
          // Add profit to seller
          const item = items.find(i => i.id === order.itemId);
          const seller = sellers.find(s => s.id === order.sellerId);
          if (item && seller) {
            const rankProfit = item.rankProfits?.[seller.rankId] || 0;
            const updatedSellers = sellers.map(s => s.id === seller.id ? { ...s, earnings: (s.earnings || 0) + rankProfit } : s);
            localStorage.setItem('sellers', JSON.stringify(updatedSellers)); // This should be handled by a global state updater
          }
        }
        return { ...order, status: newStatus };
      }
      return order;
    });
    updateOrders(updatedOrders);
    toast({ title: "Estado actualizado", description: `Pedido #${orderId} ahora está ${statusLabels[newStatus]}.` });
  };

  const deleteOrder = (orderId) => {
    updateOrders(orders.filter(order => order.id !== orderId));
    toast({ title: "Pedido eliminado" });
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Pedidos</h2>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay pedidos aún.</p>
        ) : (
          orders.map((order) => {
            const item = items.find(i => i.id === order.itemId);
            const prices = {
                local: (item?.price * order.country.rate).toFixed(2),
                usd: item?.price.toFixed(2)
            };

            return (
              <div key={order.id} className="gamer-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold">#{order.id}</span>
                    {getStatusBadge(order.status)}
                    <span className="text-sm text-gray-400">{new Date(order.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => updateStatus(order.id, 'sent')} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={() => updateStatus(order.id, 'cancelled')} className="bg-orange-600 hover:bg-orange-700"><X className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={() => deleteOrder(order.id)} variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-400">Juego:</span><p>{order.gameName}</p></div>
                  <div><span className="text-gray-400">Artículo:</span><p>{item?.name}</p></div>
                  <div><span className="text-gray-400">Precio:</span><p className="text-yellow-400">{order.country.symbol}{prices.local} (${prices.usd})</p></div>
                  <div>
                    <span className="text-gray-400">Comprobante:</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex items-center gap-2"><Eye className="w-4 h-4"/> Ver Comprobante</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader><DialogTitle>Comprobante Pedido #{order.id}</DialogTitle></DialogHeader>
                        <img src={order.paymentProofUrl} alt="Comprobante de pago" className="max-w-full h-auto rounded-md" />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default OrdersTab;