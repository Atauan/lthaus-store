
import React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from '@/hooks/useProducts';

interface EditProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  editType: 'price' | 'profit' | 'stock';
  editValue: string;
  setEditValue: (value: string) => void;
  onSave: () => void;
}

const EditProductDialog = ({
  open,
  setOpen,
  selectedProduct,
  editType,
  editValue,
  setEditValue,
  onSave
}: EditProductDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] border-primary/20">
        <DialogHeader>
          <DialogTitle>
            {editType === 'price' && 'Alterar Preço'}
            {editType === 'profit' && 'Definir Margem de Lucro'}
            {editType === 'stock' && 'Atualizar Estoque'}
          </DialogTitle>
          <DialogDescription>
            {selectedProduct && (
              <span>Produto: {selectedProduct.name}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-value" className="text-right">
              {editType === 'price' && 'Preço (R$)'}
              {editType === 'profit' && 'Margem (%)'}
              {editType === 'stock' && 'Quantidade'}
            </Label>
            <Input
              id="edit-value"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="col-span-3 border-white"
              type="number"
              step={editType === 'stock' ? "1" : "0.01"}
              min={editType === 'stock' ? "0" : undefined}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-white">Cancelar</Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
