
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import SaleInfoSection from './SaleInfoSection';
import ItemsSection from './ItemsSection';
import SalesSummary from './SalesSummary';
import PaymentMethodsSection from './PaymentMethodsSection';
import SaleReceiptModal from './SaleReceiptModal';
import QuickActionsSidebar from './QuickActionsSidebar';
import DeliverySection from './DeliverySection';
import AddTemporaryProductDialog from './AddTemporaryProductDialog';
import { SaleItem, SalesFormValues, SaleData } from './types/salesTypes';
import { 
  generateSaleNumber, 
  calculateSubtotal, 
  calculateProfit, 
  calculateFinalTotal,
  mapSaleFormToDatabase 
} from './utils/salesUtils';
import { useSales } from '@/hooks/useSales';
import { useAuth } from '@/contexts/AuthContext';

const SalesForm = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { createSale } = useSales();
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [saleNumber, setSaleNumber] = useState(generateSaleNumber());
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [savingInProgress, setSavingInProgress] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
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

  const onSubmit = async (data: SalesFormValues) => {
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

    const saleData: SaleData = {
      ...data,
      saleNumber,
      items: selectedItems,
      subtotal,
      finalTotal: getFinalTotal(),
      profit,
      date: new Date().toISOString()
    };
    
    setSaleData(saleData);
    setIsReceiptModalOpen(true);
  };

  const handleNewSale = () => {
    setSelectedItems([]);
    setSaleNumber(generateSaleNumber());
    setIsReceiptModalOpen(false);
    form.reset({
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
    });
    toast.success("Nova venda iniciada!");
  };

  const handleFinishSale = async () => {
    if (!saleData) return;

    try {
      setSavingInProgress(true);
      const mappedData = mapSaleFormToDatabase(saleData, user?.id);
      
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

  const handleAddTemporaryProduct = (item: SaleItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-10 pt-16 lg:pl-64">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Venda</h1>
          <p className="text-muted-foreground mt-1">Venda #{saleNumber} • {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Produto/Serviço Temporário
          </Button>
          <Button variant="outline" onClick={() => navigate('/sales')}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <QuickActionsSidebar
            subtotal={subtotal}
            profit={profit}
            form={form}
            calculateFinalTotal={getFinalTotal}
            onNewSale={handleNewSale}
          />
        </div>
      </div>
      
      {saleData && (
        <SaleReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          saleData={saleData}
          onNewSale={handleNewSale}
          onFinish={handleFinishSale}
          savingInProgress={savingInProgress}
        />
      )}
      
      <AddTemporaryProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddItem={handleAddTemporaryProduct}
      />
    </div>
  );
};

export default SalesForm;
