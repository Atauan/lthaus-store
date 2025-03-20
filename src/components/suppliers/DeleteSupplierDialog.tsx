
import React from 'react';
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
import { Supplier } from '@/hooks/products/useSuppliers';

interface DeleteSupplierDialogProps {
  supplier: Supplier | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
}

const DeleteSupplierDialog: React.FC<DeleteSupplierDialogProps> = ({
  supplier,
  onOpenChange,
  onConfirmDelete,
}) => {
  return (
    <AlertDialog open={!!supplier} onOpenChange={(open) => !open && onOpenChange(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o fornecedor "{supplier?.name}"? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSupplierDialog;
