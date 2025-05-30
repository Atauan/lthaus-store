
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuppliersHeaderProps {
  onAddSupplier: () => void;
}

const SuppliersHeader: React.FC<SuppliersHeaderProps> = ({ onAddSupplier }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus fornecedores de produtos</p>
      </div>
      
      <Button onClick={onAddSupplier}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Fornecedor
      </Button>
    </div>
  );
};

export default SuppliersHeader;
