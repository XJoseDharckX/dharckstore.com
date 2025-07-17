import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

function PaymentsTab({ paymentMethods, updatePaymentMethods, countries }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);

  const openAddDialog = () => {
    setCurrentMethod(null);
    setIsAdding(true);
  };
  
  const openEditDialog = (method) => {
    setCurrentMethod(method);
    setIsEditing(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const methodData = {
      id: currentMethod ? currentMethod.id : Date.now(),
      name: formData.get('name'),
      details: formData.get('details'),
      countryCode: formData.get('countryCode'),
      iconName: 'CreditCard'
    };

    const updatedMethods = currentMethod
      ? paymentMethods.map(m => m.id === methodData.id ? methodData : m)
      : [...paymentMethods, methodData];

    updatePaymentMethods(updatedMethods);
    toast({ title: `Método de pago ${currentMethod ? 'actualizado' : 'agregado'}.` });
    setIsAdding(false);
    setIsEditing(false);
  };
  
  const handleDelete = (methodId) => {
    updatePaymentMethods(paymentMethods.filter(m => m.id !== methodId));
    toast({ title: "Método de pago eliminado." });
  };
  
  const PaymentDialog = () => (
    <Dialog open={isAdding || isEditing} onOpenChange={isEditing ? setIsEditing : setIsAdding}>
      <DialogTrigger asChild>
        <Button className="gamer-button" onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Método
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader><DialogTitle>{currentMethod ? 'Editar' : 'Agregar'} Método de Pago</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Nombre del Método</Label><Input name="name" defaultValue={currentMethod?.name} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>País</Label>
            <select name="countryCode" defaultValue={currentMethod?.countryCode} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div><Label>Detalles de Pago</Label><Textarea name="details" defaultValue={currentMethod?.details} required className="bg-gray-800 border-gray-600" placeholder="Ej: Banco: XYZ, Cuenta: 123-456, Titular: John Doe" /></div>
          <Button type="submit" className="w-full gamer-button">{currentMethod ? 'Actualizar' : 'Agregar'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Métodos de Pago</h2>
        <PaymentDialog />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="gamer-card rounded-lg p-4">
            <h3 className="font-bold mb-2">{method.name}</h3>
            <p className="text-sm text-gray-400">País: {countries.find(c => c.code === method.countryCode)?.name || 'N/A'}</p>
            <pre className="text-xs whitespace-pre-wrap bg-black/20 p-2 rounded-md my-2">{method.details}</pre>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(method)}><Edit className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => handleDelete(method.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default PaymentsTab;