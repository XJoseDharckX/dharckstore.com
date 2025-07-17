import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function AdminSellers({ sellers, setSellers, sellerRanks, setSellerRanks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [newRankName, setNewRankName] = useState('');

  const openNewSellerModal = () => {
    setEditingSeller({
      id: `new-${Date.now()}`,
      name: '',
      whatsapp: '',
      rank: sellerRanks[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditSellerModal = (seller) => {
    setEditingSeller(seller);
    setIsModalOpen(true);
  };

  const handleSaveSeller = () => {
    if (sellers.some(s => s.id === editingSeller.id)) {
      setSellers(sellers.map(s => s.id === editingSeller.id ? editingSeller : s));
    } else {
      setSellers([...sellers, editingSeller]);
    }
    setIsModalOpen(false);
    setEditingSeller(null);
  };

  const handleDeleteSeller = (sellerId) => {
    setSellers(sellers.filter(s => s.id !== sellerId));
  };
  
  const handleAddRank = () => {
    if (newRankName.trim()) {
      const newRankId = newRankName.toLowerCase().replace(/\s+/g, '-');
      setSellerRanks([...sellerRanks, { id: newRankId, name: newRankName }]);
      setNewRankName('');
    }
  };
  
  const handleDeleteRank = (rankId) => {
    setSellerRanks(sellerRanks.filter(r => r.id !== rankId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Gestión de Vendedores</h3>
          <Button onClick={openNewSellerModal} className="gamer-button">
            <Plus className="w-4 h-4 mr-2" /> Agregar Vendedor
          </Button>
        </div>
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div key={seller.id} className="gamer-card rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{seller.name}</p>
                <p className="text-sm text-gray-400">WhatsApp: {seller.whatsapp}</p>
                <p className="text-xs text-yellow-400 capitalize">Rango: {seller.rank}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditSellerModal(seller)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteSeller(seller.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Rangos de Vendedor</h3>
        <div className="space-y-2">
            {sellerRanks.map(rank => (
                <div key={rank.id} className="flex justify-between items-center gamer-card p-2 rounded-md">
                    <p>{rank.name}</p>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRank(rank.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <Input 
                value={newRankName}
                onChange={(e) => setNewRankName(e.target.value)}
                placeholder="Nuevo rango..."
                className="bg-gray-800 border-gray-600"
            />
            <Button onClick={handleAddRank}>
                <Plus className="w-4 h-4" />
            </Button>
        </div>
      </div>
      
      {editingSeller && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle>{sellers.some(s => s.id === editingSeller.id) ? 'Editar' : 'Agregar'} Vendedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input value={editingSeller.name} onChange={(e) => setEditingSeller(s => ({...s, name: e.target.value}))} className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={editingSeller.whatsapp} onChange={(e) => setEditingSeller(s => ({...s, whatsapp: e.target.value}))} className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label>Rango</Label>
                <Select value={editingSeller.rank} onValueChange={(val) => setEditingSeller(s => ({...s, rank: val}))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sellerRanks.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveSeller} className="w-full gamer-button">Guardar Cambios</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}

export default AdminSellers;