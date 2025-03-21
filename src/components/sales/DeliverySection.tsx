
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Truck, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { SalesFormValues } from './types/salesTypes';
import DeliveryDistanceMap from './DeliveryDistanceMap';

interface DeliverySectionProps {
  form: UseFormReturn<SalesFormValues>;
  saleChannel: string;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ form, saleChannel }) => {
  const showDeliverySection = ['whatsapp', 'instagram', 'marketplace'].includes(saleChannel);
  const deliveryAddress = form.watch('deliveryAddress');
  
  const handleDistanceCalculated = (distanceKm: number) => {
    // Example calculation: R$5 base + R$2 per km after first 3km
    if (distanceKm > 0) {
      const baseDeliveryFee = 5;
      const additionalKm = Math.max(0, distanceKm - 3);
      const additionalFee = additionalKm * 2;
      const totalFee = baseDeliveryFee + additionalFee;
      
      // Round to nearest integer
      const roundedFee = Math.round(totalFee);
      
      // Only update if different from current value and greater than 0
      const currentFee = form.getValues('deliveryFee') || 0;
      if (roundedFee > 0 && roundedFee !== currentFee) {
        form.setValue('deliveryFee', roundedFee);
      }
    }
  };
  
  if (!showDeliverySection) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5" /> Informações de Entrega
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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
              <FormItem className="mt-4">
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
        </div>
        
        <div>
          {deliveryAddress && deliveryAddress.trim() !== '' && (
            <DeliveryDistanceMap 
              customerAddress={deliveryAddress}
              onDistanceCalculated={handleDistanceCalculated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;
