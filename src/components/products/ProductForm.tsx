
import React from 'react';
import { Form } from '@/components/ui/form';
import GlassCard from '@/components/ui/custom/GlassCard';
import ProductAutoFill from './ProductAutoFill';
import NewCategoryDialog from './NewCategoryDialog';
import NewBrandDialog from './NewBrandDialog';
import NewSupplierDialog from './NewSupplierDialog';

import { ProductFormProvider, useProductFormContext } from '@/contexts/ProductFormContext';
import ProductInfoSection from './FormSections/ProductInfoSection';
import PricingSection from './FormSections/PricingSection';
import ClassificationSection from './FormSections/ClassificationSection';
import ImagesSection from './FormSections/ImagesSection';
import FormButtons from './FormSections/FormButtons';
import { Product } from '@/hooks/products/types';

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

// Inner component that uses the context
const ProductFormContent: React.FC = () => {
  const {
    form,
    onSubmit,
    isEditing,
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier
  } = useProductFormContext();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProductInfoSection />
              <PricingSection />
            </div>

            <div className="space-y-6">
              {!isEditing && (
                <GlassCard borderEffect hoverEffect className="bg-blue-50/30">
                  <div className="text-center">
                    <ProductAutoFill />
                  </div>
                </GlassCard>
              )}

              <ClassificationSection />
              <ImagesSection />
            </div>
          </div>

          <FormButtons />
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

// Main component that provides the context
const ProductForm: React.FC<ProductFormProps> = ({ product, isEditing = false }) => {
  return (
    <ProductFormProvider product={product} isEditing={isEditing}>
      <ProductFormContent />
    </ProductFormProvider>
  );
};

export default ProductForm;
