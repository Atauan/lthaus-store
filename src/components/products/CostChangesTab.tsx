
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

interface CostChange {
  id: string;
  created_at: string;
  product_name: string;
  previous_cost: number;
  new_cost: number;
  change_percentage: number;
}

interface CostChangesTabProps {
  recentCostChanges: CostChange[];
  loading: boolean;
}

const CostChangesTab: React.FC<CostChangesTabProps> = ({ recentCostChanges, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border-primary/20 border rounded-lg shadow-soft overflow-hidden animate-scale-in mb-6">
      <div className="p-4 bg-muted/20 border-b border-primary/10">
        <h3 className="text-lg font-medium">Alterações Recentes de Custo</h3>
        <p className="text-sm text-muted-foreground">
          Produtos com preço de custo alterado recentemente
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Produto</th>
              <th className="text-right p-4">Custo Anterior</th>
              <th className="text-right p-4">Novo Custo</th>
              <th className="text-right p-4">Variação</th>
            </tr>
          </thead>
          <tbody>
            {recentCostChanges.length > 0 ? (
              recentCostChanges.map((log) => (
                <tr key={log.id} className="border-b border-primary/10 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    {new Date(log.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">{log.product_name}</td>
                  <td className="p-4 text-right">R$ {log.previous_cost.toFixed(2)}</td>
                  <td className="p-4 text-right">R$ {log.new_cost.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <span className={log.change_percentage >= 0 ? 'text-green-500' : 'text-blue-500'}>
                      {log.change_percentage >= 0 ? '+' : ''}{log.change_percentage.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  {loading ? (
                    "Carregando alterações de custo..."
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p>Nenhuma alteração de custo encontrada</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-primary/10 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate('/inventory')}
        >
          Ver Histórico Completo
        </Button>
      </div>
    </div>
  );
};

export default CostChangesTab;
