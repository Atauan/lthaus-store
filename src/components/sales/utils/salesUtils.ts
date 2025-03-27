import { SaleItem } from '../types/salesTypes';
import { calculateProfit as calculateItemProfit } from '@/hooks/products/utils/pricingUtils';

export function generateSaleNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

export function calculateSubtotal(items: SaleItem[]) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateProfit(items: SaleItem[]) {
  return items.reduce((sum, item) => {
    const itemCost = item.cost || 0;
    return sum + calculateItemProfit(item.price, itemCost) * item.quantity;
  }, 0);
}

export function calculateFinalTotal(subtotal: number, discountType: 'percentage' | 'fixed', discount: number, deliveryFee: number = 0) {
  const discountValue = discountType === 'percentage' 
    ? subtotal * (discount / 100)
    : discount;
  
  return Math.max(0, subtotal - discountValue + deliveryFee);
}

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
