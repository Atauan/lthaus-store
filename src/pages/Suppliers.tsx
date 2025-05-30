
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useSuppliers } from '@/hooks/products/useSuppliers';
import { toast } from 'sonner';
import NewSupplierDialog from '@/components/products/NewSupplierDialog';
import SuppliersHeader from '@/components/suppliers/SuppliersHeader';
import SuppliersList from '@/components/suppliers/SuppliersList';
import DeleteSupplierDialog from '@/components/suppliers/DeleteSupplierDialog';
import type { Supplier } from '@/hooks/products/useSuppliers';

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const { suppliers, loading, addSupplier, deleteSupplier } = useSuppliers();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddSupplier = async (supplierData: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    categories?: string[];
  }) => {
    const result = await addSupplier({
      name: supplierData.name,
      contact_name: supplierData.contactName,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
      categories: supplierData.categories
    });
    
    if (result.success) {
      toast.success(`Fornecedor "${supplierData.name}" adicionado com sucesso!`);
      setIsNewSupplierDialogOpen(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    
    const result = await deleteSupplier(supplierToDelete.id);
    
    if (result.success) {
      toast.success(`Fornecedor "${supplierToDelete.name}" excluído com sucesso!`);
      setSupplierToDelete(null);
    }
  };

  // Handler for the delete dialog's open state changes
  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSupplierToDelete(null);
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <SuppliersHeader onAddSupplier={() => setIsNewSupplierDialogOpen(true)} />
          
          <SuppliersList
            suppliers={suppliers}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onDeleteSupplier={setSupplierToDelete}
          />
        </div>
      </div>
      
      <NewSupplierDialog
        open={isNewSupplierDialogOpen}
        onOpenChange={setIsNewSupplierDialogOpen}
        onAddSupplier={handleAddSupplier}
      />

      <DeleteSupplierDialog
        supplier={supplierToDelete}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirmDelete={handleDeleteSupplier}
      />
    </PageTransition>
  );
};

export default Suppliers;
