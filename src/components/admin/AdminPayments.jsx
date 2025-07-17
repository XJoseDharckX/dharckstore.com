import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function AdminPayments({ paymentMethods, setPaymentMethods, countries }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const openNewPaymentModal = () => {
    setEditingPayment({
      id: `new-${Date.now()}`,
      name: '',
      countryCode: countries[0]?.code || '',
      details: '',
    });
    setIsModalOpen(true);
  };

  const openEditPaymentModal = (method) => {
    setEditingPayment(method);
    setIsModalOpen(true);
  };
  
  const handleSavePayment = () => {
    if (paymentMethods.some(p => p.id === editingPayment.id)) {
      setPaymentMethods(paymentMethods.map(p => p.id === editingPayment.id ? editingPayment : p));
    } else {
      setPaymentMethods([...paymentMethods, editingPayment]);
    }
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleDeletePayment = (paymentId) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== paymentId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gestión de Métodos de Pago</h3>
        <Button onClick={openNewPaymentModal} className="gamer-button">
          <Plus className="w-4 h-4 mr-2" /> Agregar Método
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="gamer-card rounded-lg p-4">
            <h4 className="font-bold">{method.name}</h4>
            <p className="text-sm text-gray-400">País: {countries.find(c => c.code === method.countryCode)?.name}</p>
            <pre className="text-xs whitespace-pre-wrap font-sans bg-black/20 p-2 rounded-md mt-2">{method.details}</pre>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => openEditPaymentModal(method)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeletePayment(method.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingPayment && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle>{paymentMethods.some(p => p.id === editingPayment.id) ? 'Editar' : 'Agregar'} Método de Pago</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>País</Label>
                <Select value={editingPayment.countryCode} onValueChange={(val) => setEditingPayment(p => ({...p, countryCode: val}))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nombre del Método</Label>
                <Input value={editingPayment.name} onChange={(e) => setEditingPayment(p => ({...p, name: e.target.value}))} className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label>Detalles de Pago</Label>
                <Textarea value={editingPayment.details} onChange={(e) => setEditingPayment(p => ({...p, details: e.target.value}))} className="bg-gray-800 border-gray-600" rows={4} />
              </div>
              <Button onClick={handleSavePayment} className="w-full gamer-button">Guardar Cambios</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}

export default AdminPayments;