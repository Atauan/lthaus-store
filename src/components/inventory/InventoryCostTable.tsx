
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CostChangeLog } from '@/hooks/useProducts';

interface InventoryCostTableProps {
  costChangeLogs: CostChangeLog[];
  loading: boolean;
}

const InventoryCostTable = ({ costChangeLogs, loading }: InventoryCostTableProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (costChangeLogs.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Nenhum registro de alteração de custo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Custo Anterior</TableHead>
            <TableHead>Novo Custo</TableHead>
            <TableHead>Variação</TableHead>
            <TableHead>Observações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costChangeLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {new Date(log.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{log.product_name}</TableCell>
              <TableCell>R$ {log.previous_cost.toFixed(2)}</TableCell>
              <TableCell>R$ {log.new_cost.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {log.change_percentage >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">+{log.change_percentage.toFixed(2)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-blue-500">{log.change_percentage.toFixed(2)}%</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {log.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryCostTable;
