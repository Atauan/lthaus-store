
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import SalesForm from '@/components/sales/SalesForm';
import { useSales } from '@/hooks/useSales';

const NewSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { getSaleDetails } = useSales();
  const [saleData, setSaleData] = useState<any>(null);
  const [loading, setLoading] = useState(isEditing);

  // If editing, fetch the sale data
  useEffect(() => {
    if (isEditing && id) {
      const fetchSaleData = async () => {
        try {
          setLoading(true);
          const result = await getSaleDetails(parseInt(id));
          if (result.success && result.data) {
            setSaleData(result.data);
          } else {
            toast.error(`Error loading sale: ${result.error}`);
            navigate('/sales');
          }
        } catch (error: any) {
          toast.error(`Error loading sale: ${error.message}`);
          navigate('/sales');
        } finally {
          setLoading(false);
        }
      };
      
      fetchSaleData();
    }
  }, [id, isEditing, navigate, getSaleDetails]);

  if (loading) {
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
                  ? `Editando venda #${id}` 
                  : 'Registre uma nova venda no sistema'}
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Formulário de Venda</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? 'Atualize os dados da venda' 
                    : 'Preencha os campos para registrar uma nova venda'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg">Carregando dados da venda...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
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
                ? `Editando venda #${id}` 
                : 'Registre uma nova venda no sistema'}
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Venda</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Atualize os dados da venda' 
                  : 'Preencha os campos para registrar uma nova venda'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <SalesForm initialData={saleData} />
              ) : (
                <SalesForm />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewSale;
