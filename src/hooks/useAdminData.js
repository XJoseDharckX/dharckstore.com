import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const initialData = {
  games: [
    {
      id: 'lords-mobile',
      name: 'Lords Mobile',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true },
        { id: 'castleName', label: 'Nombre del Castillo', placeholder: 'Nombre de tu castillo', required: true }
      ]
    },
    {
      id: 'blood-strike',
      name: 'Blood Strike',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
      ]
    },
    {
      id: 'free-fire',
      name: 'Free Fire',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
      ]
    }
  ],
  items: [
    { id: 'lm1', gameId: 'lords-mobile', name: '209💎', price: 2.30, profits: { default: 0.2 }, image: '' },
    { id: 'lm2', gameId: 'lords-mobile', name: '524💎', price: 5.20, profits: { default: 0.5 }, image: '' },
    { id: 'lm3', gameId: 'lords-mobile', name: '1048💎', price: 10.00, profits: { default: 1.0 }, image: '' },
    { id: 'lm4', gameId: 'lords-mobile', name: '2096💎', price: 19.50, profits: { default: 1.95 }, image: '' },
    { id: 'lm5', gameId: 'lords-mobile', name: '3144💎', price: 29.00, profits: { default: 2.9 }, image: '' },
    { id: 'lm6', gameId: 'lords-mobile', name: '5240💎', price: 48.00, profits: { default: 4.8 }, image: '' },
    { id: 'lm7', gameId: 'lords-mobile', name: '6812💎', price: 62.00, profits: { default: 6.2 }, image: '' },
    { id: 'lm8', gameId: 'lords-mobile', name: '9956💎', price: 92.00, profits: { default: 9.2 }, image: '' },
    { id: 'lm9', gameId: 'lords-mobile', name: '19912💎', price: 178.00, profits: { default: 17.8 }, image: '' },
    { id: 'lm10', gameId: 'lords-mobile', name: '30392💎', price: 270.00, profits: { default: 27.0 }, image: '' },
    { id: 'lm11', gameId: 'lords-mobile', name: '50304💎', price: 440.00, profits: { default: 44.0 }, image: '' },

    { id: 'bs1', gameId: 'blood-strike', name: '100 + 5 oros', price: 0.89, profits: { default: 0.1 }, image: '' },
    { id: 'bs2', gameId: 'blood-strike', name: '300 + 20 oros', price: 2.80, profits: { default: 0.28 }, image: '' },
    { id: 'bs3', gameId: 'blood-strike', name: '500 + 40 oros', price: 4.60, profits: { default: 0.46 }, image: '' },
    { id: 'bs4', gameId: 'blood-strike', name: '1000 + 100 oros', price: 8.50, profits: { default: 0.85 }, image: '' },
    { id: 'bs5', gameId: 'blood-strike', name: '2000 + 260 oros', price: 18.00, profits: { default: 1.8 }, image: '' },
    { id: 'bs6', gameId: 'blood-strike', name: '5000 + 800 oros', price: 42.00, profits: { default: 4.2 }, image: '' },
    { id: 'bs7', gameId: 'blood-strike', name: 'Pase de ataque élite', price: 4.00, profits: { default: 0.4 }, image: '' },
    { id: 'bs8', gameId: 'blood-strike', name: 'Pase de ataque premium', price: 8.50, profits: { default: 0.85 }, image: '' },
    { id: 'bs9', gameId: 'blood-strike', name: 'pase de subida de nivel', price: 2.00, profits: { default: 0.2 }, image: '' },
    
    { id: 'ff1', gameId: 'free-fire', name: '100+10💎', price: 0.89, profits: { default: 0.1 }, image: '' },
    { id: 'ff2', gameId: 'free-fire', name: '200+20💎', price: 1.90, profits: { default: 0.19 }, image: '' },
    { id: 'ff3', gameId: 'free-fire', name: '310+31💎', price: 2.80, profits: { default: 0.28 }, image: '' },
    { id: 'ff4', gameId: 'free-fire', name: '520+52💎', price: 4.60, profits: { default: 0.46 }, image: '' },
    { id: 'ff5', gameId: 'free-fire', name: '1069+106💎', price: 9.50, profits: { default: 0.95 }, image: '' },
    { id: 'ff6', gameId: 'free-fire', name: '2180+218💎', price: 18.00, profits: { default: 1.8 }, image: '' },
    { id: 'ff7', gameId: 'free-fire', name: '5600+560💎', price: 40.00, profits: { default: 4.0 }, image: '' },
    { id: 'ff8', gameId: 'free-fire', name: 'MENSUAL', price: 9.50, profits: { default: 0.95 }, image: '' },
    { id: 'ff9', gameId: 'free-fire', name: 'SEMANAL', price: 1.80, profits: { default: 0.18 }, image: '' },
  ],
  paymentMethods: [
    { id: 1, name: 'Bancolombia', countryCode: 'CO', details: 'Ahorros 123-456789-00, Nombre: Juan Perez, C.C: 123456789' },
    { id: 2, name: 'Pago Móvil Venezuela', countryCode: 'VE', details: 'Banco: Venezuela, Teléfono: 0414-1234567, CI: 12.345.678' }
  ],
  sellers: [
    { id: 1, name: 'Vendedor Pro', whatsapp: '1234567890', rank: 'oro' },
    { id: 2, name: 'Gaming Expert', whatsapp: '1234567891', rank: 'plata' }
  ],
  sellerRanks: [
    { id: 'bronce', name: 'Bronce' },
    { id: 'plata', name: 'Plata' },
    { id: 'oro', name: 'Oro' }
  ],
  countries: [
    { code: 'US', name: 'Estados Unidos', currency: 'USD', symbol: '$', rate: 1, flag: '🇺🇸' },
    { code: 'MX', name: 'México', currency: 'MXN', symbol: '$', rate: 17.5, flag: '🇲🇽' },
    { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', rate: 4100, flag: '🇨🇴' },
    { code: 'VE', name: 'Venezuela', currency: 'VES', symbol: 'Bs', rate: 36, flag: '🇻🇪' },
    { code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', rate: 3.75, flag: '🇵🇪' },
  ],
  orders: []
};

const useAdminData = () => {
  const [data, setData] = useState({
    games: [],
    items: [],
    paymentMethods: [],
    sellers: [],
    sellerRanks: [],
    countries: [],
    orders: []
  });

  useEffect(() => {
    const loadedData = {};
    for (const key in initialData) {
      try {
        const saved = localStorage.getItem(`dharck_store_${key}`);
        loadedData[key] = saved ? JSON.parse(saved) : initialData[key];
      } catch (e) {
        loadedData[key] = initialData[key];
      }
    }
    setData(loadedData);
  }, []);

  const updateData = (key, newData) => {
    localStorage.setItem(`dharck_store_${key}`, JSON.stringify(newData));
    setData(prev => ({ ...prev, [key]: newData }));
    toast({
      title: '¡Éxito!',
      description: `Los datos de ${key} se han actualizado.`
    });
  };

  return { ...data, updateData };
};

export default useAdminData;