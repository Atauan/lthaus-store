
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { SalesFormValues } from './types/salesTypes';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, CreditCard, Banknote, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import SalesSummary from './SalesSummary';

interface PaymentMethodsSectionProps {
  form: UseFormReturn<SalesFormValues>;
  finalTotal: number;
}

const paymentMethods = [
  { id: 'cash', name: 'Dinheiro', icon: <Banknote className="h-4 w-4 mr-2" /> },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { id: 'debit_card', name: 'Cartão de Débito', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { id: 'pix', name: 'PIX', icon: <QrCode className="h-4 w-4 mr-2" /> },
];

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ form, finalTotal }) => {
  const { control, watch, setValue } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentMethods'
  });
  
  const watchedPaymentMethods = watch('paymentMethods');
  const currentTotal = watchedPaymentMethods.reduce((sum, method) => sum + (method.amount || 0), 0);
  const remainingAmount = finalTotal - currentTotal;
  
  const handleAddPaymentMethod = () => {
    append({ method: 'cash', amount: 0 });
  };
  
  const handleSetFullAmount = (index: number) => {
    const methods = [...watchedPaymentMethods];
    methods[index] = { ...methods[index], amount: remainingAmount + (methods[index].amount || 0) };
    setValue('paymentMethods', methods);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-4">Formas de Pagamento</h2>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col space-y-2 p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <FormField
                  control={control}
                  name={`paymentMethods.${index}.method`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Método de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                <div className="flex items-center">
                                  {method.icon}
                                  <span>{method.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`paymentMethods.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="pl-9"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        
                        {remainingAmount !== 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetFullAmount(index)}
                            className="whitespace-nowrap"
                          >
                            {remainingAmount > 0 ? `+ R$ ${remainingAmount.toFixed(2)}` : `- R$ ${Math.abs(remainingAmount).toFixed(2)}`}
                          </Button>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPaymentMethod}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Forma de Pagamento
          </Button>
          
          <div className={cn(
            "mt-4 p-3 rounded-md font-medium text-center",
            remainingAmount === 0 
              ? "bg-green-100 text-green-800" 
              : "bg-amber-100 text-amber-800"
          )}>
            {remainingAmount === 0 ? (
              <span>Pagamento completo</span>
            ) : remainingAmount > 0 ? (
              <span>Faltam R$ {remainingAmount.toFixed(2)}</span>
            ) : (
              <span>Excesso de R$ {Math.abs(remainingAmount).toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      
      <SalesSummary
        subtotal={watch('discount') ? finalTotal + (watch('discountType') === 'percentage' ? (finalTotal * watch('discount') / 100) : watch('discount')) - (watch('deliveryFee') || 0) : finalTotal - (watch('deliveryFee') || 0)}
        profit={0} // This should be calculated and passed from parent
        form={form}
        calculateFinalTotal={() => finalTotal}
        deliveryFee={watch('deliveryFee') || 0}
      />
    </div>
  );
};

export default PaymentMethodsSection;
