
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ProductForm from '@/components/products/ProductForm';

const AddProduct = () => {
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Adicionar Produto</h1>
            <p className="text-muted-foreground mt-1">Preencha o formulário para adicionar um novo produto ao catálogo</p>
          </div>

          <ProductForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default AddProduct;
