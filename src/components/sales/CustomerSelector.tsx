
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { SalesFormValues } from './types/salesTypes';

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
};

interface CustomerSelectorProps {
  form: UseFormReturn<SalesFormValues>;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ form }) => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { setValue, watch } = form;
  const customerName = watch('customerName');
  const customerContact = watch('customerContact');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setCustomers(data as Customer[]);
      } catch (error: any) {
        toast.error(`Erro ao carregar clientes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  const filteredCustomers = searchQuery 
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchQuery)) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : customers;
  
  // Handler for when a customer is selected
  const handleSelectCustomer = (customer: Customer) => {
    setValue('customerName', customer.name);
    setValue('customerContact', customer.phone || '');
    
    // If delivery address fields exist and there's an address, set them
    if (customer.address) {
      setValue('deliveryAddress', `${customer.address}, ${customer.city || ''} - ${customer.state || ''} ${customer.zipcode || ''}`);
    }
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {customerName ? customerName : "Selecionar Cliente"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar cliente..." 
            onValueChange={setSearchQuery}
          />
          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Carregando clientes...
            </div>
          ) : (
            <>
              <CommandEmpty>
                Nenhum cliente encontrado.
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {filteredCustomers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.id}
                    onSelect={() => handleSelectCustomer(customer)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        customerName === customer.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div className="font-medium">{customer.name}</div>
                      {customer.phone && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                        </div>
                      )}
                      {customer.address && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> 
                          {customer.address}, {customer.city} - {customer.state}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSelector;
