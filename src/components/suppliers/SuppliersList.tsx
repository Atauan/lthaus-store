import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Supplier } from '@/hooks/products/useSuppliers';
import SupplierCard from './SupplierCard';

interface SuppliersListProps {
  suppliers: Supplier[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
  onEditSupplier?: (supplier: Supplier) => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({
  suppliers,
  loading,
  searchQuery,
  onSearchChange,
  onDeleteSupplier,
  onEditSupplier,
}) => {
  const filteredSuppliers = suppliers.filter(supplier => {
    const searchLower = searchQuery.toLowerCase();
    return supplier.name.toLowerCase().includes(searchLower) || 
           (supplier.contact_name && supplier.contact_name.toLowerCase().includes(searchLower)) ||
           (supplier.categories && supplier.categories.some(category => 
             category.toLowerCase().includes(searchLower)
           ));
  });
  
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar fornecedor por nome, contato ou categoria..." 
            className="pl-9"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando fornecedores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <SupplierCard 
                key={supplier.id} 
                supplier={supplier}
                onDeleteSupplier={onDeleteSupplier}
                onEditSupplier={onEditSupplier}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                Nenhum fornecedor encontrado. Tente ajustar sua busca.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SuppliersList;
