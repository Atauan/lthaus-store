
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product } from '@/hooks/products/types';

interface DialogTitleSectionProps {
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full';
  selectedProduct: Product | null;
}

const DialogTitleSection: React.FC<DialogTitleSectionProps> = ({ 
  editType, 
  selectedProduct 
}) => {
  const getDialogTitle = () => {
    switch (editType) {
      case 'price': return 'Alterar Preço';
      case 'profit': return 'Definir Margem de Lucro';
      case 'stock': return 'Atualizar Estoque';
      case 'cost': return 'Alterar Custo';
      case 'full': return 'Editar Produto';
      default: return '';
    }
  };

  return (
    <DialogHeader>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogDescription>
        {selectedProduct && (
          <span>Produto: {selectedProduct.name}</span>
        )}
      </DialogDescription>
    </DialogHeader>
  );
};

export default DialogTitleSection;
