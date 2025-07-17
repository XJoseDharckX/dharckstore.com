import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import getIcon from '@/lib/getIcon';

function GamesTab({ games, updateGames }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [fields, setFields] = useState([]);

  const openAddDialog = () => {
    setCurrentGame(null);
    setFields([{ id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }]);
    setIsAdding(true);
  };

  const openEditDialog = (game) => {
    setCurrentGame(game);
    setFields(game.fields || []);
    setIsEditing(true);
  };

  const handleAddField = () => {
    setFields([...fields, { id: '', label: '', placeholder: '', required: false }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  
  const handleFieldChange = (index, prop, value) => {
    const newFields = [...fields];
    newFields[index][prop] = value;
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gameData = {
      id: currentGame ? currentGame.id : formData.get('id').toLowerCase().replace(/\s+/g, '-'),
      name: formData.get('name'),
      description: formData.get('description'),
      iconName: formData.get('iconName'),
      color: formData.get('color'),
      fields: fields.map(f => ({
          ...f,
          id: f.label.toLowerCase().replace(/\s+/g, '-') // Auto-generate ID from label
      }))
    };

    if (currentGame) {
      updateGames(games.map(g => g.id === gameData.id ? gameData : g));
      toast({ title: "Juego actualizado", description: `Se actualizó ${gameData.name}.` });
      setIsEditing(false);
    } else {
      updateGames([...games, gameData]);
      toast({ title: "Juego agregado", description: `Se agregó ${gameData.name}.` });
      setIsAdding(false);
    }
    setCurrentGame(null);
  };

  const handleDelete = (gameId) => {
    updateGames(games.filter(g => g.id !== gameId));
    toast({ title: "Juego eliminado" });
  };
  
  const GameDialog = () => (
    <Dialog open={isAdding || isEditing} onOpenChange={isEditing ? setIsEditing : setIsAdding}>
      <DialogTrigger asChild>
        <Button className="gamer-button" onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Juego
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentGame ? 'Editar Juego' : 'Agregar Nuevo Juego'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!currentGame && <div><Label>ID del Juego (ej. nuevo-juego)</Label><Input name="id" required className="bg-gray-800 border-gray-600" /></div>}
          <div><Label>Nombre</Label><Input name="name" defaultValue={currentGame?.name} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>Descripción</Label><Input name="description" defaultValue={currentGame?.description} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>Nombre del Icono (Lucide)</Label><Input name="iconName" defaultValue={currentGame?.iconName} placeholder="Ej: Crown, Zap, Target" required className="bg-gray-800 border-gray-600" /></div>
          <div><Label>Color (Tailwind)</Label><Input name="color" defaultValue={currentGame?.color} placeholder="Ej: from-yellow-600 to-orange-600" required className="bg-gray-800 border-gray-600" /></div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Campos Requeridos del Jugador</h4>
            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-gray-800/50">
                <Input placeholder="Etiqueta (ej. Nombre de Usuario)" value={field.label} onChange={e => handleFieldChange(index, 'label', e.target.value)} className="bg-gray-700 border-gray-600" />
                <Input placeholder="Placeholder (ej. Ingresa tu nombre)" value={field.placeholder} onChange={e => handleFieldChange(index, 'placeholder', e.target.value)} className="bg-gray-700 border-gray-600" />
                <Label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={field.required} onChange={e => handleFieldChange(index, 'required', e.target.checked)} /> Obligatorio</Label>
                <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveField(index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={handleAddField}>Agregar Campo</Button>
          </div>
          
          <Button type="submit" className="w-full gamer-button">{currentGame ? 'Actualizar Juego' : 'Agregar Juego'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Juegos</h2>
        <GameDialog />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => {
          const Icon = getIcon(game.iconName);
          return (
            <div key={game.id} className="gamer-card rounded-lg p-4">
              <h3 className="font-bold mb-2 flex items-center"><Icon className="w-5 h-5 mr-2" />{game.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{game.description}</p>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(game)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => handleDelete(game.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default GamesTab;