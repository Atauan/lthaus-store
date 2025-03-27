/**
 * Utility functions for product price calculations
 */

/**
 * Calculate sale price based on cost and margin percentage
 */
export function calculateSalePrice(cost: number, marginPercentage: number): number {
  if (cost <= 0) return 0;
  const multiplier = 1 + (marginPercentage / 100);
  const calculatedPrice = cost * multiplier;
  return parseFloat(calculatedPrice.toFixed(2));
}

/**
 * Calculate profit based on sale price and cost
 */
export function calculateProfit(salePrice: number, cost: number): number {
  return salePrice - cost;
}

/**
 * Calculate profit margin percentage based on sale price and cost
 */
export function calculateMarginPercentage(salePrice: number, cost: number): number {
  if (cost <= 0 || salePrice <= cost) return 0;
  const margin = ((salePrice - cost) / cost) * 100;
  return parseFloat(margin.toFixed(0));
}

/**
 * Format a number as currency (BRL)
 */
export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}
