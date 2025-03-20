
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsTable from '@/components/products/ProductsTable';
import EditProductDialog from '@/components/products/EditProductDialog';
import CostChangesTab from '@/components/products/CostChangesTab';
import { useProducts } from '@/hooks/useProducts';
import { useProductEditing } from '@/hooks/useProductEditing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    loading
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
    handleFullEditSave
  } = useProductEditing(updateProduct, updateCost, fetchCostChangeLogs);

  const [recentCostChanges, setRecentCostChanges] = useState<any[]>([]);

  useEffect(() => {
    fetchCostChangeLogs().then(logs => {
      const recentChanges = logs.slice(0, 5);
      setRecentCostChanges(recentChanges);
    });
  }, [fetchCostChangeLogs]);

  useEffect(() => {
    if (!editDialogOpen && (editType === 'cost' || editType === 'profit' || (editType === 'price' && selectedProduct?.cost))) {
      // Update cost logs after closing dialog if we made changes that could affect costs
      setTimeout(() => {
        fetchCostChangeLogs().then(logs => {
          const recentChanges = logs.slice(0, 5);
          setRecentCostChanges(recentChanges);
        });
      }, 1000);
    }
  }, [editDialogOpen, editType, selectedProduct, fetchCostChangeLogs]);

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success("Produto excluído com sucesso!");
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <ProductsHeader handleAddProduct={handleAddProduct} />

          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="cost-changes">Alterações de Custo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
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

              <ProductsTable 
                filteredProducts={filteredProducts}
                totalProducts={products.length}
                openEditDialog={openEditDialog}
                onDelete={handleDeleteProduct}
              />
            </TabsContent>
            
            <TabsContent value="cost-changes">
              <CostChangesTab 
                recentCostChanges={recentCostChanges}
                loading={loading}
              />
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
      />
    </PageTransition>
  );
};

export default Products;
