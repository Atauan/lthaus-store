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

interface SalesTableProps {
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
  // ... (rest of the component code remains the same)

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          {/* ... (table header and body remain the same) */}
        </Table>
      </div>
      
      {hasMore && (
        <div className="p-4 text-center">
          <Button onClick={loadMore} variant="outline">
            Carregar Mais
          </Button>
        </div>
      )}
      
      {/* Revoke Sale Confirmation Dialog */}
      {/* ... (dialog code remains the same) */}
    </>
  );
};

export default SalesTable;
