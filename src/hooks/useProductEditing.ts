
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Product } from './products/types';

export function useProductEditing(
  updateProduct: (product: Product, imageFile?: File) => Promise<{ success: boolean; error?: Error }>,
  updateCost: (productId: number, newCost: number) => Promise<{ success: boolean; error?: Error }>,
  fetchCostChangeLogs: () => Promise<any[]>
) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock' | 'cost' | 'full'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  useEffect(() => {
    // When dialog closes, trigger a refresh if needed
    if (!editDialogOpen && shouldRefresh) {
      console.log('Dialog closed and refresh needed, reloading page...');
      // Reset the refresh flag
      setShouldRefresh(false);
      
      // Add a delay before refreshing to ensure all operations are complete
      setTimeout(() => {
        // Force a reload of the current page
        window.location.reload();
      }, 800); // Wait 800ms before refreshing
    }
  }, [editDialogOpen, shouldRefresh]);
  
  const openEditDialog = (product: Product, type: 'price' | 'profit' | 'stock' | 'cost' | 'full') => {
    setSelectedProduct(product);
    setEditType(type);
    
    if (type === 'price') {
      setEditValue(product.price.toString());
    } else if (type === 'stock') {
      setEditValue(product.stock.toString());
    } else if (type === 'cost') {
      setEditValue((product.cost || 0).toString());
    } else if (type === 'profit') {
      if (product.cost) {
        const profitMargin = ((product.price - product.cost) / product.cost) * 100;
        setEditValue(profitMargin.toFixed(2));
      } else {
        setEditValue('0');
      }
    }
    
    setEditDialogOpen(true);
    setIsTransitioning(false);
    setShouldRefresh(false);
  };

  const cleanupAfterSave = () => {
    // Ensure we reset all state properly
    setIsSaving(false);
    // Mark that we should refresh the page when dialog fully closes
    console.log('Setting should refresh to true after save');
    setShouldRefresh(true);
    
    // Add a small delay to ensure dialog is closed before resetting state
    setTimeout(() => {
      setSelectedProduct(null);
      setEditValue('');
      setIsTransitioning(false);
    }, 300);
  };

  const handleEditSave = async () => {
    if (!selectedProduct || isSaving) return;
    
    try {
      setIsSaving(true);
      const numericValue = parseFloat(editValue);
      
      if (isNaN(numericValue)) {
        toast.error("The entered value is not valid");
        setIsSaving(false);
        return;
      }
      
      const updatedProduct = { ...selectedProduct };
      
      if (editType === 'price') {
        if (numericValue <= 0) {
          toast.error("The price must be greater than zero");
          setIsSaving(false);
          return;
        }
        updatedProduct.price = numericValue;
        toast.success(`Product price "${selectedProduct.name}" updated to R$ ${numericValue.toFixed(2)}`);
      } 
      else if (editType === 'stock') {
        if (numericValue < 0 || !Number.isInteger(numericValue)) {
          toast.error("The stock quantity must be a positive integer");
          setIsSaving(false);
          return;
        }
        updatedProduct.stock = numericValue;
        toast.success(`Product stock "${selectedProduct.name}" updated to ${numericValue} units`);
      }
      else if (editType === 'cost') {
        if (numericValue < 0) {
          toast.error("The cost must be a positive value");
          setIsSaving(false);
          return;
        }
        await updateCost(selectedProduct.id, numericValue);
        setEditDialogOpen(false);
        cleanupAfterSave();
        return;
      }
      else if (editType === 'profit') {
        if (!selectedProduct.cost) {
          toast.error("Cannot set profit margin without product cost");
          setIsSaving(false);
          return;
        }
        
        const newPrice = selectedProduct.cost * (1 + numericValue / 100);
        updatedProduct.price = newPrice;
        toast.success(`Profit margin for product "${selectedProduct.name}" set to ${numericValue}%`);
      }
      
      await updateProduct(updatedProduct);
      
      // Ensure we close the dialog properly
      setEditDialogOpen(false);
      cleanupAfterSave();
    } catch (error) {
      toast.error("An error occurred while saving changes");
      console.error("Edit save error:", error);
      setIsSaving(false);
    }
  };

  const handleFullEditSave = async (updatedProduct: Product) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      // Extract the file before sending to updateProduct
      const imageFile = (updatedProduct as any).file;
      
      console.log('Starting full edit save with image:', imageFile ? 'Yes' : 'No');
      
      // Create a clean copy of the product without the file property
      const productToUpdate = { ...updatedProduct };
      if ('file' in productToUpdate) {
        delete (productToUpdate as any).file;
      }
      
      const result = await updateProduct(productToUpdate, imageFile);
      
      if (result.success) {
        console.log('Product updated successfully, will refresh page after dialog closes');
        // Ensure dialog is closed after successful update
        setEditDialogOpen(false);
        cleanupAfterSave();
      } else {
        toast.error("Error updating product");
        setIsSaving(false);
      }
    } catch (error) {
      toast.error("An error occurred while saving changes");
      console.error("Full edit save error:", error);
      setIsSaving(false);
    }
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    editType,
    selectedProduct,
    editValue,
    setEditValue,
    openEditDialog,
    handleEditSave,
    handleFullEditSave,
    isSaving,
    isTransitioning,
    setIsTransitioning
  };
}
