
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from 'lucide-react';
import { StockLog } from '@/hooks/useProducts';

interface InventoryStockTableProps {
  stockLogs: StockLog[];
  loading: boolean;
}

const InventoryStockTable = ({ stockLogs, loading }: InventoryStockTableProps) => {
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

  if (stockLogs.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Nenhum registro de movimentação encontrado.</p>
      </div>
    );
  }

  // Format reference type for display
  const formatReferenceType = (type: string) => {
    const typeMap: Record<string, string> = {
      'sale': 'Venda',
      'purchase': 'Compra',
      'manual_update': 'Atualização Manual',
      'inventory': 'Inventário',
      'return': 'Devolução'
    };
    
    return typeMap[type] || type;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estoque Anterior</TableHead>
            <TableHead>Estoque Atual</TableHead>
            <TableHead>Alteração</TableHead>
            <TableHead>Observações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {new Date(log.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{log.product_name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatReferenceType(log.reference_type)}
                </Badge>
              </TableCell>
              <TableCell>{log.previous_stock}</TableCell>
              <TableCell>{log.new_stock}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {log.change_amount > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">+{log.change_amount}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500">{log.change_amount}</span>
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

export default InventoryStockTable;
