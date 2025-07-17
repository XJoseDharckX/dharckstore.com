import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { initialCountries } from '@/lib/data';

function AdminCountries() {
  const [countries, setCountries] = useLocalStorage('countries', initialCountries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);

  const handleSaveCountry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCountryData = {
      code: formData.get('code'),
      name: formData.get('name'),
      currency: formData.get('currency'),
      symbol: formData.get('symbol'),
      flag: formData.get('flag'),
      rate: parseFloat(formData.get('rate')),
    };

    if (currentCountry) {
      setCountries(countries.map(c => c.code === currentCountry.code ? newCountryData : c));
      toast({ title: "País actualizado" });
    } else {
      setCountries([...countries, newCountryData]);
      toast({ title: "País agregado" });
    }
    closeDialog();
  };

  const openDialog = (country = null) => {
    setCurrentCountry(country);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setCurrentCountry(null);
    setIsDialogOpen(false);
  };

  const deleteCountry = (countryCode) => {
    setCountries(countries.filter(c => c.code !== countryCode));
    toast({ title: "País eliminado" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Países y Tasas</h2>
        <Button className="gamer-button" onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Agregar País
        </Button>
      </div>

      {countries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No hay países disponibles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries.map((country) => (
            <div key={country.code} className="gamer-card rounded-lg p-4">
              <h3 className="font-bold mb-2">{country.flag} {country.name} ({country.code})</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Moneda:</span> {country.currency} ({country.symbol})</p>
                <p><span className="text-gray-400">Tasa vs USD:</span> {country.rate}</p>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openDialog(country)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500" onClick={() => deleteCountry(country.code)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{currentCountry ? 'Editar' : 'Agregar'} País</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCountry} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input name="name" defaultValue={currentCountry?.name} required className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label htmlFor="code">Código (2 letras)</Label>
                <Input name="code" defaultValue={currentCountry?.code} required maxLength="2" disabled={!!currentCountry} className="bg-gray-800 border-gray-600 disabled:opacity-50" />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Input name="currency" defaultValue={currentCountry?.currency} required className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label htmlFor="symbol">Símbolo</Label>
                <Input name="symbol" defaultValue={currentCountry?.symbol} required className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label htmlFor="flag">Bandera (emoji)</Label>
                <Input name="flag" defaultValue={currentCountry?.flag} required className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label htmlFor="rate">Tasa vs USD</Label>
                <Input name="rate" type="number" step="any" defaultValue={currentCountry?.rate} required className="bg-gray-800 border-gray-600" />
              </div>
            </div>
            <Button type="submit" className="w-full gamer-button">Guardar Cambios</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminCountries;