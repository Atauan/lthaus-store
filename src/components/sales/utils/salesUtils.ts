
import { SaleItem } from '../types/salesTypes';

export function generateSaleNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

export function calculateSubtotal(items: SaleItem[]) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateProfit(items: SaleItem[]) {
  return items.reduce((sum, item) => {
    const itemCost = item.cost || 0;
    return sum + ((item.price - itemCost) * item.quantity);
  }, 0);
}

export function calculateFinalTotal(subtotal: number, discountType: 'percentage' | 'fixed', discount: number) {
  const discountValue = discountType === 'percentage' 
    ? subtotal * (discount / 100)
    : discount;
  
  return Math.max(0, subtotal - discountValue);
}
