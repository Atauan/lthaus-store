
import { SaleItem } from '../types/salesTypes';

export function calculateSubtotal(items: SaleItem[]) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateProfit(items: SaleItem[]) {
  return items.reduce((sum, item) => {
    const itemCost = item.cost || 0;
    const itemProfit = item.price - itemCost;
    return sum + (itemProfit * item.quantity);
  }, 0);
}

export function calculateFinalTotal(subtotal: number, discountType: 'percentage' | 'fixed', discount: number, deliveryFee: number = 0) {
  const discountValue = discountType === 'percentage' 
    ? subtotal * (discount / 100)
    : discount;
  
  return Math.max(0, subtotal - discountValue + deliveryFee);
}
