
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SaleDetails } from '@/hooks/sales/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SalesFormValues, SaleItem } from './types/salesTypes';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { calculateSubtotal, calculateProfit, calculateFinalTotal } from './utils/salesUtils';

interface SalesFormProps {
  initialData?: SaleDetails | null;
}

const defaultFormValues: SalesFormValues = {
  customerName: '',
  customerContact: '',
  saleChannel: 'store',
  paymentMethods: [{ method: 'cash', amount: 0 }],
  discount: 0,
  discountType: 'percentage',
  notes: '',
};

const SalesForm: React.FC<SalesFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [profit, setProfit] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  const form = useForm<SalesFormValues>({
    defaultValues: defaultFormValues
  });

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      // Set form values from initialData
      const sale = initialData.sale;
      const formValues = {
        customerName: sale.customer_name || '',
        customerContact: sale.customer_contact || '',
        saleChannel: sale.sale_channel || 'store',
        paymentMethods: initialData.payments.map(p => ({
          method: p.method,
          amount: p.amount
        })),
        discount: sale.discount || 0,
        discountType: 'percentage' as const, // Default to percentage
        notes: sale.notes || '',
        deliveryAddress: sale.delivery_address || '',
        deliveryFee: sale.delivery_fee || 0
      };
      
      form.reset(formValues);
      setSelectedItems(initialData.items);
    }
  }, [initialData, form]);

  // Calculate totals whenever items or discount changes
  useEffect(() => {
    const itemsTotal = calculateSubtotal(selectedItems);
    setSubtotal(itemsTotal);
    
    const calculatedProfit = calculateProfit(selectedItems);
    setProfit(calculatedProfit);
    
    // Apply discount
    const discount = form.watch('discount') || 0;
    const discountType = form.watch('discountType');
    const deliveryFee = form.watch('deliveryFee') || 0;
    
    const calculatedTotal = calculateFinalTotal(itemsTotal, discountType, discount, deliveryFee);
    setFinalTotal(calculatedTotal);
  }, [selectedItems, form.watch(['discount', 'discountType', 'deliveryFee'])]);

  const handleSubmit = (values: SalesFormValues) => {
    // This is just a placeholder - in a real implementation, this would call
    // the appropriate functions to save the sale
    console.log('Form values:', values);
    console.log('Selected items:', selectedItems);
    console.log('Subtotal:', subtotal);
    console.log('Profit:', profit);
    console.log('Final total:', finalTotal);
    
    // Navigate back to sales list
    navigate('/sales');
  };

  // Temporary placeholder component for ItemsSection
  const ItemsSection = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Items Section Placeholder</h2>
      <p>This is where the items selection would go.</p>
    </div>
  );

  // Temporary placeholder component for DeliverySection
  const DeliverySection = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Delivery Section Placeholder</h2>
      <p>This is where delivery information would go.</p>
    </div>
  );

  // Temporary placeholder component for PaymentMethodsSection
  const PaymentMethodsSection = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Methods Placeholder</h2>
      <p>This is where payment methods would go.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ItemsSection />
          <DeliverySection />
        </div>
        
        <div className="space-y-6">
          <PaymentMethodsSection />
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações (opcional)</label>
          <Textarea 
            placeholder="Observações sobre a venda..." 
            className="resize-none" 
            {...form.register('notes')} 
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate('/sales')}>
            Cancelar
          </Button>
          <Button type="submit">
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
