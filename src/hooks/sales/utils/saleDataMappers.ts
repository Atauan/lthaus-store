
export function mapSaleFormToDatabase(
  saleData: any,
  userId?: string
) {
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
      user_id: userId
    },
    items: saleData.items.map((item: any) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      type: item.type,
      custom_price: item.custom_price || false,
      user_id: userId
    })),
    payments: saleData.paymentMethods.map((payment: any) => ({
      method: payment.method,
      amount: payment.amount,
      user_id: userId
    }))
  };
}
