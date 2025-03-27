import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Truck, DollarSign, ExternalLink, Share2, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { SalesFormValues } from './types/salesTypes';
import { Button } from '@/components/ui/button';
import { useStoreInfo } from '@/hooks/settings/useStoreInfo';
import { toast } from 'sonner';

interface DeliverySectionProps {
  form: UseFormReturn<SalesFormValues>;
  saleChannel: string;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ form, saleChannel }) => {
  const showDeliverySection = ['whatsapp', 'instagram', 'marketplace'].includes(saleChannel);
  const deliveryAddress = form.watch('deliveryAddress');
  const { storeInfo } = useStoreInfo();
  
  const generateMapUrl = (customerAddress: string) => {
    if (!storeInfo || !customerAddress) return '';
    
    const storeAddress = `${storeInfo.address}, ${storeInfo.city} - ${storeInfo.state}, ${storeInfo.zipCode}`;
    const encodedStoreAddress = encodeURIComponent(storeAddress);
    const encodedCustomerAddress = encodeURIComponent(customerAddress);
    
    return `https://www.google.com/maps/dir/${encodedStoreAddress}/${encodedCustomerAddress}`;
  };
  
  const handleOpenRoute = () => {
    if (!deliveryAddress) {
      toast.error('Digite o endereço de entrega primeiro');
      return;
    }
    
    const mapUrl = generateMapUrl(deliveryAddress);
    window.open(mapUrl, '_blank');
  };
  
  const handleCopyRouteLink = () => {
    if (!deliveryAddress) {
      toast.error('Digite o endereço de entrega primeiro');
      return;
    }
    
    const mapUrl = generateMapUrl(deliveryAddress);
    navigator.clipboard.writeText(mapUrl)
      .then(() => toast.success('Link da rota copiado para a área de transferência'))
      .catch(() => toast.error('Erro ao copiar o link'));
  };
  
  const handleShareRoute = () => {
    if (!deliveryAddress) {
      toast.error('Digite o endereço de entrega primeiro');
      return;
    }
    
    const mapUrl = generateMapUrl(deliveryAddress);
    
    if (navigator.share) {
      navigator.share({
        title: 'Rota de entrega',
        text: 'Siga esta rota de entrega:',
        url: mapUrl
      })
      .then(() => toast.success('Rota compartilhada com sucesso'))
      .catch(() => toast.error('Erro ao compartilhar rota'));
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyRouteLink();
    }
  };
  
  // Simplified calculation for delivery fee based on address length
  const calculateDeliveryFee = (address: string) => {
    if (!address || address.trim() === '') return 0;
    
    // Simple fee calculation as a placeholder
    // This replaces the previous distance-based calculation 
    const baseDeliveryFee = 5;
    const additionalFee = Math.floor(address.length / 20); // Simple proxy for distance
    return baseDeliveryFee + additionalFee;
  };
  
  // Update delivery fee when address changes
  React.useEffect(() => {
    if (deliveryAddress && deliveryAddress.trim() !== '') {
      const fee = calculateDeliveryFee(deliveryAddress);
      const currentFee = form.getValues('deliveryFee') || 0;
      
      if (fee > 0 && fee !== currentFee) {
        form.setValue('deliveryFee', fee);
      }
    }
  }, [deliveryAddress, form]);
  
  if (!showDeliverySection) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5" /> Informações de Entrega
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de Entrega</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Endereço completo" className="pl-9" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryFee"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Taxa de Entrega (R$)</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="pl-9"
                    placeholder="0"
                    onChange={(e) => onChange(Number(e.target.value))}
                    value={value === 0 ? '' : value}
                    {...rest}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        {deliveryAddress && deliveryAddress.trim() !== '' && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              onClick={handleOpenRoute} 
              variant="outline" 
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Rota
            </Button>
            
            <Button 
              onClick={handleCopyRouteLink} 
              variant="outline" 
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Link
            </Button>
            
            <Button 
              onClick={handleShareRoute} 
              variant="outline" 
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverySection;
