
import { useState, useEffect } from 'react';
import { SaleDetails } from './types';
import { getSaleDetails } from './utils/saleDetailsUtils';
import { toast } from 'sonner';

export function useSaleDetails(saleId?: number) {
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSaleDetails = async () => {
      if (!saleId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getSaleDetails(saleId);
        
        if (isMounted) {
          if (response.success) {
            setSaleDetails(response.data);
          } else {
            setError(response.error || 'Não foi possível carregar os detalhes da venda');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro ao buscar detalhes da venda');
          toast.error(`Erro ao carregar venda: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSaleDetails();

    return () => {
      isMounted = false;
    };
  }, [saleId]);

  return {
    saleDetails,
    isLoading,
    error
  };
}
