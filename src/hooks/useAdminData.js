import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { orderService, exchangeRateService } from '../config/api.js';

// Datos iniciales como fallback
const initialData = {
  games: [
    {
      id: 1,
      name: 'Lords Mobile',
      code: 'lords-mobile',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true },
        { id: 'castleName', label: 'Nombre del Castillo', placeholder: 'Nombre de tu castillo', required: true }
      ]
    },
    {
      id: 2,
      name: 'Blood Strike',
      code: 'blood-strike',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
      ]
    },
    {
      id: 3,
      name: 'Free Fire',
      code: 'free-fire',
      requirements: [
        { id: 'playerId', label: 'ID del Jugador', placeholder: 'Ingresa tu ID', required: true }
      ]
    }
  ],
  items: [
    { id: 1, gameId: 1, name: '209💎', price: 2.30, profits: { default: 0.2 }, image: '' },
    { id: 2, gameId: 1, name: '524💎', price: 5.20, profits: { default: 0.5 }, image: '' },
    { id: 3, gameId: 1, name: '1048💎', price: 10.00, profits: { default: 1.0 }, image: '' },
    { id: 4, gameId: 1, name: '2096💎', price: 19.50, profits: { default: 1.95 }, image: '' },
    { id: 5, gameId: 1, name: '3144💎', price: 29.00, profits: { default: 2.9 }, image: '' },
    { id: 6, gameId: 1, name: '5240💎', price: 48.00, profits: { default: 4.8 }, image: '' },
    { id: 7, gameId: 1, name: '6812💎', price: 62.00, profits: { default: 6.2 }, image: '' },
    { id: 8, gameId: 1, name: '9956💎', price: 92.00, profits: { default: 9.2 }, image: '' },
    { id: 9, gameId: 1, name: '19912💎', price: 178.00, profits: { default: 17.8 }, image: '' },
    { id: 10, gameId: 1, name: '30392💎', price: 270.00, profits: { default: 27.0 }, image: '' },
    { id: 11, gameId: 1, name: '50304💎', price: 440.00, profits: { default: 44.0 }, image: '' },

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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos desde la API
  const loadDataFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando datos del panel de administración desde la API...');
      
      // Cargar pedidos desde la API
      const ordersResponse = await orderService.getAll();
      console.log('📋 Pedidos cargados:', ordersResponse);
      
      // Cargar tasas de cambio
      const exchangeResponse = await exchangeRateService.getAll();
      console.log('💱 Tasas de cambio cargadas:', exchangeResponse);
      
      // Procesar datos de la API
      const apiData = {
        games: initialData.games, // Por ahora usar datos iniciales
        items: initialData.items, // Por ahora usar datos iniciales
        paymentMethods: initialData.paymentMethods, // Por ahora usar datos iniciales
        sellers: initialData.sellers, // Por ahora usar datos iniciales
        sellerRanks: initialData.sellerRanks,
        countries: exchangeResponse?.rates ? processExchangeRates(exchangeResponse.rates) : initialData.countries,
        orders: ordersResponse?.orders || []
      };
      
      // Combinar con datos locales si existen
      const finalData = {};
      for (const key in apiData) {
        try {
          const saved = localStorage.getItem(`dharck_store_${key}`);
          if (saved && key !== 'orders') {
            // Para todo excepto pedidos, usar datos locales si existen
            finalData[key] = JSON.parse(saved);
          } else {
            // Para pedidos, siempre usar datos de la API
            finalData[key] = apiData[key];
          }
        } catch (e) {
          finalData[key] = apiData[key];
        }
      }
      
      setData(finalData);
      console.log('✅ Datos del panel de administración cargados exitosamente');
      
    } catch (error) {
      console.error('❌ Error cargando datos del panel:', error);
      setError(error.message);
      
      // Usar datos locales como fallback
      const fallbackData = {};
      for (const key in initialData) {
        try {
          const saved = localStorage.getItem(`dharck_store_${key}`);
          fallbackData[key] = saved ? JSON.parse(saved) : initialData[key];
        } catch (e) {
          fallbackData[key] = initialData[key];
        }
      }
      setData(fallbackData);
      
      toast({
        title: '⚠️ Modo Offline',
        description: 'No se pudo conectar con el servidor. Usando datos locales.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Procesar tasas de cambio de la API
  const processExchangeRates = (rates) => {
    const countries = [];
    const processedCurrencies = new Set();
    
    rates.forEach(rate => {
      if (!processedCurrencies.has(rate.to_currency)) {
        countries.push({
          code: rate.to_currency === 'VES' ? 'VE' : rate.to_currency === 'USD' ? 'US' : rate.to_currency,
          name: rate.to_currency === 'VES' ? 'Venezuela' : rate.to_currency === 'USD' ? 'Estados Unidos' : rate.to_currency,
          currency: rate.to_currency,
          symbol: rate.to_currency === 'VES' ? 'Bs' : '$',
          rate: rate.rate,
          flag: rate.to_currency === 'VES' ? '🇻🇪' : '🇺🇸'
        });
        processedCurrencies.add(rate.to_currency);
      }
    });
    
    return countries.length > 0 ? countries : initialData.countries;
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDataFromAPI();
    
    // Recargar pedidos cada 30 segundos
    const interval = setInterval(() => {
      refreshOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Refrescar solo los pedidos
  const refreshOrders = async () => {
    try {
      console.log('🔄 Refrescando pedidos...');
      const ordersResponse = await orderService.getAll();
      
      if (ordersResponse?.orders) {
        setData(prev => ({
          ...prev,
          orders: ordersResponse.orders
        }));
        console.log('✅ Pedidos actualizados:', ordersResponse.orders.length);
      }
    } catch (error) {
      console.error('❌ Error refrescando pedidos:', error);
    }
  };

  // Actualizar datos (para datos locales)
  const updateData = (key, newData) => {
    if (key === 'orders') {
      // Los pedidos no se actualizan localmente, vienen de la API
      toast({
        title: '⚠️ Advertencia',
        description: 'Los pedidos se sincronizan automáticamente con el servidor.',
        variant: 'destructive'
      });
      return;
    }
    
    localStorage.setItem(`dharck_store_${key}`, JSON.stringify(newData));
    setData(prev => ({ ...prev, [key]: newData }));
    toast({
      title: '✅ Éxito',
      description: `Los datos de ${key} se han actualizado localmente.`
    });
  };

  // Obtener estadísticas de pedidos
  const getOrderStats = () => {
    const orders = data.orders || [];
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (parseFloat(o.final_price) || 0), 0)
    };
  };

  return { 
    ...data, 
    updateData, 
    refreshOrders, 
    loadDataFromAPI,
    getOrderStats,
    loading, 
    error 
  };
};

export default useAdminData;