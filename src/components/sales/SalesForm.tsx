
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SaleDetails } from '@/hooks/sales/types';
import SaleFormContainer from './form/SaleFormContainer';
import { SalesFormValues } from './types/salesTypes';
import { CustomerSelector } from './CustomerSelector';
import SaleInfoSection from './SaleInfoSection';
import ItemsSection from './ItemsSection';
import PaymentMethodsSection from './PaymentMethodsSection';
import DeliverySection from './DeliverySection';

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
  const [items, setItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
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
        discountType: 'percentage', // Default to percentage
        notes: sale.notes || '',
        deliveryAddress: sale.delivery_address || '',
        deliveryFee: sale.delivery_fee || 0
      };
      
      form.reset(formValues);
      setItems(initialData.items);
    }
  }, [initialData, form]);

  // Calculate totals whenever items or discount changes
  useEffect(() => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(itemsTotal);
    
    // Apply discount
    const discount = form.watch('discount') || 0;
    const discountType = form.watch('discountType');
    const deliveryFee = form.watch('deliveryFee') || 0;
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = itemsTotal * (discount / 100);
    } else {
      discountAmount = discount;
    }
    
    setFinalTotal(Math.max(0, itemsTotal - discountAmount + deliveryFee));
  }, [items, form.watch(['discount', 'discountType', 'deliveryFee'])]);

  const handleSubmit = () => {
    // Handle submission logic
    console.log("Form submitted", form.getValues(), items);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerSelector form={form} />
          <SaleInfoSection form={form} />
          <ItemsSection items={items} setItems={setItems} />
          <DeliverySection form={form} />
        </div>
        
        <div className="space-y-6">
          <PaymentMethodsSection 
            form={form} 
            subtotal={subtotal}
            finalTotal={finalTotal}
          />
        </div>
      </div>
      
      <SaleFormContainer 
        form={form}
        onSubmit={handleSubmit}
      >
        {/* This is where children would go */}
      </SaleFormContainer>
    </div>
  );
};

export default SalesForm;
