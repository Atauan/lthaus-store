
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Product } from '@/hooks/useProducts';
import SimpleEditForm from './dialog/SimpleEditForm';
import FullEditForm from './dialog/FullEditForm';
import DialogTitleSection from './dialog/DialogTitleSection';
import { useEditProductDialog } from '@/hooks/products/useEditProductDialog';

interface EditProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full';
  editValue: string;
  setEditValue: (value: string) => void;
  onSave: () => void;
  onFullSave?: (updatedProduct: Product) => void;
  isTransitioning?: boolean;
  setIsTransitioning?: (value: boolean) => void;
}

const EditProductDialog = ({
  open,
  setOpen,
  selectedProduct,
  editType,
  editValue,
  setEditValue,
  onSave,
  onFullSave,
  isTransitioning,
  setIsTransitioning
}: EditProductDialogProps) => {
  const {
    fullEditProduct,
    selectedFile,
    previewUrl,
    localIsTransitioning,
    setLocalIsTransitioning,
    handleFullEditChange,
    handleFileChange,
    handleImageUrlChange,
    clearImage,
    handleFullSave
  } = useEditProductDialog(selectedProduct, editType, open, onFullSave);

  // Use either the prop or local state for transitioning
  const isInTransition = isTransitioning || localIsTransitioning;
  const updateTransitioning = (value: boolean) => {
    if (setIsTransitioning) {
      setIsTransitioning(value);
    }
    setLocalIsTransitioning(value);
  };

  // Handle closing the dialog
  const handleClose = () => {
    // Prevent multiple close attempts
    if (isInTransition) return;
    
    updateTransitioning(true);
    
    // Use setTimeout to ensure the dialog closing animation completes
    // before we actually close it and reset state
    setTimeout(() => {
      setOpen(false);
    }, 50);
  };

  const handleSimpleSave = () => {
    // Set transitioning state to prevent double-clicks
    updateTransitioning(true);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] border-primary/20">
        <DialogTitleSection 
          editType={editType}
          selectedProduct={selectedProduct}
        />
        
        {editType === 'full' && fullEditProduct ? (
          <FullEditForm
            product={fullEditProduct}
            onProductChange={handleFullEditChange}
            onSave={handleFullSave}
            onCancel={handleClose}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onUrlChange={handleImageUrlChange}
            onClearImage={clearImage}
          />
        ) : (
          <SimpleEditForm
            editType={editType}
            editValue={editValue}
            setEditValue={setEditValue}
            onSave={handleSimpleSave}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
