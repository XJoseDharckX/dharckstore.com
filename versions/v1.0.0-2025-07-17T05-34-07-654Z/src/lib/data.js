import { Crown, Zap, Target } from 'lucide-react';

export const initialGames = [
  {
    id: 'lords-mobile',
    name: 'Lords Mobile',
    description: 'Construye tu imperio y conquista el mundo',
    image: 'Lords Mobile game with medieval castle and warriors',
    icon: Crown,
    color: 'from-yellow-600 to-orange-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true },
      { id: 'castleName', label: 'Nombre del Castillo', placeholder: 'Nombre de tu castillo', required: true }
    ]
  },
  {
    id: 'blood-strike',
    name: 'Blood Strike',
    description: 'Battle royale de acción intensa',
    image: 'Blood Strike battle royale game with soldiers and weapons',
    icon: Zap,
    color: 'from-red-600 to-pink-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    description: 'El battle royale más popular',
    image: 'Free Fire battle royale game with characters and weapons',
    icon: Target,
    color: 'from-blue-600 to-cyan-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  }
];

export const initialItems = [
  // Lords Mobile
  { id: 'lm-1', gameId: 'lords-mobile', name: '209💎', price: 2.30, image: '' },
  { id: 'lm-2', gameId: 'lords-mobile', name: '524💎', price: 5.20, image: '' },
  { id: 'lm-3', gameId: 'lords-mobile', name: '1048💎', price: 10.00, image: '' },
  { id: 'lm-4', gameId: 'lords-mobile', name: '2096💎', price: 19.50, image: '' },
  { id: 'lm-5', gameId: 'lords-mobile', name: '3144💎', price: 29.00, image: '' },
  { id: 'lm-6', gameId: 'lords-mobile', name: '5240💎', price: 48.00, image: '' },
  { id: 'lm-7', gameId: 'lords-mobile', name: '6812💎', price: 62.00, image: '' },
  { id: 'lm-8', gameId: 'lords-mobile', name: '9956💎', price: 92.00, image: '' },
  { id: 'lm-9', gameId: 'lords-mobile', name: '19912💎', price: 178.00, image: '' },
  { id: 'lm-10', gameId: 'lords-mobile', name: '30392💎', price: 270.00, image: '' },
  { id: 'lm-11', gameId: 'lords-mobile', name: '50304💎', price: 440.00, image: '' },

  // Blood Strike
  { id: 'bs-1', gameId: 'blood-strike', name: '100 + 5 oros', price: 0.89, image: '' },
  { id: 'bs-2', gameId: 'blood-strike', name: '300 + 20 oros', price: 2.80, image: '' },
  { id: 'bs-3', gameId: 'blood-strike', name: '500 + 40 oros', price: 4.60, image: '' },
  { id: 'bs-4', gameId: 'blood-strike', name: '1000 + 100 oros', price: 8.50, image: '' },
  { id: 'bs-5', gameId: 'blood-strike', name: '2000 + 260 oros', price: 18.00, image: '' },
  { id: 'bs-6', gameId: 'blood-strike', name: '5000 + 800 oros', price: 42.00, image: '' },
  { id: 'bs-7', gameId: 'blood-strike', name: 'Pase de ataque élite', price: 4.00, image: '' },
  { id: 'bs-8', gameId: 'blood-strike', name: 'Pase de ataque premium', price: 8.50, image: '' },
  { id: 'bs-9', gameId: 'blood-strike', name: 'Pase de subida de nivel', price: 2.00, image: '' },

  // Free Fire
  { id: 'ff-1', gameId: 'free-fire', name: '100+10', price: 0.89, image: '' },
  { id: 'ff-2', gameId: 'free-fire', name: '200+20', price: 1.90, image: '' },
  { id: 'ff-3', gameId: 'free-fire', name: '310+31', price: 2.80, image: '' },
  { id: 'ff-4', gameId: 'free-fire', name: '520+52', price: 4.60, image: '' },
  { id: 'ff-5', gameId: 'free-fire', name: '1069+106', price: 9.50, image: '' },
  { id: 'ff-6', gameId: 'free-fire', name: '2180+218', price: 18.00, image: '' },
  { id: 'ff-7', gameId: 'free-fire', name: '5600+560', price: 40.00, image: '' },
  { id: 'ff-8', gameId: 'free-fire', name: 'MENSUAL', price: 9.50, image: '' },
  { id: 'ff-9', gameId: 'free-fire', name: 'SEMANAL', price: 1.80, image: '' },
];

export const initialCountries = [
    { code: 'US', name: 'Estados Unidos', currency: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
    { code: 'MX', name: 'México', currency: 'MXN', symbol: '$', flag: '🇲🇽', rate: 18.5 },
    { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', rate: 4200 },
    { code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', rate: 900 },
    { code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', rate: 3.75 },
    { code: 'CL', name: 'Chile', currency: 'CLP', symbol: '$', flag: '🇨🇱', rate: 930 },
    { code: 'VE', name: 'Venezuela', currency: 'VES', symbol: 'Bs', flag: '🇻🇪', rate: 36.5 },
    { code: 'EC', name: 'Ecuador', currency: 'USD', symbol: '$', flag: '🇪🇨', rate: 1 },
    { code: 'ES', name: 'España', currency: 'EUR', symbol: '€', flag: '🇪🇸', rate: 0.92 },
    { code: 'BR', name: 'Brasil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 5.4 },
];

export const initialSellers = [
  { id: 'seller-1', name: 'Vendedor Pro', whatsapp: '+1234567890', rank: 'oro' },
  { id: 'seller-2', name: 'Gaming Expert', whatsapp: '+1234567891', rank: 'plata' },
  { id: 'seller-3', name: 'Fast Delivery', whatsapp: '+1234567892', rank: 'bronce' }
];

export const initialPayments = [
    { id: 'pay-1', name: 'Zelle', details: 'Correo: dharckstore@zelle.com', countries: ['US', 'VE', 'CO'] },
    { id: 'pay-2', name: 'Bancolombia', details: 'Ahorros 123-456789-00\nNombre: Dharck Store\nNIT: 900.123.456-7', countries: ['CO'] },
    { id: 'pay-3', name: 'Mercado Pago', details: 'CVU: 0000003100012345678901\nAlias: dharck.store.mp', countries: ['AR', 'MX', 'BR'] },
];

export const initialRanks = [
    { id: 'bronce', name: 'Bronce', profitPercentage: 5 },
    { id: 'plata', name: 'Plata', profitPercentage: 7 },
    { id: 'oro', name: 'Oro', profitPercentage: 10 },
];