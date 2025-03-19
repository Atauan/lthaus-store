
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from "sonner";
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsTable from '@/components/products/ProductsTable';
import EditProductDialog from '@/components/products/EditProductDialog';
import { useProducts, categories, brands, Product } from '@/hooks/useProducts';

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
    updateProduct
  } = useProducts();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const openEditDialog = (product: Product, type: 'price' | 'profit' | 'stock') => {
    setSelectedProduct(product);
    setEditType(type);
    
    if (type === 'price') {
      setEditValue(product.price.toString());
    } else if (type === 'stock') {
      setEditValue(product.stock.toString());
    } else if (type === 'profit') {
      // Calculate profit percentage if cost exists
      if (product.cost) {
        const profitMargin = ((product.price - product.cost) / product.cost) * 100;
        setEditValue(profitMargin.toFixed(2));
      } else {
        setEditValue('0');
      }
    }
    
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedProduct) return;
    
    try {
      const numericValue = parseFloat(editValue);
      
      if (isNaN(numericValue)) {
        toast.error("O valor inserido não é válido");
        return;
      }
      
      const updatedProduct = { ...selectedProduct };
      
      if (editType === 'price') {
        if (numericValue <= 0) {
          toast.error("O preço deve ser maior que zero");
          return;
        }
        updatedProduct.price = numericValue;
        toast.success(`Preço do produto "${selectedProduct.name}" atualizado para R$ ${numericValue.toFixed(2)}`);
      } 
      else if (editType === 'stock') {
        if (numericValue < 0 || !Number.isInteger(numericValue)) {
          toast.error("A quantidade em estoque deve ser um número inteiro positivo");
          return;
        }
        updatedProduct.stock = numericValue;
        toast.success(`Estoque do produto "${selectedProduct.name}" atualizado para ${numericValue} unidades`);
      } 
      else if (editType === 'profit') {
        if (!selectedProduct.cost) {
          toast.error("Não é possível definir margem de lucro sem o custo do produto");
          return;
        }
        
        // Calculate new price based on cost and profit margin
        const newPrice = selectedProduct.cost * (1 + numericValue / 100);
        updatedProduct.price = newPrice;
        toast.success(`Margem de lucro do produto "${selectedProduct.name}" definida para ${numericValue}%`);
      }
      
      // Update the product in our state
      updateProduct(updatedProduct);
      
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <ProductsHeader handleAddProduct={handleAddProduct} />

          <ProductsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            categories={categories}
            brands={brands}
          />

          <ProductsTable 
            filteredProducts={filteredProducts}
            totalProducts={products.length}
            openEditDialog={openEditDialog}
          />
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
      />
    </PageTransition>
  );
};

export default Products;
