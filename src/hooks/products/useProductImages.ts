
import { useState } from 'react';
import { ProductImage } from './types';

export function useProductImages() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images maximum
      const newImages = [...selectedImages, ...filesArray].slice(0, 5);
      setSelectedImages(newImages);

      // Generate preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      
      // Revoke old URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    // Revoke the URL being removed
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  // Clear all images and release resources
  const clearImages = () => {
    // Revoke all preview URLs
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
