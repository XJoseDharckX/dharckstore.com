import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Globe, MapPin } from 'lucide-react';

function CountrySelector({ countries, onCountrySelect }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = () => {
    if (selectedCountry) {
      onCountrySelect(selectedCountry);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-900 to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full gamer-card rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <Globe className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-4xl font-bold font-['Orbitron'] neon-text">
              DHARCK STORE
            </h1>
          </motion.div>
          <p className="text-xl text-gray-300 mb-2">
            Selecciona tu país para ver precios en tu moneda local
          </p>
          <p className="text-sm text-yellow-400">
            Los precios se mostrarán en {selectedCountry ? selectedCountry.currency : 'tu moneda local'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {countries.map((country) => (
            <motion.div
              key={country.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCountryClick(country)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedCountry?.code === country.code
                  ? 'neon-border bg-gradient-to-br from-yellow-400/20 to-purple-600/20'
                  : 'gamer-card hover:border-yellow-400/50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{country.flag}</div>
                <h3 className="font-semibold text-white">{country.name}</h3>
                <p className="text-sm text-gray-400">
                  {country.currency} ({country.symbol})
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedCountry}
            className="gamer-button px-8 py-3 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Continuar con {selectedCountry?.name || 'País Seleccionado'}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Puedes cambiar tu país en cualquier momento desde la configuración</p>
        </div>
      </motion.div>
    </div>
  );
}

export default CountrySelector;