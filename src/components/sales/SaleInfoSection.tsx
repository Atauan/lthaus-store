
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  User, 
  Phone, 
  Store, 
  ShoppingBag, 
  Instagram, 
  MessageSquare 
} from 'lucide-react';
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
import { saleChannels } from './data/sampleData';
import { SalesFormValues } from './types/salesTypes';
import CustomerSelector, { Customer } from './CustomerSelector';

interface SaleInfoSectionProps {
  form: UseFormReturn<SalesFormValues>;
}

const SaleInfoSection: React.FC<SaleInfoSectionProps> = ({ form }) => {
  const { control, setValue, watch } = form;
  
  // Handler for when a customer is selected
  const handleSelectCustomer = (customer: Customer) => {
    setValue('customerName', customer.name);
    setValue('customerContact', customer.phone || '');
    
    // If delivery address fields exist and there's an address, set them
    if (customer.address) {
      setValue('deliveryAddress', `${customer.address}, ${customer.city || ''} - ${customer.state || ''} ${customer.zipcode || ''}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4">Informações da Venda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="saleChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Venda</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de venda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {saleChannels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        <div className="flex items-center gap-2">
                          {channel.icon === 'Store' && <Store className="h-4 w-4" />}
                          {channel.icon === 'ShoppingBag' && <ShoppingBag className="h-4 w-4" />}
                          {channel.icon === 'Instagram' && <Instagram className="h-4 w-4" />}
                          {channel.icon === 'MessageSquare' && <MessageSquare className="h-4 w-4" />}
                          <span>{channel.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {form.watch('saleChannel') === 'other' && (
          <FormField
            control={control}
            name="otherChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especifique o método</FormLabel>
                <FormControl>
                  <Input placeholder="Método de venda personalizado" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      
        <div className="md:col-span-2">
          <FormLabel>Cliente</FormLabel>
          <CustomerSelector 
            onSelectCustomer={handleSelectCustomer}
            selectedCustomer={watch('customerName') ? {
              id: '',
              name: watch('customerName'),
              phone: watch('customerContact'),
            } : undefined}
          />
        </div>
        
        <FormField
          control={control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Nome do cliente" className="pl-9" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="customerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato do Cliente</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Telefone ou WhatsApp" className="pl-9" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SaleInfoSection;
