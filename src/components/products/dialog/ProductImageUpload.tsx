
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

interface ProductImageUploadProps {
  currentImageUrl?: string | null;
  onFileChange: (file: File | null) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  currentImageUrl,
  onFileChange
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
        {previewUrl ? (
          <div className="relative w-full">
            <img 
              src={previewUrl} 
              alt="Product preview" 
              className="mx-auto max-h-40 object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6 rounded-full"
              onClick={handleClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Image className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhuma imagem selecionada
            </p>
          </div>
        )}
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {previewUrl ? 'Trocar imagem' : 'Selecionar imagem'}
        </Button>
      </div>
    </div>
  );
};

export default ProductImageUpload;
