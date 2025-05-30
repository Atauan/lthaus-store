
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/layout/PageTransition';
import ProductForm from '@/components/products/ProductForm';
import { Product } from '@/hooks/products/types';
import { Loader2 } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('ID do produto não fornecido');
        navigate('/products');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;

        if (!data) {
          toast.error('Produto não encontrado');
          navigate('/products');
          return;
        }

        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error(`Erro ao carregar produto: ${error.message}`);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen lg:pl-64 pt-16">
          <div className="container mx-auto px-4 pb-10">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando produto...</span>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
            <p className="text-muted-foreground mt-1">
              Atualize as informações do produto "{product.name}"
            </p>
          </div>

          <ProductForm product={product} isEditing={true} />
        </div>
      </div>
    </PageTransition>
  );
};

export default EditProduct;
