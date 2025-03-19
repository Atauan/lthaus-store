
import { useCallback } from 'react';
import { Sale, SaleItem, SalePayment } from './types';
import { createSale } from './utils/saleCreationUtils';

export function useSaleCreate() {
  const handleCreateSale = useCallback(async (
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[],
    payments: Omit<SalePayment, 'id' | 'created_at' | 'updated_at' | 'sale_id'>[]
  ) => {
    return await createSale(sale, items, payments);
  }, []);

  return { createSale: handleCreateSale };
}
