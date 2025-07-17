export const initialGames = [
  {
    id: 'lords-mobile',
    name: 'Lords Mobile',
    description: 'Construye tu imperio y conquista el mundo',
    icon: 'Crown',
    color: 'from-yellow-600 to-orange-600',
    image: '/image/lm1.png',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true },
      { id: 'castleName', label: 'Nombre del Castillo', placeholder: 'Nombre de tu castillo', required: true }
    ],
    items: [
      { id: 'lm1', name: '209💎', price: 2.30, image: '/image/lm1.png' },
      { id: 'lm2', name: '524💎', price: 5.20, image: '/image/lm1.png' },
      { id: 'lm3', name: '1048💎', price: 10.00, image: '/image/lm1.png' },
      { id: 'lm4', name: '2096💎', price: 19.50, image: '/image/lm1.png' },
      { id: 'lm5', name: '3144💎', price: 29.00, image: '/image/lm1.png' },
      { id: 'lm6', name: '5240💎', price: 48.00, image: '/image/lm1.png' },
      { id: 'lm7', name: '6812💎', price: 62.00, image: '/image/lm1.png' },
      { id: 'lm8', name: '9956💎', price: 92.00, image: '/image/lm1.png' },
      { id: 'lm9', name: '19912💎', price: 178.00, image: '/image/lm1.png' },
      { id: 'lm10', name: '30392💎', price: 270.00, image: '/image/lm1.png' },
      { id: 'lm11', name: '50304💎', price: 440.00, image: '/image/lm1.png' },
    ]
  },
  {
    id: 'blood-strike',
    name: 'Blood Strike',
    description: 'Battle royale de acción intensa',
    icon: 'Zap',
    color: 'from-red-600 to-pink-600',
    image: '/image/bs.png',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ],
    items: [
      { id: 'bs1', name: '100 + 5 oros', price: 0.89, image: '/image/bs.png' },
      { id: 'bs2', name: '300 + 20 oros', price: 2.80, image: '/image/bs.png' },
      { id: 'bs3', name: '500 + 40 oros', price: 4.60, image: '/image/bs.png' },
      { id: 'bs4', name: '1000 + 100 oros', price: 8.50, image: '/image/bs.png' },
      { id: 'bs5', name: '2000 + 260 oros', price: 18.00, image: '/image/bs.png' },
      { id: 'bs6', name: '5000 + 800 oros', price: 42.00, image: '/image/bs.png' },
      { id: 'bs7', name: 'Pase de ataque élite', price: 4.00, image: '/image/bs.png' },
      { id: 'bs8', name: 'Pase de ataque premium', price: 8.50, image: '/image/bs.png' },
      { id: 'bs9', name: 'pase de subida de nivel', price: 2.00, image: '/image/bs.png' },
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    description: 'El battle royale más popular',
    icon: 'Target',
    color: 'from-blue-600 to-cyan-600',
    image: '/image/ff1.png',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ],
    items: [
        { id: 'ff1', name: '100+10', price: 0.89, image: '/image/ff1.png' },
        { id: 'ff2', name: '200+20', price: 1.90, image: '/image/ff1.png' },
        { id: 'ff3', name: '310+31', price: 2.80, image: '/image/ff1.png' },
        { id: 'ff4', name: '520+52', price: 4.60, image: '/image/ff1.png' },
        { id: 'ff5', name: '1069+106', price: 9.50, image: '/image/ff1.png' },
        { id: 'ff6', name: '2180+218', price: 18.00, image: '/image/ff1.png' },
        { id: 'ff7', name: '5600+560', price: 40.00, image: '/image/ff1.png' },
        { id: 'ff8', name: 'MENSUAL', price: 9.50, image: '/image/ff1.png' },
        { id: 'ff9', name: 'SEMANAL', price: 1.80, image: '/image/ff1.png' },
    ]
  }
];

export const initialCountries = [
  { code: 'US', name: 'Estados Unidos', currency: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
  { code: 'MX', name: 'México', currency: 'MXN', symbol: '$', flag: '🇲🇽', rate: 18.5 },
  { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', rate: 4200 },
  { code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', rate: 900 },
  { code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', rate: 3.7 },
  { code: 'CL', name: 'Chile', currency: 'CLP', symbol: '$', flag: '🇨🇱', rate: 950 },
  { code: 'VE', name: 'Venezuela', currency: 'VES', symbol: 'Bs', flag: '🇻🇪', rate: 36.5 },
  { code: 'EC', name: 'Ecuador', currency: 'USD', symbol: '$', flag: '🇪🇨', rate: 1 },
  { code: 'ES', name: 'España', currency: 'EUR', symbol: '€', flag: '🇪🇸', rate: 0.92 },
  { code: 'BR', name: 'Brasil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 5.4 },
];

export const initialPayments = [
  { id: '1', name: 'Zelle', details: 'email: dharck@store.com', countryCode: 'US'},
  { id: '2', name: 'Bancolombia', details: 'Cuenta Ahorros: 123-456789-00', countryCode: 'CO'},
  { id: '3', name: 'Mercado Pago', details: 'Alias: dharck.mp', countryCode: 'AR'}
];

export const initialSellers = [
  { id: '1', name: 'Vendedor Pro', whatsapp: '1234567890', rankId: '2' },
  { id: '2', name: 'Gaming Expert', whatsapp: '1234567891', rankId: '3' },
  { id: '3', name: 'Fast Delivery', whatsapp: '1234567892', rankId: '1' }
];

export const initialRanks = [
  { id: '1', name: 'Bronce', color: '#cd7f32' },
  { id: '2', name: 'Plata', color: '#c0c0c0' },
  { id: '3', name: 'Oro', color: '#ffd700' },
];