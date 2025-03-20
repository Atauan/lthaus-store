
import { useFetchSuppliers } from './suppliers/useFetchSuppliers';
import { useCategories } from './suppliers/useCategories';
import { useSupplierOperations } from './suppliers/useSupplierOperations';

// Re-export types
export type { Supplier } from './suppliers/types';

export function useSuppliers() {
  // Use our smaller hooks
  const { 
    suppliers, 
    setSuppliers, 
    loading 
  } = useFetchSuppliers();
  
  const {
    allCategories,
    addCategory
  } = useCategories();
  
  const {
    addSupplier,
    updateSupplier,
    deleteSupplier
  } = useSupplierOperations(suppliers, setSuppliers);
  
  return {
    // State
    suppliers,
    loading,
    allCategories,
    
    // Operations
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addCategory
  };
}
