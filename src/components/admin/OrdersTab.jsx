import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Trash2, Eye, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '../../config/api.js';

function OrdersTab({ orders, updateData, refreshOrders, loading, getOrderStats }) {
  const [updating, setUpdating] = useState(false);
  
  const statusClasses = {
    pending: 'status-pending',
    completed: 'status-sent',
    cancelled: 'status-cancelled',
  };
  
  const statusLabels = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const getStatusBadge = (status) => (
    <span className={`order-status ${statusClasses[status]} flex items-center gap-1`}>
      {statusIcons[status]}
      {statusLabels[status]}
    </span>
  );

  // Actualizar estado del pedido en la API
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      console.log(`🔄 Actualizando pedido ${orderId} a estado: ${newStatus}`);
      
      const response = await orderService.updateStatus(orderId, newStatus);
      
      if (response.success) {
        // Refrescar la lista de pedidos
        await refreshOrders();
        
        toast({ 
          title: "✅ Estado actualizado", 
          description: `Pedido #${orderId} ahora está ${statusLabels[newStatus]}.` 
        });
        
        console.log(`✅ Pedido ${orderId} actualizado exitosamente`);
      } else {
        throw new Error(response.message || 'Error actualizando el pedido');
      }
    } catch (error) {
      console.error('❌ Error actualizando estado del pedido:', error);
      toast({ 
        title: "❌ Error", 
        description: `No se pudo actualizar el pedido: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  // Eliminar pedido (solo marcar como cancelado)
  const deleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      return;
    }
    
    await updateStatus(orderId, 'cancelled');
  };

  // Obtener estadísticas
  const stats = getOrderStats();

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="admin-panel rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Gestión de Pedidos</h2>
        <div className="flex items-center gap-4">
          <Button 
            onClick={refreshOrders} 
            disabled={loading || updating}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="gamer-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="gamer-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-400">Pendientes</div>
        </div>
        <div className="gamer-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completados</div>
        </div>
        <div className="gamer-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Ingresos</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay pedidos aún.</p>
            <Button onClick={refreshOrders} className="mt-4" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar nuevos pedidos
            </Button>
          </div>
        ) : (
          orders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((order) => {
              const createdAt = new Date(order.created_at);
              const formattedDate = createdAt.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order.id} className="gamer-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold">#{order.id}</span>
                      {getStatusBadge(order.status)}
                      <span className="text-sm text-gray-400">{formattedDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateStatus(order.id, 'completed')} 
                        disabled={updating || order.status === 'completed'}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => updateStatus(order.id, 'cancelled')} 
                        disabled={updating || order.status === 'cancelled'}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => deleteOrder(order.id)} 
                        disabled={updating}
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Cliente:</span>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                      {order.customer_phone && (
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Juego:</span>
                      <p className="font-medium">{order.game_name || `Game ID: ${order.game_id}`}</p>
                      <span className="text-gray-400">ID Jugador:</span>
                      <p className="text-xs">{order.player_id}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Producto:</span>
                      <p className="font-medium">{order.product_name || `Product ID: ${order.product_id}`}</p>
                      <span className="text-gray-400">Precio:</span>
                      <p className="text-yellow-400 font-bold">
                        {order.currency} {parseFloat(order.final_price).toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Pago:</span>
                      <p className="font-medium">{order.payment_method}</p>
                      {order.payment_proof_url && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex items-center gap-2 mt-1">
                              <Eye className="w-4 h-4"/> Ver Comprobante
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Comprobante Pedido #{order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-96 overflow-auto">
                              <img 
                                src={order.payment_proof_url} 
                                alt="Comprobante de pago" 
                                className="max-w-full h-auto rounded-md" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div style={{display: 'none'}} className="text-center py-8 text-gray-500">
                                No se pudo cargar la imagen del comprobante
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  {order.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">Notas:</span>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </motion.div>
  );
}

export default OrdersTab;