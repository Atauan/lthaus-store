
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SaleData } from '../types';
import { currentDateTimeString } from './saleDetailsUtils';

export const createNewSale = async (saleData: SaleData) => {
  try {
    // Create a new sale entry
    const saleResult = await supabase
      .from('sales')
      .insert({
        customer_name: saleData.customerName,
        customer_document: saleData.customerDocument,
        customer_address: saleData.customerAddress,
        customer_city: saleData.customerCity,
        customer_state: saleData.customerState,
        customer_zipcode: saleData.customerZipCode,
        customer_phone: saleData.customerPhone,
        customer_email: saleData.customerEmail,
        payment_method: saleData.paymentMethod,
        payment_installments: saleData.paymentInstallments || 1,
        subtotal: saleData.subtotal,
        discount: saleData.discount,
        delivery_fee: saleData.deliveryFee,
        total: saleData.total,
        notes: saleData.notes,
        created_at: currentDateTimeString(),
        status: 'completed',
        seller_id: saleData.sellerId || null,
        delivery_type: saleData.deliveryType || 'pickup',
        latitude: saleData.latitude || null,
        longitude: saleData.longitude || null,
      })
      .select('id')
      .single();

    if (saleResult.error) {
      throw saleResult.error;
    }

    const saleId = saleResult.data.id;

    // Create sale items entries and update stock
    for (const item of saleData.items) {
      // Create sale item
      const itemResult = await supabase
        .from('sale_items')
        .insert({
          sale_id: saleId,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.total,
          cost_price: item.costPrice || 0,
        });

      if (itemResult.error) {
        console.error('Error creating sale item:', itemResult.error);
        continue;
      }

      // Update product stock
      if (item.id) {
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
      }
    }

    toast.success('Venda registrada com sucesso!');
    return { success: true, saleId };
  } catch (error: any) {
    console.error('Error creating sale:', error);
    toast.error(`Erro ao registrar venda: ${error.message}`);
    return { success: false, error };
  }
};
