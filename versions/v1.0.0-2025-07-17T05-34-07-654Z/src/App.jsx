import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import AdminPanel from '@/pages/AdminPanel';
import CountrySelector from '@/components/CountrySelector';
import { useData } from '@/hooks/useData';

function App() {
  const { countries, updateCountries, games, updateGames, items, updateItems, paymentMethods, updatePaymentMethods, sellers, updateSellers, orders, updateOrders, ranks, updateRanks } = useData();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountrySelector, setShowCountrySelector] = useState(true);

  useEffect(() => {
    const savedCountryCode = localStorage.getItem('selectedCountryCode');
    if (savedCountryCode) {
      const savedCountry = countries.find(c => c.code === savedCountryCode);
      if (savedCountry) {
        setSelectedCountry(savedCountry);
        setShowCountrySelector(false);
      }
    }
  }, [countries]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    localStorage.setItem('selectedCountryCode', country.code);
    setShowCountrySelector(false);
  };
  
  const handleCountryChange = () => {
    setShowCountrySelector(true);
  }

  if (showCountrySelector) {
    return (
      <>
        <Helmet>
          <title>DHARCK STORE - Selecciona tu País</title>
          <meta name="description" content="Selecciona tu país para ver precios en tu moneda local - DHARCK STORE" />
        </Helmet>
        <CountrySelector onCountrySelect={handleCountrySelect} countries={countries} />
        <Toaster />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Helmet>
          <title>DHARCK STORE|RECARGAS PARA VIDEOJUEGOS</title>
          <meta name="description" content="La mejor tienda de recargas para videojuegos - Lords Mobile, Blood Strike, Free Fire y más" />
        </Helmet>
        
        <Routes>
          <Route path="/" element={<HomePage selectedCountry={selectedCountry} games={games} onCountryChange={handleCountryChange} />} />
          <Route path="/game/:gameId" element={<GamePage selectedCountry={selectedCountry} games={games} items={items} paymentMethods={paymentMethods} sellers={sellers} ranks={ranks} updateOrders={updateOrders} onCountryChange={handleCountryChange} />} />
          <Route path="/admin" element={<AdminPanel data={{ games, items, paymentMethods, sellers, orders, countries, ranks }} setData={{ updateGames, updateItems, updatePaymentMethods, updateSellers, updateOrders, updateCountries, updateRanks }} />} />
        </Routes>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;