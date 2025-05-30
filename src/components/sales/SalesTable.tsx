
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sale } from "@/hooks/sales/types";

interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
}

const SalesTable = ({ sales, isLoading = false }: SalesTableProps) => {
  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'pix': 'PIX',
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'cash': 'Dinheiro',
      'bank_transfer': 'Transferência'
    };
    return methodMap[method] || method;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Nenhuma venda encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Número</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">#{sale.sale_number}</TableCell>
              <TableCell>{formatDate(sale.sale_date)}</TableCell>
              <TableCell>{sale.customer_name || 'Venda Balcão'}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {sale.sale_channel || 'Loja'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {formatPaymentMethod(sale.payment_method)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                R$ {sale.subtotal.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-medium">
                R$ {sale.final_total.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesTable;
