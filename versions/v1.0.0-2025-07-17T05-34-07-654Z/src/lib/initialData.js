export const initialGames = [
  {
    id: 'lords-mobile',
    name: 'Lords Mobile',
    description: 'Construye tu imperio y conquista el mundo',
    iconName: 'Crown',
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
    iconName: 'Zap',
    color: 'from-red-600 to-pink-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    description: 'El battle royale más popular',
    iconName: 'Target',
    color: 'from-blue-600 to-cyan-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  }
];

export const initialItems = [
  // Lords Mobile
  { id: 1, gameId: 'lords-mobile', name: '209💎', price: 2.30, rankProfits: {1: 0.2, 2: 0.3} },
  { id: 2, gameId: 'lords-mobile', name: '524💎', price: 5.20, rankProfits: {1: 0.5, 2: 0.7} },
  { id: 3, gameId: 'lords-mobile', name: '1048💎', price: 10.00, rankProfits: {1: 1.0, 2: 1.2} },
  { id: 4, gameId: 'lords-mobile', name: '2096💎', price: 19.50, rankProfits: {1: 2.0, 2: 2.5} },
  { id: 5, gameId: 'lords-mobile', name: '3144💎', price: 29.00, rankProfits: {1: 3.0, 2: 3.5} },
  { id: 6, gameId: 'lords-mobile', name: '5240💎', price: 48.00, rankProfits: {1: 5.0, 2: 6.0} },
  { id: 7, gameId: 'lords-mobile', name: '6812💎', price: 62.00, rankProfits: {1: 6.5, 2: 7.5} },
  { id: 8, gameId: 'lords-mobile', name: '9956💎', price: 92.00, rankProfits: {1: 9.5, 2: 11.0} },
  { id: 9, gameId: 'lords-mobile', name: '19912💎', price: 178.00, rankProfits: {1: 18.0, 2: 20.0} },
  { id: 10, gameId: 'lords-mobile', name: '30392💎', price: 270.00, rankProfits: {1: 27.0, 2: 30.0} },
  { id: 11, gameId: 'lords-mobile', name: '50304💎', price: 440.00, rankProfits: {1: 44.0, 2: 48.0} },

  // Blood Strike
  { id: 12, gameId: 'blood-strike', name: '100 + 5 oros', price: 0.89, rankProfits: {1: 0.1, 2: 0.15} },
  { id: 13, gameId: 'blood-strike', name: '300 + 20 oros', price: 2.80, rankProfits: {1: 0.3, 2: 0.4} },
  { id: 14, gameId: 'blood-strike', name: '500 + 40 oros', price: 4.60, rankProfits: {1: 0.5, 2: 0.6} },
  { id: 15, gameId: 'blood-strike', name: '1000 + 100 oros', price: 8.50, rankProfits: {1: 0.9, 2: 1.1} },
  { id: 16, gameId: 'blood-strike', name: '2000 + 260 oros', price: 18.00, rankProfits: {1: 1.8, 2: 2.2} },
  { id: 17, gameId: 'blood-strike', name: '5000 + 800 oros', price: 42.00, rankProfits: {1: 4.2, 2: 5.0} },
  { id: 18, gameId: 'blood-strike', name: 'Pase de ataque élite', price: 4.00, rankProfits: {1: 0.4, 2: 0.5} },
  { id: 19, gameId: 'blood-strike', name: 'Pase de ataque premium', price: 8.50, rankProfits: {1: 0.9, 2: 1.1} },
  { id: 20, gameId: 'blood-strike', name: 'Pase de subida de nivel', price: 2.00, rankProfits: {1: 0.2, 2: 0.3} },

  // Free Fire
  { id: 21, gameId: 'free-fire', name: '100+10 💎', price: 0.89, rankProfits: {1: 0.1, 2: 0.15} },
  { id: 22, gameId: 'free-fire', name: '200+20 💎', price: 1.90, rankProfits: {1: 0.2, 2: 0.3} },
  { id: 23, gameId: 'free-fire', name: '310+31 💎', price: 2.80, rankProfits: {1: 0.3, 2: 0.4} },
  { id: 24, gameId: 'free-fire', name: '520+52 💎', price: 4.60, rankProfits: {1: 0.5, 2: 0.6} },
  { id: 25, gameId: 'free-fire', name: '1069+106 💎', price: 9.50, rankProfits: {1: 1.0, 2: 1.2} },
  { id: 26, gameId: 'free-fire', name: '2180+218 💎', price: 18.00, rankProfits: {1: 1.8, 2: 2.2} },
  { id: 27, gameId: 'free-fire', name: '5600+560 💎', price: 40.00, rankProfits: {1: 4.0, 2: 4.8} },
  { id: 28, gameId: 'free-fire', name: 'MENSUAL', price: 9.50, rankProfits: {1: 1.0, 2: 1.2} },
  { id: 29, gameId: 'free-fire', name: 'SEMANAL', price: 1.80, rankProfits: {1: 0.2, 2: 0.3} },
];

export const initialPaymentMethods = [
  { id: 1, name: 'Zelle', details: 'Email: example@dharck.store\nNombre: Dharck Store LLC', countryCode: 'US', iconName: 'CreditCard' },
  { id: 2, name: 'Bancolombia', details: 'Cuenta Ahorros: 123-456789-00\nTitular: Dharck Store SAS', countryCode: 'CO', iconName: 'CreditCard' },
];

export const initialSellers = [
  { id: 1, name: 'Vendedor Pro', whatsapp: '+1234567890', rankId: 2, earnings: 150.50 },
  { id: 2, name: 'Gaming Expert', whatsapp: '+1234567891', rankId: 1, earnings: 75.20 },
];

export const initialCountries = [
  { id: 1, code: 'US', name: 'Estados Unidos', currency: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
  { id: 2, code: 'MX', name: 'México', currency: 'MXN', symbol: '$', flag: '🇲🇽', rate: 17.15 },
  { id: 3, code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', rate: 3950 },
  { id: 4, code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', rate: 890 },
  { id: 5, code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', rate: 3.75 },
  { id: 6, code: 'CL', name: 'Chile', currency: 'CLP', symbol: '$', flag: '🇨🇱', rate: 930 },
  { id: 7, code: 'VE', name: 'Venezuela', currency: 'VES', symbol: 'Bs', flag: '🇻🇪', rate: 36.5 },
  { id: 8, code: 'EC', name: 'Ecuador', currency: 'USD', symbol: '$', flag: '🇪🇨', rate: 1 },
  { id: 9, code: 'ES', name: 'España', currency: 'EUR', symbol: '€', flag: '🇪🇸', rate: 0.92 },
  { id: 10, code: 'BR', name: 'Brasil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 4.98 },
];

export const initialRanks = [
    { id: 1, name: 'Bronce' },
    { id: 2, name: 'Oro' },
    { id: 3, name: 'Diamante' }
];