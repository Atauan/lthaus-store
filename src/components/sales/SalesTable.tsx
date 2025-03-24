
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isLoading?: boolean;
}

const SalesTable = ({ sales, isLoading = false }: SalesTableProps) => {
  const isMobile = useIsMobile();
  
  // Internal format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
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
      <div className="p-4 sm:p-6 text-center">
        <p className="text-muted-foreground">Nenhuma venda encontrada.</p>
      </div>
    );
  }

  // Simplified view for mobile devices
  if (isMobile) {
    return (
      <div className="px-4 py-3 divide-y">
        {sales.map((sale) => (
          <div key={sale.id} className="py-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">Venda #{sale.id}</span>
                <p className="text-sm text-muted-foreground">{formatDate(sale.date)}</p>
              </div>
              <Badge variant="secondary">{sale.paymentMethod}</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium">Cliente: {sale.customer}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item.quantity}x {item.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">Sem itens</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="font-medium">
                R$ {sale.total.toFixed(2)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline">
                  <FileDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="overflow-x-auto">
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
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1">
                      {item.quantity}x {item.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">Sem itens</span>
                )}
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
