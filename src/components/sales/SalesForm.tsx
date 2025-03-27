import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SaleItem, SalesFormValues } from './types/salesTypes';
import { calculateSubtotal, calculateProfit } from '@/hooks/sales/utils/saleCalculations';
import SaleInfoSection from './SaleInfoSection';
import ItemsSection from './ItemsSection';
import SalesSummary from './SalesSummary';
import PaymentMethodsSection from './PaymentMethodsSection';
import SaleReceiptModal from './SaleReceiptModal';
import QuickActionsSidebar from './QuickActionsSidebar';
import DeliverySection from './DeliverySection';
import AddTemporaryProductDialog from './AddTemporaryProductDialog';
import SaleFormHeader from './form/SaleFormHeader';
import SaleFormContainer from './form/SaleFormContainer';
import { useSalesFormSubmit } from './hooks/useSalesFormSubmit';
import PageTransition from '@/components/layout/PageTransition';

const SalesForm = () => {
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  const {
    saleNumber,
    saleData,
    isReceiptModalOpen,
    savingInProgress,
    setIsReceiptModalOpen,
    onSubmit,
    handleNewSale,
    handleFinishSale
  } = useSalesFormSubmit();
  
  const form = useForm<SalesFormValues>({
    defaultValues: {
      customerName: '',
      customerContact: '',
      saleChannel: 'store',
      otherChannel: '',
      paymentMethods: [{ method: 'pix', amount: 0 }],
      discount: 0,
      discountType: 'percentage',
      notes: '',
      deliveryAddress: '',
      deliveryFee: 0,
    },
  });

  // Make sure the form is initialized
  useEffect(() => {
    // Force re-render after form initialization
    if (form) {
      form.reset(form.getValues());
    }
  }, []);

  const subtotal = calculateSubtotal(selectedItems);
  const profit = calculateProfit(selectedItems);
  const deliveryFee = form.watch('deliveryFee') || 0;

  const getFinalTotal = () => {
    return calculateFinalTotal(
      subtotal, 
      form.watch('discountType'), 
      form.watch('discount'),
      deliveryFee
    );
  };
  
  const calculateFinalTotal = (subtotal: number, discountType: 'percentage' | 'fixed', discount: number, deliveryFee: number = 0) => {
    const discountValue = discountType === 'percentage' 
      ? subtotal * (discount / 100)
      : discount;
    
    return Math.max(0, subtotal - discountValue + deliveryFee);
  };

  const handleFormSubmit = () => {
    onSubmit(form.getValues(), selectedItems, subtotal, profit, getFinalTotal);
  };

  const handleNewSaleAction = () => {
    const newFormValues = handleNewSale();
    form.reset(newFormValues);
    setSelectedItems([]);
  };

  const handleAddTemporaryProduct = (item: SaleItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  return (
    <div className="w-full">
      <PageTransition>
        <SaleFormHeader 
          saleNumber={saleNumber}
          onAddTemporaryItem={() => setIsAddProductOpen(true)}
          onSubmit={form.handleSubmit(handleFormSubmit)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SaleFormContainer 
              form={form} 
              onSubmit={handleFormSubmit}
            >
              <SaleInfoSection form={form} />
              
              <ItemsSection 
                selectedItems={selectedItems} 
                setSelectedItems={setSelectedItems} 
              />
              
              <DeliverySection form={form} saleChannel={form.watch('saleChannel')} />
              
              <SalesSummary 
                subtotal={subtotal}
                profit={profit}
                form={form}
                calculateFinalTotal={getFinalTotal}
                deliveryFee={deliveryFee}
              />
              
              <PaymentMethodsSection 
                form={form} 
                total={getFinalTotal()}
              />
            </SaleFormContainer>
          </div>
          
          <div className="lg:col-span-1 hidden lg:block">
            <QuickActionsSidebar
              subtotal={subtotal}
              profit={profit}
              form={form}
              calculateFinalTotal={getFinalTotal}
              onNewSale={handleNewSaleAction}
            />
          </div>
        </div>
        
        {saleData && (
          <SaleReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={() => setIsReceiptModalOpen(false)}
            saleData={saleData}
            onNewSale={handleNewSaleAction}
            onFinish={handleFinishSale}
            savingInProgress={savingInProgress}
          />
        )}
        
        <AddTemporaryProductDialog
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onAddItem={handleAddTemporaryProduct}
        />
      </PageTransition>
    </div>
  );
};

export default SalesForm;
