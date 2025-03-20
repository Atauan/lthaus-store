
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import ProductForm from '@/components/products/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/hooks/products/useProductTypes';
import { Loader2 } from 'lucide-react';

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find(p => p.id === parseInt(productId));
      setProduct(foundProduct || null);
      setLoading(false);
    }
  }, [products, productId]);

  // Handle going back to products page
  const handleBackToProducts = () => {
    navigate('/products');
  };

  if (loading && products.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen lg:pl-64 pt-16">
          <div className="container mx-auto px-4 pb-10 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Carregando produto...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!product && !loading) {
    return (
      <PageTransition>
        <div className="min-h-screen lg:pl-64 pt-16">
          <div className="container mx-auto px-4 pb-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Produto não encontrado</h1>
              <p className="text-muted-foreground mt-1">O produto que você está tentando editar não existe</p>
            </div>
            <button 
              onClick={handleBackToProducts}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Voltar para lista de produtos
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
            <p className="text-muted-foreground mt-1">Atualize as informações do produto</p>
          </div>

          {product && <ProductForm product={product} isEditing={true} />}
        </div>
      </div>
    </PageTransition>
  );
};

export default EditProduct;
