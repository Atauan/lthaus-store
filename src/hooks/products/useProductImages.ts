
import { useState } from 'react';
import { ProductImage } from './types';

export function useProductImages() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Clean up old object URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setSelectedImages(filesArray);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    // Clean up the object URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    // Clean up all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  return {
    selectedImages,
    previewUrls,
    handleImageUpload,
    removeImage,
    clearImages
  };
}
