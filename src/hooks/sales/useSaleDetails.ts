
import { useState } from 'react';
import { SaleDetails } from './types';
import { getSaleDetails as fetchSaleDetails } from './utils/saleDetailsUtils';
import { toast } from 'sonner';

export function useSaleDetails() {
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSaleDetails = async (saleId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchSaleDetails(saleId);
      
      if (response.success) {
        setSaleDetails(response.data!);
        return response.data;
      } else {
        setError(response.error || 'Não foi possível carregar os detalhes da venda');
        toast.error(`Erro ao carregar venda: ${response.error}`);
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar detalhes da venda');
      toast.error(`Erro ao carregar venda: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saleDetails,
    isLoading,
    error,
    getSaleDetails
  };
}
