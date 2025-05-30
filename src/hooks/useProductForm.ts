
import { Product, ProductFormValues } from './products/types';
import { useProducts } from './useProducts';
import { useProductPricing } from './products/useProductPricing';
import { useProductImages } from './products/useProductImages';
import { useProductFormDialogs } from './products/useProductFormDialogs';
import { useSuppliers } from './products/useSuppliers';
import { useProductFormCore } from './products/form/useProductFormCore';
import { useProductFormReset } from './products/form/useProductFormReset';
import { useProductFormAutofill } from './products/form/useProductFormAutofill';
import { useProductFormSubmit } from './products/form/useProductFormSubmit';
import { useProductFormInit } from './products/form/useProductFormInit';

// Re-export the type with the 'export type' syntax
export type { ProductFormValues } from './products/types';

export function useProductForm(editProduct?: Product, isEditing = false) {
  // Use the core form hook to set up the form
  const { form, navigate, isSubmitting, setIsSubmitting } = useProductFormCore(editProduct, isEditing);
  
  // Get product operations from the products hook
  const { addProduct, updateProduct } = useProducts();
  
  // Use the extracted pricing hook
  const { 
    profit, 
    profitMargin, 
    handleMarginChange, 
    handleSalePriceChange,
    setInitialProfitMargin
  } = useProductPricing(form);

  // Initialize form data for editing
  useProductFormInit(isEditing, editProduct, setInitialProfitMargin);

  // Use the extracted images hook
  const { 
    selectedImages, 
    previewUrls, 
    handleImageUpload, 
    removeImage, 
    clearImages 
  } = useProductImages();

  // Use the reset form hook
  const { handleResetForm } = useProductFormReset(
    form, 
    isEditing, 
    editProduct, 
    clearImages, 
    setInitialProfitMargin
  );

  // Use the auto-fill hook
  const { handleAutoFill } = useProductFormAutofill(form, handleMarginChange);

  // Use the form submission hook
  const { onSubmit } = useProductFormSubmit(
    form,
    isEditing,
    editProduct,
    selectedImages,
    { addProduct, updateProduct },
    navigate,
    setIsSubmitting
  );

  // Use the extracted dialogs hook
  const { 
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    categories,
    brands
  } = useProductFormDialogs(form);

  // Use the suppliers hook directly
  const { suppliers } = useSuppliers();

  return {
    form,
    profit,
    profitMargin,
    selectedImages,
    previewUrls,
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleMarginChange,
    handleSalePriceChange,
    handleImageUpload,
    removeImage,
    handleResetForm,
    handleAutoFill,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    onSubmit,
    navigate,
    isSubmitting,
    categories,
    brands,
    suppliers
  };
}
