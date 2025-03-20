
import React from 'react';
import { Form } from '@/components/ui/form';
import GlassCard from '@/components/ui/custom/GlassCard';
import ProductAutoFill from './ProductAutoFill';
import NewCategoryDialog from './NewCategoryDialog';
import NewBrandDialog from './NewBrandDialog';
import NewSupplierDialog from './NewSupplierDialog';

import { useProductForm } from '@/hooks/useProductForm';
import ProductInfoSection from './FormSections/ProductInfoSection';
import PricingSection from './FormSections/PricingSection';
import ClassificationSection from './FormSections/ClassificationSection';
import ImagesSection from './FormSections/ImagesSection';
import FormButtons from './FormSections/FormButtons';
import { Product } from '@/hooks/products/useProductTypes';

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isEditing = false }) => {
  const {
    form,
    profit,
    profitMargin,
    selectedImages,
    previewUrls,
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleMarginChange,
    handleSalePriceChange,
    handleImageUpload,
    removeImage,
    handleResetForm,
    handleAutoFill,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    onSubmit,
    navigate,
    isSubmitting,
    categories,
    brands,
    suppliers
  } = useProductForm(product, isEditing);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProductInfoSection 
                form={form} 
                onAddCategory={() => setIsNewCategoryDialogOpen(true)}
                onAddBrand={() => setIsNewBrandDialogOpen(true)}
                categories={categories}
                brands={brands}
              />

              <PricingSection 
                form={form}
                profit={profit}
                profitMargin={profitMargin}
                onMarginChange={handleMarginChange}
                onSalePriceChange={handleSalePriceChange}
              />
            </div>

            <div className="space-y-6">
              {!isEditing && (
                <GlassCard borderEffect hoverEffect className="bg-blue-50/30">
                  <div className="text-center">
                    <ProductAutoFill onAutoFill={handleAutoFill} />
                  </div>
                </GlassCard>
              )}

              <ClassificationSection 
                form={form}
                onAddSupplier={() => setIsNewSupplierDialogOpen(true)}
                suppliers={suppliers}
              />

              <ImagesSection 
                previewUrls={previewUrls}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                existingImageUrl={isEditing && product ? product.image_url : undefined}
              />
            </div>
          </div>

          <FormButtons 
            onCancel={() => navigate('/products')}
            onReset={handleResetForm}
            isLoading={isSubmitting}
            isEditing={isEditing}
          />
        </form>
      </Form>

      <NewCategoryDialog 
        open={isNewCategoryDialogOpen}
        onOpenChange={setIsNewCategoryDialogOpen}
        onAddCategory={handleAddCategory}
      />
      
      <NewBrandDialog 
        open={isNewBrandDialogOpen}
        onOpenChange={setIsNewBrandDialogOpen}
        onAddBrand={handleAddBrand}
      />
      
      <NewSupplierDialog 
        open={isNewSupplierDialogOpen}
        onOpenChange={setIsNewSupplierDialogOpen}
        onAddSupplier={handleAddSupplier}
      />
    </div>
  );
};

export default ProductForm;
