
import React, { ChangeEvent } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageUploadProps {
  currentImageUrl?: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ 
  currentImageUrl,
  onFileChange
}) => {
  return (
    <div className="space-y-3">
      <div className="border rounded-md p-4 bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <label htmlFor="product-image-upload" className="cursor-pointer">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center">
                <Image className="h-5 w-5" />
              </div>
              <input 
                id="product-image-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onFileChange}
              />
            </label>
          </div>
          
          <div className="flex-1">
            <label 
              htmlFor="product-image-upload"
              className="block w-full cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              <span className="font-medium text-foreground">Clique para fazer upload</span> ou arraste e solte a imagem aqui
            </label>
          </div>
        </div>
      </div>
      
      {currentImageUrl && (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="h-40 object-contain rounded-md bg-muted/40 w-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => {}}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
