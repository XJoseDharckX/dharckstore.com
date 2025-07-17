import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

function SellersTab({ sellers, updateSellers, ranks, updateRanks }) {
  const [isAddingSeller, setIsAddingSeller] = useState(false);
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  
  const [isManagingRanks, setIsManagingRanks] = useState(false);
  
  const openAddSellerDialog = () => {
    setCurrentSeller(null);
    setIsAddingSeller(true);
  };

  const openEditSellerDialog = (seller) => {
    setCurrentSeller(seller);
    setIsEditingSeller(true);
  };
  
  const handleSellerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const sellerData = {
      id: currentSeller ? currentSeller.id : Date.now(),
      name: formData.get('name'),
      whatsapp: formData.get('whatsapp'),
      rankId: parseInt(formData.get('rankId')),
      earnings: currentSeller ? currentSeller.earnings : 0,
    };
    
    const updatedSellers = currentSeller
      ? sellers.map(s => s.id === sellerData.id ? sellerData : s)
      : [...sellers, sellerData];

    updateSellers(updatedSellers);
    toast({ title: `Vendedor ${currentSeller ? 'actualizado' : 'agregado'}` });
    setIsAddingSeller(false);
    setIsEditingSeller(false);
  };

  const handleDeleteSeller = (sellerId) => {
    updateSellers(sellers.filter(s => s.id !== sellerId));
    toast({ title: "Vendedor eliminado" });
  };
  
  const handleRankSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const newRank = { id: Date.now(), name };
      updateRanks([...ranks, newRank]);
      e.target.reset();
  };

  const handleDeleteRank = (rankId) => {
      updateRanks(ranks.filter(r => r.id !== rankId));
  };
  
  const SellerDialog = () => (
    <Dialog open={isAddingSeller || isEditingSeller} onOpenChange={isEditingSeller ? setIsEditingSeller : setIsAddingSeller}>
      <DialogTrigger asChild>
        <Button className="gamer-button" onClick={openAddSellerDialog}><Plus className="w-4 h-4 mr-2" />Agregar Vendedor</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader><DialogTitle>{currentSeller ? 'Editar' : 'Agregar'} Vendedor</DialogTitle></DialogHeader>
        <form onSubmit={handleSellerSubmit} className="space-y-4">
          <div><Label>Nombre</Label><Input name="name" defaultValue={currentSeller?.name} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>WhatsApp</Label><Input name="whatsapp" defaultValue={currentSeller?.whatsapp} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>Rango</Label>
            <Select name="rankId" defaultValue={currentSeller?.rankId?.toString()} required>
              <SelectTrigger><SelectValue placeholder="Selecciona un rango..." /></SelectTrigger>
              <SelectContent>{ranks.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full gamer-button">{currentSeller ? 'Actualizar' : 'Agregar'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
  
  const RanksDialog = () => (
      <Dialog open={isManagingRanks} onOpenChange={setIsManagingRanks}>
          <DialogTrigger asChild>
              <Button variant="outline"><DollarSign className="w-4 h-4 mr-2" />Gestionar Rangos</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader><DialogTitle>Gestionar Rangos de Vendedores</DialogTitle></DialogHeader>
              <div className="space-y-4">
                  <form onSubmit={handleRankSubmit} className="flex gap-2">
                      <Input name="name" placeholder="Nombre del nuevo rango" required className="bg-gray-800 border-gray-600" />
                      <Button type="submit"><Plus className="w-4 h-4" /></Button>
                  </form>
                  <div className="space-y-2">
                      {ranks.map(rank => (
                          <div key={rank.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                              <span>{rank.name}</span>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteRank(rank.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                      ))}
                  </div>
              </div>
          </DialogContent>
      </Dialog>
  )

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Vendedores</h2>
        <div className="flex gap-2">
          <RanksDialog />
          <SellerDialog />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sellers.map((seller) => (
          <div key={seller.id} className="gamer-card rounded-lg p-4">
            <h3 className="font-bold mb-2">{seller.name}</h3>
            <p className="text-sm text-gray-400">WhatsApp: {seller.whatsapp}</p>
            <p className="text-sm text-gray-400">Rango: {ranks.find(r => r.id === seller.rankId)?.name || 'N/A'}</p>
            <p className="text-lg font-semibold text-green-400">Ganancias: ${seller.earnings?.toFixed(2) || '0.00'}</p>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditSellerDialog(seller)}><Edit className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => handleDeleteSeller(seller.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default SellersTab;