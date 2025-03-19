
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Coins } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { SalesFormValues } from './types/salesTypes';

interface SalesSummaryProps {
  subtotal: number;
  profit: number;
  form: UseFormReturn<SalesFormValues>;
  calculateFinalTotal: () => number;
  className?: string;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  subtotal,
  profit,
  form,
  calculateFinalTotal,
  className = "",
}) => {
  const { control, watch } = form;
  const discountType = watch('discountType');
  const discount = watch('discount');
  
  return (
    <div className={`bg-white rounded-lg shadow-soft p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Resumo da Venda</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Desconto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {discountType === 'percentage' ? 'Desconto (%)' : 'Desconto (R$)'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {discountType === 'percentage' ? '%' : 'R$'}
                    </span>
                    <Input 
                      type="number" 
                      min="0" 
                      max={discountType === 'percentage' ? "100" : undefined} 
                      step="0.01"
                      className="pl-9"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (discountType === 'percentage' && value > 100) {
                          field.onChange(100);
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal:</span>
            <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {(discount > 0) && (
            <div className="flex justify-between items-center text-red-500">
              <span className="text-sm">
                Desconto ({discountType === 'percentage' ? `${discount}%` : `R$ ${discount}`}):
              </span>
              <span className="font-medium">
                - R$ {(discountType === 'percentage' 
                  ? (subtotal * (discount / 100)) 
                  : discount).toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center font-semibold text-lg pt-1">
            <span>Total:</span>
            <span>R$ {calculateFinalTotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-green-600 pt-1">
            <span className="text-sm flex items-center gap-1">
              <Coins className="h-4 w-4" /> Lucro Estimado:
            </span>
            <span className="font-medium">R$ {profit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
