
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string | null;
  productName: string;
  onClearImage: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  productName,
  onClearImage
}) => {
  if (!previewUrl) return null;
  
  return (
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
  );
};

export default ImagePreview;
