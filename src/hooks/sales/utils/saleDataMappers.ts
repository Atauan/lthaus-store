export function mapSaleFormToDatabase(saleData: any) {
  // Map form data to database schema
  return {
    sale: {
      sale_number: saleData.saleNumber,
      customer_name: saleData.customerName,
      customer_contact: saleData.customerContact,
      sale_channel: saleData.saleChannel === 'other' ? saleData.otherChannel : saleData.saleChannel,
      payment_method: saleData.paymentMethods[0].method,
      notes: saleData.notes,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      final_total: saleData.finalTotal,
      profit: saleData.profit,
      sale_date: saleData.date,
      delivery_address: saleData.deliveryAddress || null,
      delivery_fee: saleData.deliveryFee || 0,
      // No user_id field needed anymore
    },
    items: saleData.items.map((item: any) => ({
      product_id: item.id || null, // Make product_id nullable to prevent foreign key constraint issues
      name: item.name,
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      type: item.type,
      custom_price: item.custom_price || false
      // No user_id field needed anymore
    })),
    payments: saleData.paymentMethods.map((payment: any) => ({
      method: payment.method,
      amount: payment.amount
      // No user_id field needed anymore
    }))
  };
}
