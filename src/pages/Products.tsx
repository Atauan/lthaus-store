
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import PageTransition from '@/components/layout/PageTransition';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsTable from '@/components/products/ProductsTable';
import EditProductDialog from '@/components/products/EditProductDialog';
import CostChangesTab from '@/components/products/CostChangesTab';
import { useProducts } from '@/hooks/useProducts';
import { useProductEditing } from '@/hooks/useProductEditing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    updateProduct,
    updateCost,
    deleteProduct,
    fetchCostChangeLogs,
    costChangeLogs,
    loading,
    hasMore,
    loadMore
  } = useProducts();

  const {
    editDialogOpen,
    setEditDialogOpen,
    editType,
    selectedProduct,
    editValue,
    setEditValue,
    openEditDialog,
    handleEditSave,
    handleFullEditSave,
    isSaving,
    isTransitioning,
    setIsTransitioning
  } = useProductEditing(updateProduct, updateCost, fetchCostChangeLogs);

  const [recentCostChanges, setRecentCostChanges] = useState<any[]>([]);
  const [refreshingData, setRefreshingData] = useState(false);

  // Load cost changes when component mounts
  useEffect(() => {
    fetchCostChangeLogs().then(logs => {
      const recentChanges = logs.slice(0, 5);
      setRecentCostChanges(recentChanges);
    });
  }, [fetchCostChangeLogs]);

  // Update cost logs after dialog closes if we made changes
  useEffect(() => {
    if (!editDialogOpen && (editType === 'cost' || editType === 'profit' || (editType === 'price' && selectedProduct?.cost))) {
      // Update cost logs after closing dialog if we made changes that could affect costs
      setRefreshingData(true);
      
      setTimeout(() => {
        fetchCostChangeLogs().then(logs => {
          const recentChanges = logs.slice(0, 5);
          setRecentCostChanges(recentChanges);
          setRefreshingData(false);
        });
      }, 1000);
    }
  }, [editDialogOpen, editType, selectedProduct, fetchCostChangeLogs]);

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success("Product deleted successfully!");
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <ProductsHeader handleAddProduct={handleAddProduct} />

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="cost-changes">Cost Changes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="space-y-4">
                <ProductsFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  categories={['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios']}
                  brands={['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic']}
                />

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Loading products...</span>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border bg-white shadow">
                    <ProductsTable 
                      filteredProducts={filteredProducts}
                      totalProducts={products.length}
                      openEditDialog={openEditDialog}
                      onDelete={handleDeleteProduct}
                      hasMore={hasMore}
                      loadMore={loadMore}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="cost-changes">
              {refreshingData ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg">Refreshing cost data...</span>
                </div>
              ) : (
                <CostChangesTab 
                  recentCostChanges={recentCostChanges}
                  loading={false} // Added the missing loading prop
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditProductDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        selectedProduct={selectedProduct}
        editType={editType}
        editValue={editValue}
        setEditValue={setEditValue}
        onSave={handleEditSave}
        onFullSave={handleFullEditSave}
        isTransitioning={isTransitioning}
        setIsTransitioning={setIsTransitioning}
      />
    </PageTransition>
  );
};

export default Products;
