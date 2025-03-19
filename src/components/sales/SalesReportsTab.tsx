
import React from 'react';
import { Button } from '@/components/ui/button';

const SalesReportsTab: React.FC = () => {
  return (
    <div className="text-center p-12">
      <h3 className="text-lg font-medium mb-2">Relatórios de Vendas</h3>
      <p className="text-muted-foreground mb-6">
        Visualize gráficos e análises detalhadas das suas vendas
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline">Vendas por Categoria</Button>
        <Button variant="outline">Vendas por Período</Button>
        <Button variant="outline">Produtos Mais Vendidos</Button>
      </div>
    </div>
  );
};

export default SalesReportsTab;
