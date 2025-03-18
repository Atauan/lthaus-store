
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  FileText,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
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

interface PaymentMethodsSectionProps {
  form: UseFormReturn<any>;
  total: number;
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ form, total }) => {
  const paymentMethods = form.watch('paymentMethods');
  
  const paymentOptions = [
    { id: 'pix', name: 'PIX', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'debito', name: 'Cartão de Débito', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'credito', name: 'Cartão de Crédito', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'dinheiro', name: 'Dinheiro', icon: <Banknote className="h-4 w-4" /> },
    { id: 'outro', name: 'Outro', icon: <FileText className="h-4 w-4" /> },
  ];
  
  const addPaymentMethod = () => {
    const currentPayments = form.getValues('paymentMethods');
    form.setValue('paymentMethods', [
      ...currentPayments,
      { method: 'pix', amount: 0 }
    ]);
  };
  
  const removePaymentMethod = (index: number) => {
    const currentPayments = form.getValues('paymentMethods');
    if (currentPayments.length > 1) {
      form.setValue('paymentMethods', currentPayments.filter((_, i) => i !== index));
    }
  };
  
  const calculateTotalPaid = () => {
    return paymentMethods.reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);
  };
  
  const handleAmountChange = (index: number, value: string) => {
    const numericValue = parseFloat(value || '0');
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods[index].amount = numericValue;
    form.setValue('paymentMethods', newPaymentMethods);
  };
  
  const remainingTotal = total - calculateTotalPaid();
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Formas de Pagamento</h2>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addPaymentMethod}
          disabled={paymentMethods.length >= 3}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Método
        </Button>
      </div>
      
      <div className="space-y-4">
        {paymentMethods.map((payment: any, index: number) => (
          <div key={index} className="flex gap-4 items-end">
            <FormField
              control={form.control}
              name={`paymentMethods.${index}.method`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={index > 0 ? 'sr-only' : undefined}>
                    Método de Pagamento
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {paymentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormItem className="w-40">
              <FormLabel className={index > 0 ? 'sr-only' : undefined}>
                Valor
              </FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-9"
                  value={payment.amount || ''}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                />
              </div>
            </FormItem>
            
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removePaymentMethod(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        {paymentMethods.length > 0 && (
          <div className="flex justify-between pt-4 border-t text-sm">
            <span>Total Pago:</span>
            <span className={`font-semibold ${Math.abs(remainingTotal) < 0.01 ? 'text-green-600' : ''}`}>
              R$ {calculateTotalPaid().toFixed(2)}
            </span>
          </div>
        )}
        
        {remainingTotal > 0.01 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-sm">
            <p>
              <span className="font-medium">Falta: </span>
              <span className="font-semibold">R$ {remainingTotal.toFixed(2)}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              O valor total dos pagamentos deve ser igual ao valor final da venda.
            </p>
          </div>
        )}
        
        {remainingTotal < -0.01 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-sm">
            <p>
              <span className="font-medium">Troco: </span>
              <span className="font-semibold">R$ {Math.abs(remainingTotal).toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsSection;
