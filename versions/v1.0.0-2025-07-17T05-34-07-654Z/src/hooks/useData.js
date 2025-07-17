import { useState, useEffect } from 'react';
import { initialGames, initialItems, initialPaymentMethods, initialSellers, initialCountries, initialRanks } from '@/lib/initialData';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useData = () => {
  const [games, setGames] = useLocalStorage('games', initialGames);
  const [items, setItems] = useLocalStorage('items', initialItems);
  const [paymentMethods, setPaymentMethods] = useLocalStorage('paymentMethods', initialPaymentMethods);
  const [sellers, setSellers] = useLocalStorage('sellers', initialSellers);
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [countries, setCountries] = useLocalStorage('countries', initialCountries);
  const [ranks, setRanks] = useLocalStorage('ranks', initialRanks);

  return {
    games, updateGames: setGames,
    items, updateItems: setItems,
    paymentMethods, updatePaymentMethods: setPaymentMethods,
    sellers, updateSellers: setSellers,
    orders, updateOrders: setOrders,
    countries, updateCountries: setCountries,
    ranks, updateRanks: setRanks
  };
};