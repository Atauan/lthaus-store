
import React from 'react';
import { Upload, XCircle, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import IconButton from '@/components/ui/custom/IconButton';

interface ImagesSectionProps {
  previewUrls: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  existingImageUrl?: string;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  previewUrls,
  onImageUpload,
  onRemoveImage,
  existingImageUrl
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" /> 
          Imagens do Produto
        </CardTitle>
        <CardDescription>
          Adicione até 5 imagens do produto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Show existing image if available */}
          {existingImageUrl && previewUrls.length === 0 && (
            <div className="relative">
              <img 
                src={existingImageUrl} 
                alt="Existing product image"
                className="w-20 h-20 object-cover rounded-md border"
              />
              <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 text-xs">
                Current
              </div>
            </div>
          )}
          
          {/* Show new uploaded images */}
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img 
                src={url} 
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-md border"
              />
              <IconButton
                type="button"
                variant="primary"
                size="sm"
                className="absolute -top-2 -right-2"
                onClick={() => onRemoveImage(index)}
              >
                <XCircle className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          
          {previewUrls.length < 5 && (
            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-md cursor-pointer hover:bg-primary/5 transition-colors">
              <Upload className="h-5 w-5 text-primary/70" />
              <span className="text-xs text-primary/70 mt-1">Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onImageUpload}
                multiple={true}
              />
            </label>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {existingImageUrl && previewUrls.length === 0 
            ? "Uploading a new image will replace the current one" 
            : "Formatos suportados: JPG, PNG e WEBP"}
        </p>
      </CardContent>
    </Card>
  );
};

export default ImagesSection;
