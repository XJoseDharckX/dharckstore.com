import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

function ItemsTab({ items, updateItems, games, ranks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [rankProfits, setRankProfits] = useState({});

  const openAddDialog = () => {
    setCurrentItem(null);
    setRankProfits({});
    setIsAdding(true);
  };

  const openEditDialog = (item) => {
    setCurrentItem(item);
    setRankProfits(item.rankProfits || {});
    setIsEditing(true);
  };
  
  const handleRankProfitChange = (rankId, value) => {
    setRankProfits(prev => ({ ...prev, [rankId]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      id: currentItem ? currentItem.id : Date.now(),
      gameId: formData.get('gameId'),
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      imageUrl: formData.get('imageUrl'),
      rankProfits: rankProfits,
    };

    const updatedItems = currentItem
      ? items.map(i => (i.id === itemData.id ? itemData : i))
      : [...items, itemData];
    
    updateItems(updatedItems);
    toast({ title: `Artículo ${currentItem ? 'actualizado' : 'agregado'}`, description: `${itemData.name} fue ${currentItem ? 'actualizado' : 'agregado'}.` });
    
    setIsAdding(false);
    setIsEditing(false);
    setCurrentItem(null);
  };
  
  const handleDelete = (itemId) => {
    updateItems(items.filter(i => i.id !== itemId));
    toast({ title: "Artículo eliminado" });
  };
  
  const ItemDialog = () => (
    <Dialog open={isAdding || isEditing} onOpenChange={isEditing ? setIsEditing : setIsAdding}>
      <DialogTrigger asChild>
        <Button className="gamer-button" onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Artículo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader><DialogTitle>{currentItem ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select name="gameId" defaultValue={currentItem?.gameId} required>
            <SelectTrigger><SelectValue placeholder="Selecciona un juego..." /></SelectTrigger>
            <SelectContent>{games.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
          </Select>
          <div><Label>Nombre</Label><Input name="name" defaultValue={currentItem?.name} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>Precio (USD)</Label><Input name="price" type="number" step="0.01" defaultValue={currentItem?.price} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>URL de Imagen (Opcional)</Label><Input name="imageUrl" defaultValue={currentItem?.imageUrl} className="bg-gray-800 border-gray-600" /></div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Ganancias por Rango de Vendedor (USD)</h4>
            {ranks.map(rank => (
              <div key={rank.id}>
                <Label>{rank.name}</Label>
                <Input 
                  type="number" step="0.01" 
                  placeholder={`Ganancia para ${rank.name}`}
                  value={rankProfits[rank.id] || ''}
                  onChange={(e) => handleRankProfitChange(rank.id, e.target.value)}
                  className="bg-gray-800 border-gray-600" 
                />
              </div>
            ))}
          </div>
          
          <Button type="submit" className="w-full gamer-button">{currentItem ? 'Actualizar' : 'Agregar'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Artículos</h2>
        <ItemDialog />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="gamer-card rounded-lg p-4 flex flex-col justify-between">
            <div>
              {item.imageUrl && <img  src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2" src="https://images.unsplash.com/photo-1696457848608-2bec59080f62" />}
              <h3 className="font-bold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-400 mb-1">Juego: {games.find(g => g.id === item.gameId)?.name}</p>
              <p className="text-lg font-semibold text-yellow-400">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(item)}><Edit className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ItemsTab;