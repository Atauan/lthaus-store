
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from '@/hooks/useProducts';
import SimpleEditForm from './dialog/SimpleEditForm';
import FullEditForm from './dialog/FullEditForm';

interface EditProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full';
  editValue: string;
  setEditValue: (value: string) => void;
  onSave: () => void;
  onFullSave?: (updatedProduct: Product) => void;
}

const EditProductDialog = ({
  open,
  setOpen,
  selectedProduct,
  editType,
  editValue,
  setEditValue,
  onSave,
  onFullSave
}: EditProductDialogProps) => {
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Add a small delay before cleaning up resources to ensure proper animation
      setTimeout(() => {
        // Clean up resources when dialog closes
        if (previewUrl && selectedFile) {
          URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setFullEditProduct(null);
        setIsTransitioning(false);
      }, 300);
    } else if (editType === 'full' && selectedProduct) {
      setFullEditProduct({...selectedProduct});
      setPreviewUrl(selectedProduct.image_url || selectedProduct.image || null);
    }
  }, [open, editType, selectedProduct]);

  // Handle closing the dialog
  const handleClose = () => {
    // Prevent multiple close attempts
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Make sure we clean up resources
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Use setTimeout to ensure the dialog closing animation completes
    // before we actually close it and reset state
    setTimeout(() => {
      setOpen(false);
    }, 50);
  };

  const handleFullEditChange = (field: keyof Product, value: any) => {
    if (fullEditProduct) {
      setFullEditProduct({
        ...fullEditProduct,
        [field]: value
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Clean up old object URL if it exists
      if (previewUrl && !selectedProduct?.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      if (fullEditProduct) {
        handleFullEditChange('image_url', fileUrl);
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
    }
    setPreviewUrl(url);
    
    if (fullEditProduct) {
      handleFullEditChange('image_url', url);
    }
  };

  const clearImage = () => {
    if (selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    
    if (fullEditProduct) {
      handleFullEditChange('image_url', '');
    }
  };

  const handleFullSave = () => {
    if (fullEditProduct && onFullSave) {
      // Set transitioning state to prevent double-clicks
      setIsTransitioning(true);
      
      const productToSave = {
        ...fullEditProduct,
        file: selectedFile
      } as any;
      
      onFullSave(productToSave);
    }
  };

  const handleSimpleSave = () => {
    // Set transitioning state to prevent double-clicks
    setIsTransitioning(true);
    onSave();
  };

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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] border-primary/20">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {selectedProduct && (
              <span>Produto: {selectedProduct.name}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
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
