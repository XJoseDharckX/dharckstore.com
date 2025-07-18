import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, MessageCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import getIcon from '@/lib/getIcon';

function GamePage({ selectedCountry, games, items, paymentMethods, sellers, ranks, updateOrders, onCountryChange }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find(g => g.id === gameId);
  const gameItems = items.filter(i => i.gameId === gameId);
  const availablePaymentMethods = paymentMethods.filter(p => p.countryCode === selectedCountry.code);

  useEffect(() => {
    if (!game) navigate('/');
  }, [game, navigate]);

  if (!game) return null;
  const Icon = getIcon(game.iconName);

  const convertPrice = (usdPrice) => {
    const localPrice = usdPrice * selectedCountry.rate;
    return {
      local: localPrice.toFixed(2),
      usd: usdPrice.toFixed(2)
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(file);
        setPaymentProofUrl(reader.result);
        toast({ title: "Comprobante subido", description: `Archivo ${file.name} cargado.` });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = () => {
    if (isSubmitting) return;
    
    const missingFields = game.fields.filter(field => field.required && !playerData[field.id]);
    if (missingFields.length > 0) {
      toast({ title: "Campos requeridos", description: `Por favor, completa: ${missingFields.map(f => f.label).join(', ')}.`, variant: "destructive" });
      return;
    }
    if (!selectedItem || !selectedPayment || !selectedSellerId || !paymentProofUrl) {
      toast({ title: "Información incompleta", description: "Selecciona un artículo, método de pago, vendedor y sube el comprobante.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const seller = sellers.find(s => s.id === parseInt(selectedSellerId));
    const prices = convertPrice(selectedItem.price);
    const order = {
      id: Date.now(),
      gameName: game.name,
      itemId: selectedItem.id,
      playerData,
      paymentMethodName: selectedPayment.name,
      sellerId: seller.id,
      country: selectedCountry,
      paymentProofUrl,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    updateOrders(prev => [order, ...prev]);

    const message = `🎮 *NUEVO PEDIDO - DHARCK STORE* 🎮\n\n` +
      `*Juego:* ${game.name}\n` +
      Object.entries(playerData).map(([key, value]) => `*${game.fields.find(f=>f.id===key)?.label || key}:* ${value}`).join('\n') + `\n\n` +
      `*Artículo:* ${selectedItem.name}\n` +
      `*Total Pagado:* ${selectedCountry.symbol}${prices.local} (${prices.usd} USD)\n` +
      `*Método de Pago:* ${selectedPayment.name}\n` +
      `*ID Pedido:* ${order.id}`;

    const whatsappUrl = `https://wa.me/${seller.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    toast({ title: "¡Pedido enviado!", description: "Redirigiendo a WhatsApp para completar..." });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      navigate('/');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <header className="p-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="outline" size="sm" className="border-gray-600"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold font-['Orbitron']">{game.name}</h1>
          </div>
          <Button variant="link" onClick={onCountryChange} className="text-gray-400">{selectedCountry.flag} {selectedCountry.name}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="gamer-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Icon className="w-5 h-5 mr-2 text-yellow-400" />Información del Jugador</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {game.fields.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-400">*</span>}</Label>
                <Input id={field.id} placeholder={field.placeholder} onChange={e => setPlayerData(p => ({ ...p, [field.id]: e.target.value }))} className="mt-1 bg-gray-800 border-gray-600 text-white" />
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="gamer-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Selecciona tu Artículo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gameItems.map(item => {
              const prices = convertPrice(item.price);
              return (
                <div key={item.id} onClick={() => setSelectedItem(item)} className={`p-4 rounded-lg cursor-pointer transition-all text-center ${selectedItem?.id === item.id ? 'neon-border bg-yellow-400/20' : 'payment-method'}`}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mx-auto rounded-md mb-2 object-cover" />}
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-yellow-400 font-bold">{selectedCountry.symbol}{prices.local}</p>
                  <p className="text-sm text-gray-400">${prices.usd} USD</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="gamer-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {availablePaymentMethods.map(method => (
              <div key={method.id} onClick={() => setSelectedPayment(method)} className={`p-4 rounded-lg cursor-pointer transition-all flex items-center justify-between ${selectedPayment?.id === method.id ? 'neon-border bg-purple-600/20' : 'payment-method'}`}>
                <span>{method.name}</span>
                <Dialog>
                  <DialogTrigger asChild><Button size="sm" variant="ghost"><Info className="w-4 h-4"/></Button></DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader><DialogTitle>{method.name} - Detalles de Pago</DialogTitle></DialogHeader>
                    <pre className="text-sm whitespace-pre-wrap bg-black/20 p-4 rounded-md">{method.details}</pre>
                    {selectedItem && <p className="text-lg font-bold text-yellow-400 text-center mt-4">Total a Pagar: {selectedCountry.symbol}{convertPrice(selectedItem.price).local}</p>}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
             {availablePaymentMethods.length === 0 && <p className="text-gray-400 col-span-3 text-center">No hay métodos de pago disponibles para {selectedCountry.name}.</p>}
          </div>
        </motion.section>
        
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="gamer-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Vendedor Favorito</h2>
            <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                <SelectTrigger className="bg-gray-800 border-gray-600"><SelectValue placeholder="Selecciona un vendedor" /></SelectTrigger>
                <SelectContent>{sellers.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({ranks.find(r => r.id === s.rankId)?.name})</SelectItem>)}</SelectContent>
            </Select>
        </motion.section>

        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="gamer-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Comprobante de Pago</h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="payment-proof" />
            <Label htmlFor="payment-proof" className="gamer-button px-6 py-2 rounded-lg cursor-pointer inline-block">Seleccionar Archivo</Label>
            {paymentProofUrl && <img src={paymentProofUrl} alt="Vista previa" className="mt-4 max-w-xs mx-auto rounded-md" />}
          </div>
        </motion.section>

        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
          <Button onClick={handleSubmitOrder} disabled={isSubmitting} className="gamer-button px-12 py-4 text-lg font-bold rounded-xl disabled:opacity-50">
            {isSubmitting ? 'Procesando...' : <><MessageCircle className="w-5 h-5 mr-2" />Enviar Pedido por WhatsApp</>}
          </Button>
        </motion.section>
      </div>
    </div>
  );
}

export default GamePage;