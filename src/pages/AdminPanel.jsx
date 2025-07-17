import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, ShoppingCart, Package, CreditCard, Users, Globe, Gamepad2, AlertCircle } from 'lucide-react';
import OrdersTab from '@/components/admin/OrdersTab';
import ItemsTab from '@/components/admin/ItemsTab';
import PaymentsTab from '@/components/admin/PaymentsTab';
import SellersTab from '@/components/admin/SellersTab';
import CountriesTab from '@/components/admin/CountriesTab';
import GamesTab from '@/components/admin/GamesTab';
import useAdminData from '@/hooks/useAdminData';

function AdminPanel() {
  const { 
    games, 
    items, 
    paymentMethods, 
    sellers, 
    orders, 
    countries, 
    sellerRanks,
    updateData, 
    refreshOrders, 
    loadDataFromAPI,
    getOrderStats,
    loading, 
    error 
  } = useAdminData();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <Settings className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold font-['Orbitron'] neon-text">
              Panel de Administración
            </h1>
          </div>
          <p className="text-gray-400">Gestiona todos los aspectos de DHARCK STORE.</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Error de conexión: {error}</span>
            </div>
          )}
        </motion.div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-gray-800">
            <TabsTrigger value="orders"><ShoppingCart className="w-4 h-4 mr-2" />Pedidos</TabsTrigger>
            <TabsTrigger value="items"><Package className="w-4 h-4 mr-2" />Artículos</TabsTrigger>
            <TabsTrigger value="games"><Gamepad2 className="w-4 h-4 mr-2" />Juegos</TabsTrigger>
            <TabsTrigger value="payments"><CreditCard className="w-4 h-4 mr-2" />Pagos</TabsTrigger>
            <TabsTrigger value="sellers"><Users className="w-4 h-4 mr-2" />Vendedores</TabsTrigger>
            <TabsTrigger value="countries"><Globe className="w-4 h-4 mr-2" />Países</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab 
              orders={orders} 
              updateData={updateData}
              refreshOrders={refreshOrders}
              loading={loading}
              getOrderStats={getOrderStats}
            />
          </TabsContent>
          
          <TabsContent value="items">
            <ItemsTab 
              items={items} 
              updateData={(newItems) => updateData('items', newItems)} 
              games={games} 
              ranks={sellerRanks} 
            />
          </TabsContent>
          
          <TabsContent value="games">
            <GamesTab 
              games={games} 
              updateData={(newGames) => updateData('games', newGames)} 
            />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsTab 
              paymentMethods={paymentMethods} 
              updateData={(newMethods) => updateData('paymentMethods', newMethods)} 
              countries={countries} 
            />
          </TabsContent>
          
          <TabsContent value="sellers">
            <SellersTab 
              sellers={sellers} 
              updateData={(newSellers) => updateData('sellers', newSellers)} 
              ranks={sellerRanks} 
              updateRanks={(newRanks) => updateData('sellerRanks', newRanks)} 
            />
          </TabsContent>
          
          <TabsContent value="countries">
            <CountriesTab 
              countries={countries} 
              updateData={(newCountries) => updateData('countries', newCountries)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPanel;