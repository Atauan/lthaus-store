
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import ImagePreview from './ImagePreview';
import { Product } from '@/hooks/products/useProductTypes';

interface ImageManagerProps {
  product: Product;
  onProductChange: (field: keyof Product, value: any) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ product, onProductChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize preview URL from product data
  useEffect(() => {
    setPreviewUrl(product.image_url || product.image || null);
  }, [product.image_url, product.image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Clean up old object URL if it exists
      if (previewUrl && !product.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Update the product with new image URL and file
      onProductChange('image_url', fileUrl);
      onProductChange('file', file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
    }
    setPreviewUrl(url);
    onProductChange('image_url', url);
    
    // If there was a file, remove it
    if ('file' in product) {
      onProductChange('file', null);
    }
  };

  const clearImage = () => {
    if (selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onProductChange('image_url', '');
    
    // If there was a file, remove it
    if ('file' in product) {
      onProductChange('file', null);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="mb-1 block">Imagem do Produto</Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-sm text-muted-foreground">Inserir URL da imagem</Label>
          <Input
            id="image-url"
            type="text"
            value={product.image_url || ''}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image-file" className="text-sm text-muted-foreground">Ou fazer upload do dispositivo</Label>
          <div className="flex items-center">
            <label 
              htmlFor="image-file"
              className="flex items-center justify-center gap-2 w-full h-9 px-4 py-2 bg-muted hover:bg-muted/80 text-sm font-medium rounded-md cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4" />
              Selecionar arquivo
              <input 
                id="image-file" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>
      
      <ImagePreview 
        previewUrl={previewUrl}
        productName={product.name}
        onClearImage={clearImage}
      />
    </div>
  );
};

export default ImageManager;
