
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './types';

export function useProductPricing(form: UseFormReturn<ProductFormValues>) {
  const [profit, setProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(40); // Default 40% profit margin
  
  const watchCostPrice = form.watch('costPrice');
  
  // Calculate sale price based on cost and margin
  const calculateSalePrice = (cost: number, margin: number) => {
    if (cost <= 0) return 0;
    const multiplier = 1 + (margin / 100);
    const calculatedPrice = cost * multiplier;
    return parseFloat(calculatedPrice.toFixed(2));
  };

  // Update sale price and profit when cost or margin changes
  useEffect(() => {
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, profitMargin);
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculatedSalePrice - cost);
  }, [watchCostPrice, profitMargin, form]);

  // Handle margin slider change
  const handleMarginChange = (newMargin: number) => {
    setProfitMargin(newMargin);
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, newMargin);
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculatedSalePrice - cost);
  };

  // Handle sale price direct input
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const salePrice = parseFloat(e.target.value) || 0;
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    
    if (cost > 0 && salePrice > cost) {
      const newProfit = salePrice - cost;
      setProfit(newProfit);
      
      // Calculate and update margin based on new sale price
      const newMargin = ((salePrice - cost) / cost) * 100;
      setProfitMargin(parseFloat(newMargin.toFixed(0)));
    }
    
    form.setValue('salePrice', salePrice);
  };

  return {
    profit,
    profitMargin,
    handleMarginChange,
    handleSalePriceChange
  };
}
