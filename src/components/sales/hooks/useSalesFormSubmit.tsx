
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SalesFormValues, SaleData, SaleItem } from '../types/salesTypes';
import { generateSaleNumber } from '@/hooks/sales/utils/saleCalculations';
import { mapSaleFormToDatabase } from '@/hooks/sales/utils/saleDataMappers';
import { useSales } from '@/hooks/useSales';

export function useSalesFormSubmit() {
  const navigate = useNavigate();
  const { createSale } = useSales();
  const [saleNumber, setSaleNumber] = useState(generateSaleNumber());
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  const onSubmit = async (data: SalesFormValues, selectedItems: SaleItem[], subtotal: number, profit: number, getFinalTotal: () => number) => {
    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um item à venda");
      return;
    }

    // Update payment methods with correct total if not already set
    if (data.paymentMethods[0].amount === 0) {
      data.paymentMethods[0].amount = getFinalTotal();
    }

    // Check if the total payment amount matches the final total
    const totalPaymentAmount = data.paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
    if (Math.abs(totalPaymentAmount - getFinalTotal()) > 0.01) {
      toast.error("O valor total dos pagamentos deve ser igual ao valor final da venda");
      return;
    }

    const formSaleData: SaleData = {
      ...data,
      saleNumber,
      items: selectedItems,
      subtotal,
      finalTotal: getFinalTotal(),
      profit,
      date: new Date().toISOString()
    };
    
    setSaleData(formSaleData);
    setIsReceiptModalOpen(true);
  };

  const handleNewSale = () => {
    setSaleNumber(generateSaleNumber());
    setIsReceiptModalOpen(false);
    return {
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
    } as SalesFormValues;
  };

  const handleFinishSale = async () => {
    if (!saleData) return;

    try {
      setSavingInProgress(true);
      const mappedData = mapSaleFormToDatabase(saleData);
      
      const result = await createSale(
        mappedData.sale,
        mappedData.items,
        mappedData.payments
      );

      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao salvar venda');
      }

      toast.success("Venda finalizada com sucesso!");
      setIsReceiptModalOpen(false);
      navigate('/sales');
    } catch (error: any) {
      toast.error(`Erro ao finalizar venda: ${error.message}`);
    } finally {
      setSavingInProgress(false);
    }
  };

  return {
    saleNumber,
    saleData,
    isReceiptModalOpen,
    savingInProgress,
    setIsReceiptModalOpen,
    onSubmit,
    handleNewSale,
    handleFinishSale
  };
}
