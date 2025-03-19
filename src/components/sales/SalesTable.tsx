
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Sale = {
  id: number;
  date: string;
  customer: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  total: number;
};

interface SalesTableProps {
  sales: Sale[];
  formatDate: (dateString: string) => string;
  isLoading?: boolean;
}

const SalesTable = ({ sales, formatDate, isLoading = false }: SalesTableProps) => {
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell>
                {sale.items.map((item, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">
                    {item.quantity}x {item.name}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{sale.paymentMethod}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                R$ {sale.total.toFixed(2)}
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
