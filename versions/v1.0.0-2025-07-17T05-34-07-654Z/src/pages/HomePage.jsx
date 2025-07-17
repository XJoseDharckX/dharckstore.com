import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings, Crown, Zap, Target, Users, Star } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { initialGames } from '@/data/initialData';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name }) => {
  const IconComponent = LucideIcons[name] || LucideIcons['HelpCircle'];
  return <IconComponent />;
};

// Mapeo de imágenes de juegos
const gameImages = {
  'lords-mobile': '/image/lm1.png',
  'blood-strike': '/image/bs.png',
  'free-fire': '/image/ff1.png'
};

// Datos de vendedores con sus imágenes
const sellers = [
  { id: 1, name: 'Enmanuel', image: '/image/vendedores/Enmanuel.png', rating: 5, sales: 1250 },
  { id: 2, name: 'Jhack', image: '/image/vendedores/Jhack.png', rating: 5, sales: 980 },
  { id: 3, name: 'Mateo', image: '/image/vendedores/Mateo.png', rating: 4.9, sales: 1100 },
  { id: 4, name: 'SpartanoWolf98', image: '/image/vendedores/SpartanoWolf98.png', rating: 4.8, sales: 850 },
  { id: 5, name: 'David', image: '/image/vendedores/david.png', rating: 4.9, sales: 920 },
  { id: 6, name: 'Ernesto', image: '/image/vendedores/ernesto.png', rating: 4.7, sales: 780 },
  { id: 7, name: 'Satoru', image: '/image/vendedores/satoru.png', rating: 5, sales: 1350 },
  { id: 8, name: 'XJoseDharckX', image: '/image/vendedores/xjosedharckx.png', rating: 5, sales: 1500 }
];

function HomePage({ selectedCountry }) {
  const [games] = useLocalStorage('games', initialGames);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % games.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [games.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
  };

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen">
      {/* Header mejorado para móviles */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-2 sm:space-x-4"
          >
            <img 
              src="/image/logo1.png" 
              alt="DHARCK STORE Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Orbitron'] neon-text">
                DHARCK STORE|RECARGAS PARA VIDEOJUEGOS
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                Gaming Recharges • {selectedCountry?.name} ({selectedCountry?.currency})
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Button
              onClick={handleAdminClick}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xs sm:text-sm px-2 sm:px-4"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero section mejorado para móviles */}
      <section className="relative h-64 sm:h-80 md:h-96 mb-8 sm:mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="min-w-full h-full relative">
              <img 
                className="w-full h-full object-cover" 
                alt={`${game.name} hero image`} 
                src={gameImages[game.id] || "https://images.unsplash.com/photo-1543882501-9251a94dc7c3"} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <div className="flex items-center mb-2 sm:mb-4">
                       <div className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 mr-2 sm:mr-4"><DynamicIcon name={game.icon} /></div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Orbitron'] neon-text">
                        {game.name}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6">
                      {game.description}
                    </p>
                    <Button
                      onClick={() => handleGameClick(game.id)}
                      className="gamer-button px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl"
                    >
                      Recargar Ahora
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles del carousel mejorados para móviles */}
        <button 
          onClick={prevSlide} 
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-yellow-400' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sección de juegos mejorada para móviles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Orbitron'] neon-text mb-2 sm:mb-4">
            Juegos Disponibles
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Selecciona tu juego favorito y recarga al instante
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleGameClick(game.id)}
              className="game-card rounded-2xl p-4 sm:p-6 cursor-pointer group"
            >
              <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-xl">
                 <img 
                   className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                   alt={`${game.name} game cover`} 
                   src={gameImages[game.id] || "https://images.unsplash.com/photo-1656545729966-e5a6fea3b04a"} 
                 />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
              </div>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2 sm:mr-3"><DynamicIcon name={game.icon} /></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-['Orbitron']">
                  {game.name}
                </h3>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">{game.description}</p>
              <Button className="w-full gamer-button font-bold rounded-xl text-sm sm:text-base">
                Recargar Ahora
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección de vendedores mejorada para móviles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Orbitron'] neon-text mb-2 sm:mb-4">
            Nuestros Vendedores
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Equipo profesional con miles de ventas exitosas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="gamer-card rounded-xl p-3 sm:p-4 text-center group cursor-pointer"
            >
              <div className="relative mb-3 sm:mb-4">
                <img 
                  src={seller.image} 
                  alt={seller.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto object-cover border-2 border-yellow-400 group-hover:border-purple-400 transition-colors"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold font-['Orbitron'] mb-1 sm:mb-2 truncate">
                {seller.name}
              </h3>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                <span className="text-xs sm:text-sm text-gray-300 ml-1">{seller.rating}</span>
              </div>
              <p className="text-xs text-gray-400">
                {seller.sales}+ ventas
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección de características mejorada para móviles */}
      <section className="bg-gradient-to-r from-black/50 to-purple-900/50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="gamer-card rounded-xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Recarga Instantánea</h3>
              <p className="text-gray-400 text-sm sm:text-base">Recibe tus diamantes y recursos al instante</p>
            </motion.div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="gamer-card rounded-xl p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Precios Competitivos</h3>
              <p className="text-gray-400 text-sm sm:text-base">Los mejores precios del mercado garantizados</p>
            </motion.div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="gamer-card rounded-xl p-4 sm:p-6 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Soporte 24/7</h3>
              <p className="text-gray-400 text-sm sm:text-base">Atención personalizada cuando la necesites</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;