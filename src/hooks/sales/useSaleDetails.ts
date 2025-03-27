import { useCallback } from 'react';
import { getSaleDetails } from './utils/saleDetailsUtils';

export function useSaleDetails() {
  const fetchSaleDetails = useCallback(async (saleId: number) => {
    return await getSaleDetails(saleId);
  }, []);

  return { getSaleDetails: fetchSaleDetails };
}
