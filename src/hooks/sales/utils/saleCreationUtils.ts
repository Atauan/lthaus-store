
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { requestCache } from '@/utils/requestCache';

// Helper function to get current date time as string
const currentDateTimeString = () => new Date().toISOString();

export const createNewSale = async (saleData: any) => {
  try {
    // Invalidate sales cache
    requestCache.clear('sales_list');
    
    // Create a new sale entry with null user_id
    const saleResult = await supabase
      .from('sales')
      .insert({
        sale_number: saleData.sale_number || Math.floor(Math.random() * 90000) + 10000,
        customer_name: saleData.customer_name,
        customer_contact: saleData.customer_contact,
        sale_channel: saleData.sale_channel,
        payment_method: saleData.payment_method || saleData.payments?.[0]?.method || 'other',
        sale_date: currentDateTimeString(),
        subtotal: saleData.subtotal,
        discount: saleData.discount || 0,
        final_total: saleData.final_total,
        profit: saleData.profit || 0,
        notes: saleData.notes,
        delivery_address: saleData.delivery_address,
        delivery_fee: saleData.delivery_fee || 0,
        user_id: null // Explicitly setting user_id to null
      })
      .select('id')
      .single();

    if (saleResult.error) {
      throw saleResult.error;
    }

    const saleId = saleResult.data.id;

    // Create sale items entries and update stock
    if (saleData.items && Array.isArray(saleData.items)) {
      for (const item of saleData.items) {
        // Create sale item
        const itemResult = await supabase
          .from('sale_items')
          .insert({
            sale_id: saleId,
            product_id: item.id || 0,
            price: item.price,
            quantity: item.quantity,
            cost: item.cost || null
          });

        if (itemResult.error) {
          console.error('Error creating sale item:', itemResult.error);
          continue;
        }

        // Update product stock if item has a valid product_id
        if (item.id && item.type === 'product') {
          // Get current product stock
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();

          if (productError) {
            console.error('Error fetching product stock:', productError);
            continue;
          }

          if (product) {
            const previousStock = product.stock;
            const newStock = Math.max(0, previousStock - item.quantity);

            // Update product stock
            const { error: updateError } = await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.id);

            if (updateError) {
              console.error('Error updating product stock:', updateError);
              continue;
            }

            // Create stock log
            await supabase
              .from('stock_logs')
              .insert({
                product_id: item.id,
                previous_stock: previousStock,
                new_stock: newStock,
                change_amount: -item.quantity,
                reference_type: 'sale',
                reference_id: saleId.toString(),
                notes: `Venda #${saleId}`
              });
              
            // Invalidate product cache
            requestCache.clear(`product_${item.id}`);
          }
        }
      }
    }

    // Create payment records if available
    if (saleData.payments && Array.isArray(saleData.payments)) {
      for (const payment of saleData.payments) {
        await supabase
          .from('sale_payments')
          .insert({
            sale_id: saleId,
            method: payment.method,
            amount: payment.amount
          });
      }
    }

    toast.success('Venda registrada com sucesso!');
    return { success: true, saleId };
  } catch (error: any) {
    console.error('Error creating sale:', error);
    handleSupabaseError(error, "Erro ao registrar venda");
    return { success: false, error };
  }
};
