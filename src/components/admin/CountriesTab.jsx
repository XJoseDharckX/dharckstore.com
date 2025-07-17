import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function CountriesTab({ countries, updateCountries }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);

  const handleAdd = (formData) => {
    const newCountry = {
      id: Date.now(),
      code: formData.get('code'),
      name: formData.get('name'),
      currency: formData.get('currency'),
      symbol: formData.get('symbol'),
      flag: formData.get('flag'),
      rate: parseFloat(formData.get('rate')),
    };
    updateCountries([...countries, newCountry]);
    toast({ title: "País agregado", description: `${newCountry.name} ha sido agregado.` });
    setIsAdding(false);
  };

  const handleEdit = (formData) => {
    const updatedCountry = {
      ...currentCountry,
      code: formData.get('code'),
      name: formData.get('name'),
      currency: formData.get('currency'),
      symbol: formData.get('symbol'),
      flag: formData.get('flag'),
      rate: parseFloat(formData.get('rate')),
    };
    updateCountries(countries.map(c => c.id === updatedCountry.id ? updatedCountry : c));
    toast({ title: "País actualizado", description: `${updatedCountry.name} ha sido actualizado.` });
    setIsEditing(false);
    setCurrentCountry(null);
  };

  const handleDelete = (countryId) => {
    updateCountries(countries.filter(c => c.id !== countryId));
    toast({ title: "País eliminado", description: `El país ha sido eliminado.` });
  };

  const openEditDialog = (country) => {
    setCurrentCountry(country);
    setIsEditing(true);
  };
  
  const FormDialog = ({ open, onOpenChange, onSubmit, country, title, buttonText }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {buttonText === "Agregar País" && (
          <Button className="gamer-button" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSubmit(formData);
        }} className="space-y-4">
          <div><Label htmlFor="code">Código (ej. US)</Label><Input name="code" defaultValue={country?.code} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label htmlFor="name">Nombre</Label><Input name="name" defaultValue={country?.name} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label htmlFor="currency">Moneda (ej. USD)</Label><Input name="currency" defaultValue={country?.currency} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label htmlFor="symbol">Símbolo (ej. $)</Label><Input name="symbol" defaultValue={country?.symbol} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label htmlFor="flag">Bandera (emoji)</Label><Input name="flag" defaultValue={country?.flag} required className="bg-gray-800 border-gray-600" /></div>
          <div><Label htmlFor="rate">Tasa de Cambio (a USD)</Label><Input name="rate" type="number" step="0.01" defaultValue={country?.rate} required className="bg-gray-800 border-gray-600" /></div>
          <Button type="submit" className="w-full gamer-button">{title}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Países</h2>
        <FormDialog open={isAdding} onOpenChange={setIsAdding} onSubmit={handleAdd} title="Agregar Nuevo País" buttonText="Agregar País" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <div key={country.id} className="gamer-card rounded-lg p-4">
            <h3 className="font-bold mb-2 flex items-center">{country.flag} {country.name}</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Código:</span> {country.code}</p>
              <p><span className="text-gray-400">Moneda:</span> {country.currency} ({country.symbol})</p>
              <p><span className="text-gray-400">Tasa:</span> {country.rate}</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(country)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => handleDelete(country.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {currentCountry && <FormDialog open={isEditing} onOpenChange={setIsEditing} onSubmit={handleEdit} country={currentCountry} title="Editar País" buttonText="Editar País" />}
    </motion.div>
  );
}

export default CountriesTab;