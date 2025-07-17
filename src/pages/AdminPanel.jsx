import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, ShoppingCart, Package, CreditCard, Users, Globe, Gamepad2 } from 'lucide-react';
import OrdersTab from '@/components/admin/OrdersTab';
import ItemsTab from '@/components/admin/ItemsTab';
import PaymentsTab from '@/components/admin/PaymentsTab';
import SellersTab from '@/components/admin/SellersTab';
import CountriesTab from '@/components/admin/CountriesTab';
import GamesTab from '@/components/admin/GamesTab';

function AdminPanel({ data, setData }) {
  const { games, items, paymentMethods, sellers, orders, countries, ranks } = data;
  const { updateGames, updateItems, updatePaymentMethods, updateSellers, updateOrders, updateCountries, updateRanks } = setData;

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

          <TabsContent value="orders"><OrdersTab orders={orders} updateOrders={updateOrders} items={items} sellers={sellers} /></TabsContent>
          <TabsContent value="items"><ItemsTab items={items} updateItems={updateItems} games={games} ranks={ranks} /></TabsContent>
          <TabsContent value="games"><GamesTab games={games} updateGames={updateGames} /></TabsContent>
          <TabsContent value="payments"><PaymentsTab paymentMethods={paymentMethods} updatePaymentMethods={updatePaymentMethods} countries={countries} /></TabsContent>
          <TabsContent value="sellers"><SellersTab sellers={sellers} updateSellers={updateSellers} ranks={ranks} updateRanks={updateRanks} /></TabsContent>
          <TabsContent value="countries"><CountriesTab countries={countries} updateCountries={updateCountries} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPanel;