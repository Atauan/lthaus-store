
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Edit, X, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  status?: string;
};

export interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
  onViewSale?: (saleId: number) => void;
  onRevokeSale?: (saleId: number) => void;
  hasMore: boolean;
  loadMore: () => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ 
  sales, 
  isLoading = false,
  onViewSale,
  onRevokeSale,
  hasMore,
  loadMore
}) => {
  const isMobile = useIsMobile();
  const [saleToRevoke, setSaleToRevoke] = useState<number | null>(null);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Handle view sale details
  const handleViewSale = (saleId: number) => {
    if (onViewSale) {
      onViewSale(saleId);
    }
  };

  // Handle revoke sale confirmation
  const handleRevokeSaleConfirm = (saleId: number) => {
    setSaleToRevoke(saleId);
    setIsRevokeDialogOpen(true);
  };

  // Handle revoke sale
  const handleRevokeSale = async () => {
    if (saleToRevoke && onRevokeSale) {
      await onRevokeSale(saleToRevoke);
    }
    setIsRevokeDialogOpen(false);
    setSaleToRevoke(null);
  };

  // Handle edit sale
  const handleEditSale = (saleId: number) => {
    navigate(`/sales/edit/${saleId}`);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              {!isMobile && <TableHead>Cliente</TableHead>}
              {!isMobile && <TableHead>Itens</TableHead>}
              <TableHead>Método</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  {!isMobile && <TableCell><Skeleton className="h-4 w-32" /></TableCell>}
                  {!isMobile && <TableCell><Skeleton className="h-4 w-32" /></TableCell>}
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 6 : 8} className="h-24 text-center">
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            ) : (
              sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell>
                    {typeof sale.date === 'string' ? format(new Date(sale.date), 'dd/MM/yy', { locale: ptBR }) : ''}
                  </TableCell>
                  {!isMobile && (
                    <TableCell className="max-w-[150px] truncate">
                      {sale.customer || "Cliente não identificado"}
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      {sale.items && Array.isArray(sale.items) ? (
                        `${sale.items.length} ${sale.items.length === 1 ? 'item' : 'itens'}`
                      ) : '0 itens'}
                    </TableCell>
                  )}
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell className="font-semibold">
                    {typeof sale.total === 'number' ? `R$ ${sale.total.toFixed(2)}` : ''}
                  </TableCell>
                  <TableCell>
                    {sale.status === 'canceled' ? (
                      <Badge variant="destructive">Cancelada</Badge>
                    ) : (
                      <Badge variant="outline">Concluída</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewSale(sale.id)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {sale.status !== 'canceled' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSale(sale.id)}
                          title="Editar venda"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevokeSaleConfirm(sale.id)}
                          title="Cancelar venda"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {hasMore && (
        <div className="p-4 text-center">
          <Button onClick={loadMore} variant="outline">
            Carregar Mais
          </Button>
        </div>
      )}
      
      <AlertDialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Cancelar Venda
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta venda? Esta ação não poderá ser desfeita 
              e os produtos serão retornados ao estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter venda</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRevokeSale}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalesTable;
