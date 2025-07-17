import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialGames = [
  {
    id: 'lords-mobile',
    name: 'Lords Mobile',
    description: 'Construye tu imperio y conquista el mundo',
    icon: 'Crown',
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
    icon: 'Zap',
    color: 'from-red-600 to-pink-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    description: 'El battle royale más popular',
    icon: 'Target',
    color: 'from-blue-600 to-cyan-600',
    fields: [
      { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
    ]
  }
];

const initialItems = [
  // Lords Mobile
  { id: 'lm-1', gameId: 'lords-mobile', name: '209💎', price: 2.30, image: '', earnings: { default: 0.2 } },
  { id: 'lm-2', gameId: 'lords-mobile', name: '524💎', price: 5.20, image: '', earnings: { default: 0.5 } },
  { id: 'lm-3', gameId: 'lords-mobile', name: '1048💎', price: 10.00, image: '', earnings: { default: 1.0 } },
  { id: 'lm-4', gameId: 'lords-mobile', name: '2096💎', price: 19.50, image: '', earnings: { default: 2.0 } },
  { id: 'lm-5', gameId: 'lords-mobile', name: '3144💎', price: 29.00, image: '', earnings: { default: 3.0 } },
  { id: 'lm-6', gameId: 'lords-mobile', name: '5240💎', price: 48.00, image: '', earnings: { default: 5.0 } },
  { id: 'lm-7', gameId: 'lords-mobile', name: '6812💎', price: 62.00, image: '', earnings: { default: 6.5 } },
  { id: 'lm-8', gameId: 'lords-mobile', name: '9956💎', price: 92.00, image: '', earnings: { default: 9.5 } },
  { id: 'lm-9', gameId: 'lords-mobile', name: '19912💎', price: 178.00, image: '', earnings: { default: 18.0 } },
  { id: 'lm-10', gameId: 'lords-mobile', name: '30392💎', price: 270.00, image: '', earnings: { default: 27.0 } },
  { id: 'lm-11', gameId: 'lords-mobile', name: '50304💎', price: 440.00, image: '', earnings: { default: 44.0 } },
  // Blood Strike
  { id: 'bs-1', gameId: 'blood-strike', name: '100 + 5 oros', price: 0.89, image: '', earnings: { default: 0.1 } },
  { id: 'bs-2', gameId: 'blood-strike', name: '300 + 20 oros', price: 2.80, image: '', earnings: { default: 0.3 } },
  { id: 'bs-3', gameId: 'blood-strike', name: '500 + 40 oros', price: 4.60, image: '', earnings: { default: 0.5 } },
  { id: 'bs-4', gameId: 'blood-strike', name: '1000 + 100 oros', price: 8.50, image: '', earnings: { default: 0.9 } },
  { id: 'bs-5', gameId: 'blood-strike', name: '2000 + 260 oros', price: 18.00, image: '', earnings: { default: 1.8 } },
  { id: 'bs-6', gameId: 'blood-strike', name: '5000 + 800 oros', price: 42.00, image: '', earnings: { default: 4.2 } },
  { id: 'bs-7', gameId: 'blood-strike', name: 'Pase de ataque élite', price: 4.00, image: '', earnings: { default: 0.4 } },
  { id: 'bs-8', gameId: 'blood-strike', name: 'Pase de ataque premium', price: 8.50, image: '', earnings: { default: 0.9 } },
  { id: 'bs-9', gameId: 'blood-strike', name: 'Pase de subida de nivel', price: 2.00, image: '', earnings: { default: 0.2 } },
  // Free Fire
  { id: 'ff-1', gameId: 'free-fire', name: '100+10💎', price: 0.89, image: '', earnings: { default: 0.1 } },
  { id: 'ff-2', gameId: 'free-fire', name: '200+20💎', price: 1.90, image: '', earnings: { default: 0.2 } },
  { id: 'ff-3', gameId: 'free-fire', name: '310+31💎', price: 2.80, image: '', earnings: { default: 0.3 } },
  { id: 'ff-4', gameId: 'free-fire', name: '520+52💎', price: 4.60, image: '', earnings: { default: 0.5 } },
  { id: 'ff-5', gameId: 'free-fire', name: '1069+106💎', price: 9.50, image: '', earnings: { default: 1.0 } },
  { id: 'ff-6', gameId: 'free-fire', name: '2180+218💎', price: 18.00, image: '', earnings: { default: 1.8 } },
  { id: 'ff-7', gameId: 'free-fire', name: '5600+560💎', price: 40.00, image: '', earnings: { default: 4.0 } },
  { id: 'ff-8', gameId: 'free-fire', name: 'MENSUAL', price: 9.50, image: '', earnings: { default: 1.0 } },
  { id: 'ff-9', gameId: 'free-fire', name: 'SEMANAL', price: 1.80, image: '', earnings: { default: 0.2 } },
];

const initialCountries = [
    { code: 'US', name: 'Estados Unidos', currency: 'USD', symbol: '$', flag: '🇺🇸', rate: 1 },
    { code: 'MX', name: 'México', currency: 'MXN', symbol: '$', flag: '🇲🇽', rate: 18.5 },
    { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', rate: 4200 },
    { code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', rate: 900 },
    { code: 'PE', name: 'Perú', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', rate: 3.7 },
    { code: 'CL', name: 'Chile', currency: 'CLP', symbol: '$', flag: '🇨🇱', rate: 950 },
    { code: 'VE', name: 'Venezuela', currency: 'VES', symbol: 'Bs', flag: '🇻🇪', rate: 36 },
    { code: 'EC', name: 'Ecuador', currency: 'USD', symbol: '$', flag: '🇪🇨', rate: 1 },
    { code: 'ES', name: 'España', currency: 'EUR', symbol: '€', flag: '🇪🇸', rate: 0.92 },
    { code: 'BR', name: 'Brasil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 5.4 },
];

const initialPayments = [
    { id: 'bancolombia', name: 'Bancolombia', countryCode: 'CO', details: 'Ahorros 123-456789-00, Nombre: DHARCK STORE, NIT: 123.456.789-0' },
    { id: 'zelle', name: 'Zelle', countryCode: 'US', details: 'Email: pagos@dharckstore.com' },
    { id: 'pago-movil', name: 'Pago Móvil', countryCode: 'VE', details: 'Banco: Banesco, Teléfono: 0412-1234567, CI: V-12345678' },
];

const initialSellers = [
    { id: 'seller-1', name: 'Vendedor Pro', whatsapp: '+1234567890', rank: 'pro' },
    { id: 'seller-2', name: 'Gaming Expert', whatsapp: '+1234567891', rank: 'expert' },
    { id: 'seller-3', name: 'Fast Delivery', whatsapp: '+1234567892', rank: 'default' },
];

const initialRanks = [
    { id: 'default', name: 'Default', commission: 1.0 },
    { id: 'pro', name: 'Pro', commission: 1.1 },
    { id: 'expert', name: 'Expert', commission: 1.2 },
];

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export const DataProvider = ({ children }) => {
  const [games, setGames] = useLocalStorage('dharck_games', initialGames);
  const [items, setItems] = useLocalStorage('dharck_items', initialItems);
  const [countries, setCountries] = useLocalStorage('dharck_countries', initialCountries);
  const [paymentMethods, setPaymentMethods] = useLocalStorage('dharck_payments', initialPayments);
  const [sellers, setSellers] = useLocalStorage('dharck_sellers', initialSellers);
  const [ranks, setRanks] = useLocalStorage('dharck_ranks', initialRanks);
  const [orders, setOrders] = useLocalStorage('dharck_orders', []);
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountrySelector, setShowCountrySelector] = useState(true);

  useEffect(() => {
    const savedCountry = localStorage.getItem('dharck_selectedCountry');
    if (savedCountry) {
      const foundCountry = countries.find(c => c.code === JSON.parse(savedCountry).code);
      if (foundCountry) {
        setSelectedCountry(foundCountry);
        setShowCountrySelector(false);
      }
    }
  }, [countries]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    localStorage.setItem('dharck_selectedCountry', JSON.stringify(country));
    setShowCountrySelector(false);
  };

  const addOrder = (order) => {
    setOrders(prevOrders => [...prevOrders, order]);
  };

  const updateOrder = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const saveData = (key, data) => {
    switch (key) {
      case 'games': setGames(data); break;
      case 'items': setItems(data); break;
      case 'countries': setCountries(data); break;
      case 'paymentMethods': setPaymentMethods(data); break;
      case 'sellers': setSellers(data); break;
      case 'ranks': setRanks(data); break;
      default: break;
    }
  };

  const value = {
    games,
    items,
    countries,
    paymentMethods,
    sellers,
    ranks,
    orders,
    selectedCountry,
    showCountrySelector,
    handleCountrySelect,
    addOrder,
    updateOrder,
    deleteOrder,
    saveData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};