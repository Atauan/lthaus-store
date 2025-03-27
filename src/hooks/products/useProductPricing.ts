import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './types';
import { 
  calculateSalePrice, 
  calculateProfit, 
  calculateMarginPercentage 
} from './utils/pricingUtils';

export function useProductPricing(form: UseFormReturn<ProductFormValues>) {
  const [profit, setProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(40); // Default 40% profit margin
  
  const watchCostPrice = form.watch('costPrice');
  
  // Update sale price and profit when cost or margin changes
  useEffect(() => {
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, profitMargin);
    
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculateProfit(calculatedSalePrice, cost));
  }, [watchCostPrice, profitMargin, form]);

  // Set initial profit margin (used when editing a product)
  const setInitialProfitMargin = (margin: number) => {
    setProfitMargin(parseFloat(margin.toFixed(0)));
  };

  // Handle margin slider change
  const handleMarginChange = (newMargin: number) => {
    setProfitMargin(newMargin);
    
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, newMargin);
    
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculateProfit(calculatedSalePrice, cost));
  };

  // Handle sale price direct input
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const salePrice = parseFloat(e.target.value) || 0;
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    
    if (cost > 0 && salePrice > cost) {
      const newProfit = calculateProfit(salePrice, cost);
      setProfit(newProfit);
      
      // Calculate and update margin based on new sale price
      const newMargin = calculateMarginPercentage(salePrice, cost);
      setProfitMargin(newMargin);
    }
    
    form.setValue('salePrice', salePrice);
  };

  return {
    profit,
    profitMargin,
    handleMarginChange,
    handleSalePriceChange,
    setInitialProfitMargin
  };
}
