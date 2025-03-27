import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Receipt, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SalesSummary from './SalesSummary';
import { UseFormReturn } from 'react-hook-form';
import { SalesFormValues } from './types/salesTypes';

interface QuickActionsSidebarProps {
  subtotal: number;
  profit: number;
  form: UseFormReturn<SalesFormValues>;
  calculateFinalTotal: () => number;
  onNewSale: () => void;
}

const QuickActionsSidebar: React.FC<QuickActionsSidebarProps> = ({
  subtotal,
  profit,
  form,
  calculateFinalTotal,
  onNewSale
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sticky top-24">
      <SalesSummary 
        subtotal={subtotal}
        profit={profit}
        form={form}
        calculateFinalTotal={calculateFinalTotal}
        className="hidden lg:block"
      />
      
      <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
        <h2 className="text-lg font-semibold">Ações Rápidas</h2>
        
        <Button variant="outline" className="w-full justify-start" onClick={onNewSale} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/sales')} type="button">
          <Receipt className="mr-2 h-4 w-4" />
          Histórico de Vendas
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/products/add')} type="button">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Cadastrar Produto
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsSidebar;
