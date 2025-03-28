
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import SalesForm from '@/components/sales/SalesForm';
import { useSaleDetails } from '@/hooks/sales/useSaleDetails';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from 'sonner';

const NewSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saleDetails, isLoading, error } = useSaleDetails(id ? parseInt(id) : undefined);
  
  // Handle error state
  useEffect(() => {
    if (error) {
      toast.error(`Erro ao carregar dados da venda: ${error}`);
      // Redirect to sales page after error
      setTimeout(() => navigate('/sales'), 2000);
    }
  }, [error, navigate]);

  const isEditing = !!id;
  
  if (isLoading && isEditing) {
    return <LoadingScreen />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Editar Venda' : 'Nova Venda'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing 
                ? `Editando venda #${saleDetails?.sale?.sale_number || id}` 
                : 'Registre uma nova venda no sistema'}
            </p>
          </div>
          
          <SalesForm initialData={isEditing ? saleDetails : undefined} />
        </div>
      </div>
    </PageTransition>
  );
};

export default NewSale;
