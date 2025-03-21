
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sale, SaleItem, SalePayment } from '../types';

export async function createSale(
  sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
  payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Start a transaction by using single batch
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        ...sale,
        user_id: userId
      }])
      .select()
      .single();
      
    if (saleError) throw saleError;
    
    const saleId = saleData.id;
    
    // Format items for database insertion
    const formattedItems = items.map(item => ({
      sale_id: saleId,
      product_id: item.product_id || 0,
      quantity: item.quantity,
      price: item.price,
      cost: item.cost,
      name: item.name
    }));
    
    // Insert sale items
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(formattedItems);
      
    if (itemsError) throw itemsError;
    
    // Insert payment methods
    const { error: paymentsError } = await supabase
      .from('sale_payments')
      .insert(
        payments.map(payment => ({
          ...payment,
          sale_id: saleId
        }))
      );
      
    if (paymentsError) throw paymentsError;
    
    // Update product stock for each item
    const lowStockProducts = [];
    
    for (const item of items) {
      if (item.type === 'product' && item.product_id) {
        // Get current product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('stock, min_stock, name')
          .eq('id', item.product_id)
          .single();
          
        if (productError) throw productError;
        
        // Calculate new stock
        const currentStock = productData.stock;
        const newStock = Math.max(0, currentStock - item.quantity);
        const minStock = productData.min_stock || 5;
        
        // Update product stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);
          
        if (updateError) throw updateError;
        
        // Check if product is now below min_stock
        if (newStock <= minStock) {
          lowStockProducts.push({
            id: item.product_id,
            name: productData.name,
            stock: newStock,
            min_stock: minStock
          });
        }
      }
    }
    
    // Show low stock warnings if needed
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        toast.warning(
          `Estoque baixo: ${product.name} (${product.stock}/${product.min_stock})`,
          { duration: 5000 }
        );
      });
    }
    
    // Get the complete sale details for returning
    const { data: saleItemsData, error: saleItemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);
      
    if (saleItemsError) throw saleItemsError;
    
    const { data: salePaymentsData, error: salePaymentsError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('sale_id', saleId);
      
    if (salePaymentsError) throw salePaymentsError;
    
    return {
      success: true,
      data: {
        sale: saleData,
        items: saleItemsData || [],
        payments: salePaymentsData || [],
        lowStockProducts: lowStockProducts.length > 0 ? lowStockProducts : null
      }
    };
  } catch (error: any) {
    toast.error(`Erro ao criar venda: ${error.message}`);
    return { success: false, error };
  }
}
