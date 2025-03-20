
import React from 'react';
import { Form } from '@/components/ui/form';
import GlassCard from '@/components/ui/custom/GlassCard';
import ProductAutoFill from './ProductAutoFill';
import NewCategoryDialog from './NewCategoryDialog';
import NewBrandDialog from './NewBrandDialog';
import NewSupplierDialog from './NewSupplierDialog';

// Import the new hook and components
import { useProductForm } from '@/hooks/useProductForm';
import ProductInfoSection from './FormSections/ProductInfoSection';
import PricingSection from './FormSections/PricingSection';
import ClassificationSection from './FormSections/ClassificationSection';
import ImagesSection from './FormSections/ImagesSection';
import FormButtons from './FormSections/FormButtons';

const ProductForm = () => {
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
    // Get the dynamic categories and brands lists
    categories,
    brands
  } = useProductForm();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main product info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main product information card */}
              <ProductInfoSection 
                form={form} 
                onAddCategory={() => setIsNewCategoryDialogOpen(true)}
                onAddBrand={() => setIsNewBrandDialogOpen(true)}
                categories={categories}
                brands={brands}
              />

              {/* Pricing and inventory card */}
              <PricingSection 
                form={form}
                profit={profit}
                profitMargin={profitMargin}
                onMarginChange={handleMarginChange}
                onSalePriceChange={handleSalePriceChange}
              />
            </div>

            {/* Right column - Additional info & images */}
            <div className="space-y-6">
              {/* AI Auto-fill card */}
              <GlassCard borderEffect hoverEffect className="bg-blue-50/30">
                <div className="text-center">
                  <ProductAutoFill onAutoFill={handleAutoFill} />
                </div>
              </GlassCard>

              {/* Product Type and Supplier */}
              <ClassificationSection 
                form={form}
                onAddSupplier={() => setIsNewSupplierDialogOpen(true)}
              />

              {/* Product Images */}
              <ImagesSection 
                previewUrls={previewUrls}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
              />
            </div>
          </div>

          {/* Form buttons */}
          <FormButtons 
            onCancel={() => navigate('/products')}
            onReset={handleResetForm}
            isLoading={isSubmitting}
          />
        </form>
      </Form>

      {/* Dialogs for adding new categories, brands, and suppliers */}
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
