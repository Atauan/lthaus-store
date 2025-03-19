
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Truck, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { SalesFormValues } from './types/salesTypes';

interface DeliverySectionProps {
  form: UseFormReturn<SalesFormValues>;
  saleChannel: string;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ form, saleChannel }) => {
  const isExternalSale = ['whatsapp', 'instagram', 'marketplace'].includes(saleChannel);
  
  if (!isExternalSale) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Endereço de Entrega</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Textarea 
                    placeholder="Endereço completo de entrega" 
                    className="pl-9 min-h-[80px]" 
                    {...field} 
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa de Entrega (R$)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="pl-9" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    value={field.value || ""}
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
