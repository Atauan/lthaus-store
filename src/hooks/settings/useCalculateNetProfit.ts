
/**
 * This is a utility hook that provides net profit calculation functionality.
 * It's created as a separate hook to avoid modifying the read-only useStoreCosts.ts
 */
export function useCalculateNetProfit() {
  const calculateNetProfit = (totalRevenue: number, fixedCosts: number) => {
    return totalRevenue - fixedCosts;
  };
  
  return { calculateNetProfit };
}
