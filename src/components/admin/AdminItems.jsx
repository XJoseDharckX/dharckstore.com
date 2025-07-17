import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { initialItems, initialGames, initialRanks } from '@/lib/data';

function AdminItems() {
  const [items, setItems] = useLocalStorage('items', initialItems);
  const [games] = useLocalStorage('games', initialGames);
  const [ranks] = useLocalStorage('ranks', initialRanks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profitByRank = {};
    ranks.forEach(rank => {
        profitByRank[rank.id] = parseFloat(formData.get(`profit-${rank.id}`)) || 0;
    });

    const newItemData = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      gameId: formData.get('gameId'),
      image: formData.get('image'),
      profitByRank,
    };

    if (currentItem) {
      setItems(items.map(item => item.id === currentItem.id ? { ...item, ...newItemData } : item));
      toast({ title: "Artículo actualizado" });
    } else {
      setItems([...items, { id: `item-${Date.now()}`, ...newItemData }]);
      toast({ title: "Artículo agregado" });
    }
    closeDialog();
  };

  const openDialog = (item = null) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setCurrentItem(null);
    setIsDialogOpen(false);
  };

  const deleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
    toast({ title: "Artículo eliminado" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Artículos</h2>
        <Button className="gamer-button" onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Artículo
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No hay artículos disponibles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="gamer-card rounded-lg p-4 flex flex-col justify-between">
              <div>
                {item.image && <img  src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-md mb-2" src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />}
                <h3 className="font-bold mb-2">{item.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">Juego:</span> {games.find(g => g.id === item.gameId)?.name || 'N/A'}</p>
                  <p><span className="text-gray-400">Precio:</span> ${item.price.toFixed(2)}</p>
                  <div>
                    <p className="text-gray-400">Ganancias por Rango:</p>
                    {ranks.map(rank => (
                        <p key={rank.id} className="pl-2"><span className="capitalize">{rank.name}:</span> {item.profitByRank?.[rank.id] || 0}%</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openDialog(item)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Editar' : 'Agregar'} Artículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input name="name" defaultValue={currentItem?.name} required className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label htmlFor="price">Precio (USD)</Label>
              <Input name="price" type="number" step="0.01" defaultValue={currentItem?.price} required className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label htmlFor="gameId">Juego</Label>
              <Select name="gameId" defaultValue={currentItem?.gameId}>
                <SelectTrigger className="bg-gray-800 border-gray-600"><SelectValue placeholder="Selecciona un juego" /></SelectTrigger>
                <SelectContent>
                  {games.map(game => <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input name="image" defaultValue={currentItem?.image} placeholder="https://example.com/image.png" className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label>Ganancia por Rango (%)</Label>
              <div className="space-y-2 mt-2">
                {ranks.map(rank => (
                  <div key={rank.id} className="flex items-center space-x-2">
                    <Label htmlFor={`profit-${rank.id}`} className="w-20 capitalize">{rank.name}</Label>
                    <Input id={`profit-${rank.id}`} name={`profit-${rank.id}`} type="number" step="0.1" defaultValue={currentItem?.profitByRank?.[rank.id] || ''} placeholder="%" className="bg-gray-800 border-gray-600" />
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full gamer-button">Guardar Cambios</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminItems;