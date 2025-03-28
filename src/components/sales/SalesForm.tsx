
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SaleDetails } from '@/hooks/sales/types';
import SaleFormContainer from './form/SaleFormContainer';
import { SalesFormValues, SaleItem } from './types/salesTypes';
import SaleInfoSection from './SaleInfoSection';
import ItemsSection from './ItemsSection';
import PaymentMethodsSection from './PaymentMethodsSection';
import DeliverySection from './DeliverySection';
import { useSalesFormSubmit } from './hooks/useSalesFormSubmit';
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
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [profit, setProfit] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  const form = useForm<SalesFormValues>({
    defaultValues: defaultFormValues
  });

  const { 
    saleNumber, 
    onSubmit: handleFormSubmit,
    isReceiptModalOpen,
    savingInProgress,
    setIsReceiptModalOpen,
    handleNewSale,
    handleFinishSale,
    saleData
  } = useSalesFormSubmit();

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

  const getFinalTotal = () => {
    return finalTotal;
  };

  const handleSubmit = (values: SalesFormValues) => {
    handleFormSubmit(values, selectedItems, subtotal, profit, getFinalTotal);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SaleInfoSection form={form} />
          <ItemsSection 
            selectedItems={selectedItems} 
            setSelectedItems={setSelectedItems} 
          />
          <DeliverySection 
            form={form} 
            saleChannel={form.watch('saleChannel')} 
          />
        </div>
        
        <div className="space-y-6">
          <PaymentMethodsSection 
            form={form} 
            finalTotal={finalTotal}
          />
        </div>
      </div>
      
      <SaleFormContainer 
        form={form}
        onSubmit={handleSubmit}
        saleNumber={saleNumber}
        initialData={initialData}
      />
    </div>
  );
};

export default SalesForm;
