
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from "sonner";
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsTable from '@/components/products/ProductsTable';
import EditProductDialog from '@/components/products/EditProductDialog';
import { useProducts, Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

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
    deleteProduct,
    fetchCostChangeLogs,
    costChangeLogs,
    loading
  } = useProducts();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock' | 'cost' | 'full'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [recentCostChanges, setRecentCostChanges] = useState<any[]>([]);

  // Fetch recent cost changes
  useEffect(() => {
    fetchCostChangeLogs().then(logs => {
      // Get the 5 most recent cost changes
      const recentChanges = logs.slice(0, 5);
      setRecentCostChanges(recentChanges);
    });
  }, [fetchCostChangeLogs]);

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const openEditDialog = (product: Product, type: 'price' | 'profit' | 'stock' | 'cost' | 'full') => {
    setSelectedProduct(product);
    setEditType(type);
    
    if (type === 'price') {
      setEditValue(product.price.toString());
    } else if (type === 'stock') {
      setEditValue(product.stock.toString());
    } else if (type === 'cost') {
      setEditValue((product.cost || 0).toString());
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
      else if (editType === 'cost') {
        if (numericValue < 0) {
          toast.error("O custo deve ser um valor positivo");
          return;
        }
        updatedProduct.cost = numericValue;
        toast.success(`Custo do produto "${selectedProduct.name}" atualizado para R$ ${numericValue.toFixed(2)}`);
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
      
      // Update the product in our state and database
      updateProduct(updatedProduct);
      
      setEditDialogOpen(false);
      
      // If cost change, refresh cost changes
      if (editType === 'cost' || editType === 'profit' || (editType === 'price' && selectedProduct.cost)) {
        setTimeout(() => {
          fetchCostChangeLogs().then(logs => {
            const recentChanges = logs.slice(0, 5);
            setRecentCostChanges(recentChanges);
          });
        }, 1000);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
  };

  // Função para salvar a edição completa do produto
  const handleFullEditSave = async (updatedProduct: Product) => {
    try {
      // Update the product in our state and database
      const result = await updateProduct(updatedProduct);
      
      if (result.success) {
        toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`);
        
        // If there was a cost change, refresh cost changes
        if (selectedProduct && selectedProduct.cost !== updatedProduct.cost) {
          setTimeout(() => {
            fetchCostChangeLogs().then(logs => {
              const recentChanges = logs.slice(0, 5);
              setRecentCostChanges(recentChanges);
            });
          }, 1000);
        }
      } else {
        toast.error("Erro ao atualizar produto");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
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
              <div className="bg-card border-primary/20 border rounded-lg shadow-soft overflow-hidden animate-scale-in mb-6">
                <div className="p-4 bg-muted/20 border-b border-primary/10">
                  <h3 className="text-lg font-medium">Alterações Recentes de Custo</h3>
                  <p className="text-sm text-muted-foreground">
                    Produtos com preço de custo alterado recentemente
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/10">
                        <th className="text-left p-4">Data</th>
                        <th className="text-left p-4">Produto</th>
                        <th className="text-right p-4">Custo Anterior</th>
                        <th className="text-right p-4">Novo Custo</th>
                        <th className="text-right p-4">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCostChanges.length > 0 ? (
                        recentCostChanges.map((log) => (
                          <tr key={log.id} className="border-b border-primary/10 hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              {new Date(log.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-4">{log.product_name}</td>
                            <td className="p-4 text-right">R$ {log.previous_cost.toFixed(2)}</td>
                            <td className="p-4 text-right">R$ {log.new_cost.toFixed(2)}</td>
                            <td className="p-4 text-right">
                              <span className={log.change_percentage >= 0 ? 'text-green-500' : 'text-blue-500'}>
                                {log.change_percentage >= 0 ? '+' : ''}{log.change_percentage.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            {loading ? (
                              "Carregando alterações de custo..."
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                                <p>Nenhuma alteração de custo encontrada</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t border-primary/10 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/inventory')}
                  >
                    Ver Histórico Completo
                  </Button>
                </div>
              </div>
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
