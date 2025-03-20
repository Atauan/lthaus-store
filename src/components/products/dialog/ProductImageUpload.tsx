
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface ProductImageUploadProps {
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onClearImage: () => void;
  productName: string;
  imageUrl: string;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  previewUrl,
  onFileChange,
  onUrlChange,
  onClearImage,
  productName,
  imageUrl
}) => {
  return (
    <div className="space-y-2">
      <Label className="mb-1 block">Imagem do Produto</Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-sm text-muted-foreground">Inserir URL da imagem</Label>
          <Input
            id="image-url"
            type="text"
            value={imageUrl || ''}
            onChange={(e) => onUrlChange(e.target.value)}
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
                onChange={onFileChange}
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>
      
      {previewUrl && (
        <div className="mt-3 relative inline-block">
          <div className="w-24 h-24 rounded border overflow-hidden">
            <img 
              src={previewUrl} 
              alt={productName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <button 
            type="button" 
            onClick={onClearImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
