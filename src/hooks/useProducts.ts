
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product, StockLog, CostChangeLog, categories, brands } from './products/types';

export type { Product, StockLog, CostChangeLog };

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [costChangeLogs, setCostChangeLogs] = useState<CostChangeLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');

  // Computed filtered products
  const filteredProducts = useCallback(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand]);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setProducts(data as Product[]);
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar produtos: ${error.message}`);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch stock logs
  const fetchStockLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stock_logs')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const logsWithProductNames = data.map(log => ({
          ...log,
          product_name: log.products?.name
        }));
        
        setStockLogs(logsWithProductNames as StockLog[]);
        return logsWithProductNames;
      }
      
      return [];
    } catch (error: any) {
      toast.error(`Erro ao carregar logs de estoque: ${error.message}`);
      console.error('Error fetching stock logs:', error);
      return [];
    }
  }, []);
  
  // Fetch cost change logs
  const fetchCostChangeLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cost_change_logs')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const logsWithProductNames = data.map(log => ({
          ...log,
          product_name: log.products?.name
        }));
        
        setCostChangeLogs(logsWithProductNames as CostChangeLog[]);
        return logsWithProductNames;
      }
      
      return [];
    } catch (error: any) {
      toast.error(`Erro ao carregar logs de custo: ${error.message}`);
      console.error('Error fetching cost logs:', error);
      return [];
    }
  }, []);
  
  // Add a new product
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Add the new product to the state
        setProducts([...products, data[0] as Product]);
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to add product') };
    } catch (error: any) {
      console.error('Error adding product:', error);
      return { success: false, error };
    }
  };
  
  // Update an existing product
  const updateProduct = async (product: Product, imageFile?: File) => {
    try {
      // If there's an image file, upload it first
      if (imageFile) {
        const filename = `product_${product.id}_${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename);
          
        if (urlData) {
          // Update product with the image URL
          product.image = filename;
          product.image_url = urlData.publicUrl;
        }
      }
      
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update the product in the state
        setProducts(products.map(p => p.id === product.id ? data[0] as Product : p));
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to update product') };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { success: false, error };
    }
  };
  
  // Update product cost
  const updateCost = async (productId: number, newCost: number) => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return { success: false, error: new Error('Product not found') };
      }
      
      const updatedProduct = { ...product, cost: newCost };
      
      const { data, error } = await supabase
        .from('products')
        .update({ cost: newCost })
        .eq('id', productId)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update the product in the state
        setProducts(products.map(p => p.id === productId ? data[0] as Product : p));
        await fetchCostChangeLogs(); // Refresh cost logs
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to update cost') };
    } catch (error: any) {
      console.error('Error updating cost:', error);
      return { success: false, error };
    }
  };

  // Update stock with a note
  const updateStock = async (productId: number, newStock: number, notes?: string) => {
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return { success: false, error: new Error('Product not found') };
      }
      
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update the product in the state
        setProducts(products.map(p => p.id === productId ? data[0] as Product : p));
        toast.success(`Estoque atualizado com sucesso para ${newStock} unidades`);
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: new Error('Failed to update stock') };
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
      return { success: false, error };
    }
  };
  
  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the product from the state
      setProducts(products.filter(p => p.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
    fetchStockLogs();
    fetchCostChangeLogs();
  }, [fetchProducts, fetchStockLogs, fetchCostChangeLogs]);

  // Get products with low stock
  const getLowStockProducts = useCallback(() => {
    const lowStock = products.filter(product => 
      product.stock <= product.min_stock
    );
    return { success: true, data: lowStock };
  }, [products]);

  return {
    products,
    loading,
    hasMore: false,
    loadMore: () => {},
    addProduct,
    updateProduct,
    updateCost,
    updateStock,
    deleteProduct,
    getLowStockProducts,
    stockLogs,
    costChangeLogs,
    fetchStockLogs,
    fetchCostChangeLogs,
    filteredProducts: filteredProducts(),
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    categories,
    brands
  };
}
