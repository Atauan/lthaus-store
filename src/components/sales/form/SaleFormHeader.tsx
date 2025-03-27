import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaleFormHeaderProps {
  saleNumber: number;
  onAddTemporaryItem: () => void;
  onSubmit: () => void;
}

const SaleFormHeader: React.FC<SaleFormHeaderProps> = ({
  saleNumber,
  onAddTemporaryItem,
  onSubmit
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Venda</h1>
        <p className="text-muted-foreground mt-1">Venda #{saleNumber} • {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onAddTemporaryItem}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Produto/Serviço Temporário
        </Button>
        <Button variant="outline" onClick={() => navigate('/sales')}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Finalizar Venda
        </Button>
      </div>
    </div>
  );
};

export default SaleFormHeader;
