
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
import { toast } from 'sonner';

interface DeliverySectionProps {
  form: UseFormReturn<SalesFormValues>;
  saleChannel: string;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ form, saleChannel }) => {
  const showDeliverySection = ['whatsapp', 'instagram', 'marketplace'].includes(saleChannel);
  const deliveryAddress = form.watch('deliveryAddress');
  
  const generateMapUrl = (customerAddress: string) => {
    if (!customerAddress) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Endereço copiado!'))
      .catch(() => toast.error('Erro ao copiar endereço'));
  };

  return (
    <div className={`bg-white rounded-lg shadow-soft p-6 ${!showDeliverySection ? 'hidden' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Informações de Entrega</h2>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de Entrega</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Endereço completo" className="pl-9 flex-1" {...field} />
                  </div>
                </FormControl>
                
                {field.value && (
                  <div className="flex gap-1">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => copyToClipboard(field.value as string)}
                      title="Copiar endereço"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => window.open(generateMapUrl(field.value as string), '_blank')}
                      title="Abrir no Google Maps"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa de Entrega</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="0.00" 
                    className="pl-9"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '0' : e.target.value;
                      field.onChange(parseFloat(value));
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DeliverySection;
