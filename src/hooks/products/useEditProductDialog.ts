
import { useEffect, useState } from 'react';
import { Product } from '@/hooks/useProducts';

export function useEditProductDialog(
  selectedProduct: Product | null,
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full',
  open: boolean,
  onFullSave?: (updatedProduct: Product) => void,
) {
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localIsTransitioning, setLocalIsTransitioning] = useState(false);

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
        setLocalIsTransitioning(false);
      }, 300);
    } else if (editType === 'full' && selectedProduct) {
      setFullEditProduct({...selectedProduct});
      setPreviewUrl(selectedProduct.image_url || selectedProduct.image || null);
    }
  }, [open, editType, selectedProduct]);

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
      setLocalIsTransitioning(true);
      
      const productToSave = {
        ...fullEditProduct,
        file: selectedFile
      } as any;
      
      onFullSave(productToSave);
    }
  };

  return {
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
  };
}
