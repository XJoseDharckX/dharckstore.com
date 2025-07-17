import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Gamepad, X } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { initialGames } from '@/lib/data';

function AdminGames() {
  const [games, setGames] = useLocalStorage('games', initialGames);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [fields, setFields] = useState([]);

  const handleSaveGame = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGameData = {
      name: formData.get('name'),
      description: formData.get('description'),
      image: formData.get('image'),
      fields: fields,
    };

    if (currentGame) {
      setGames(games.map(g => g.id === currentGame.id ? { ...g, ...newGameData } : g));
      toast({ title: "Juego actualizado" });
    } else {
      setGames([...games, { id: `game-${Date.now()}`, icon: { name: 'Gamepad' }, ...newGameData }]);
      toast({ title: "Juego agregado" });
    }
    closeDialog();
  };

  const openDialog = (game = null) => {
    setCurrentGame(game);
    setFields(game ? game.fields : [{ id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }]);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setCurrentGame(null);
    setIsDialogOpen(false);
  };

  const deleteGame = (gameId) => {
    setGames(games.filter(g => g.id !== gameId));
    toast({ title: "Juego eliminado" });
  };

  const addField = () => {
    setFields([...fields, { id: `field-${Date.now()}`, label: '', placeholder: '', required: false }]);
  };

  const handleFieldChange = (index, e) => {
    const newFields = [...fields];
    newFields[index][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields(newFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Juegos</h2>
        <Button className="gamer-button" onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Juego
        </Button>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Gamepad className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No hay juegos disponibles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {games.map((game) => (
            <div key={game.id} className="gamer-card rounded-lg p-4">
              <h3 className="font-bold mb-2">{game.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{game.description}</p>
              <p className="text-sm font-semibold">Campos Requeridos:</p>
              <ul className="list-disc list-inside text-sm">
                {game.fields.map(field => <li key={field.id}>{field.label} {field.required && '(Obligatorio)'}</li>)}
              </ul>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openDialog(game)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => deleteGame(game.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentGame ? 'Editar' : 'Agregar'} Juego</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGame} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
            <div>
              <Label htmlFor="name">Nombre del Juego</Label>
              <Input name="name" defaultValue={currentGame?.name} required className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input name="description" defaultValue={currentGame?.description} className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input name="image" defaultValue={currentGame?.image} className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label>Campos del Jugador</Label>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-end space-x-2 p-2 border border-gray-700 rounded-md">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input name="label" value={field.label} onChange={(e) => handleFieldChange(index, e)} placeholder="Etiqueta (ej. ID Jugador)" className="bg-gray-800 border-gray-600" />
                      <Input name="placeholder" value={field.placeholder} onChange={(e) => handleFieldChange(index, e)} placeholder="Placeholder (ej. Ingresa tu ID)" className="bg-gray-800 border-gray-600" />
                      <div className="col-span-2 flex items-center space-x-2">
                        <input type="checkbox" name="required" checked={field.required} onChange={(e) => handleFieldChange(index, e)} className="accent-yellow-400" />
                        <Label>Obligatorio</Label>
                      </div>
                    </div>
                    <Button type="button" size="icon" variant="destructive" onClick={() => removeField(index)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addField} className="mt-2">Agregar Campo</Button>
            </div>
            <Button type="submit" className="w-full gamer-button">Guardar Cambios</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminGames;