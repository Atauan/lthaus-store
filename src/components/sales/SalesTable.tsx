
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

interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
  onViewSale?: (saleId: number) => void;
  onRevokeSale?: (saleId: number) => void;
}

const SalesTable = ({ 
  sales, 
  isLoading = false,
  onViewSale,
  onRevokeSale
}: SalesTableProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [saleToRevoke, setSaleToRevoke] = useState<number | null>(null);
  
  // Handle edit sale
  const handleEditSale = (saleId: number) => {
    navigate(`/sales/edit/${saleId}`);
  };
  
  // Handle view sale details
  const handleViewSale = (saleId: number) => {
    if (onViewSale) {
      onViewSale(saleId);
    } else {
      navigate(`/sales/view/${saleId}`);
    }
  };
  
  // Handle revoke sale dialog
  const handleOpenRevokeDialog = (saleId: number) => {
    setSaleToRevoke(saleId);
  };
  
  // Handle confirm revoke
  const handleConfirmRevoke = () => {
    if (saleToRevoke && onRevokeSale) {
      onRevokeSale(saleToRevoke);
      toast.success("Venda cancelada com sucesso");
    } else {
      toast.error("Não foi possível cancelar a venda");
    }
    setSaleToRevoke(null);
  };
  
  // Handle cancel revoke
  const handleCancelRevoke = () => {
    setSaleToRevoke(null);
  };
  
  // Internal format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
    if (!status || status === 'completed') {
      return <Badge variant="success">Concluída</Badge>;
    }
    if (status === 'revoked') {
      return <Badge variant="destructive">Cancelada</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="outline">Pendente</Badge>;
    }
    return <Badge>{status}</Badge>;
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
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary">{sale.paymentMethod}</Badge>
                {sale.status && getStatusBadge(sale.status)}
              </div>
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
                <Button size="sm" variant="outline" onClick={() => handleViewSale(sale.id)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                {(!sale.status || sale.status !== 'revoked') && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEditSale(sale.id)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleOpenRevokeDialog(sale.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className={sale.status === 'revoked' ? 'bg-red-50/20' : ''}>
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
                <TableCell>
                  {getStatusBadge(sale.status)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  R$ {sale.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => handleViewSale(sale.id)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {(!sale.status || sale.status !== 'revoked') && (
                      <>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleEditSale(sale.id)}
                          title="Editar venda"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          size="icon" 
                          variant="destructive"
                          onClick={() => handleOpenRevokeDialog(sale.id)}
                          title="Cancelar venda"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Revoke Sale Confirmation Dialog */}
      <AlertDialog open={saleToRevoke !== null} onOpenChange={() => !saleToRevoke && setSaleToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancelar Venda
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a cancelar a venda #{saleToRevoke}. Esta ação não pode ser desfeita.
              O cancelamento irá marcar a venda como cancelada e ajustar o estoque dos produtos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRevoke}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalesTable;
