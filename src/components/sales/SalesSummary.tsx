
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

interface SalesSummaryProps {
  subtotal: number;
  profit: number;
  form: UseFormReturn<any>;
  calculateFinalTotal: () => number;
  className?: string;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ 
  subtotal, 
  profit, 
  form, 
  calculateFinalTotal,
  className 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-soft p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Resumo da Venda</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex gap-3 items-end">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>Desconto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          <span>Porcentagem</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Valor Fixo</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Valor do Desconto</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {form.watch('discountType') === 'percentage' ? '%' : 'R$'}
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between pt-3 border-t">
          <span className="font-semibold">Valor Total:</span>
          <span className="font-bold text-lg">R$ {calculateFinalTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between pt-2 text-sm text-green-600">
          <span>Lucro Estimado:</span>
          <span className="font-semibold">R$ {profit.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
