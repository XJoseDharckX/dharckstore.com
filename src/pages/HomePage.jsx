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
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <img 
              src="/image/logo1.png" 
              alt="DHARCK STORE Logo" 
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-3xl font-bold font-['Orbitron'] neon-text">
                DHARCK STORE
              </h1>
              <p className="text-sm text-gray-400">
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
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </motion.div>
        </div>
      </header>

      <section className="relative h-96 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="min-w-full h-full relative">
              <img className="w-full h-full object-cover" alt={`${game.name} hero image`} src="https://images.unsplash.com/photo-1543882501-9251a94dc7c3" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center z-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <div className="flex items-center mb-4">
                       <div className="w-12 h-12 text-yellow-400 mr-4"><DynamicIcon name={game.icon} /></div>
                      <h2 className="text-5xl font-bold font-['Orbitron'] neon-text">
                        {game.name}
                      </h2>
                    </div>
                    <p className="text-xl text-gray-300 mb-6">
                      {game.description}
                    </p>
                    <Button
                      onClick={() => handleGameClick(game.id)}
                      className="gamer-button px-8 py-3 text-lg font-bold rounded-xl"
                    >
                      Recargar Ahora
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-yellow-400' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold font-['Orbitron'] neon-text mb-4">
            Juegos Disponibles
          </h2>
          <p className="text-xl text-gray-400">
            Selecciona tu juego favorito y recarga al instante
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleGameClick(game.id)}
              className="game-card rounded-2xl p-6 cursor-pointer group"
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                 <img className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" alt={`${game.name} game cover`} src="https://images.unsplash.com/photo-1656545729966-e5a6fea3b04a" />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 text-yellow-400 mr-3"><DynamicIcon name={game.icon} /></div>
                <h3 className="text-2xl font-bold font-['Orbitron']">
                  {game.name}
                </h3>
              </div>
              <p className="text-gray-400 mb-6">{game.description}</p>
              <Button className="w-full gamer-button font-bold rounded-xl">
                Recargar Ahora
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nueva sección de vendedores */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold font-['Orbitron'] neon-text mb-4">
            Nuestros Vendedores
          </h2>
          <p className="text-xl text-gray-400">
            Equipo profesional con miles de ventas exitosas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="gamer-card rounded-xl p-4 text-center group cursor-pointer"
            >
              <div className="relative mb-4">
                <img 
                  src={seller.image} 
                  alt={seller.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-yellow-400 group-hover:border-purple-400 transition-colors"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h3 className="text-lg font-bold font-['Orbitron'] mb-2">
                {seller.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300 ml-1">{seller.rating}</span>
              </div>
              <p className="text-xs text-gray-400">
                {seller.sales}+ ventas
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-black/50 to-purple-900/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="gamer-card rounded-xl p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Recarga Instantánea</h3>
              <p className="text-gray-400">Recibe tus diamantes y recursos al instante</p>
            </motion.div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="gamer-card rounded-xl p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Precios Competitivos</h3>
              <p className="text-gray-400">Los mejores precios del mercado garantizados</p>
            </motion.div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="gamer-card rounded-xl p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Soporte 24/7</h3>
              <p className="text-gray-400">Atención personalizada cuando la necesites</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;