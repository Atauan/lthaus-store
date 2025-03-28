
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import SalesForm from '@/components/sales/SalesForm';

const NewSale = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Nova Venda</h1>
            <p className="text-muted-foreground mt-1">Registre uma nova venda no sistema</p>
          </div>
          
          <SalesForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default NewSale;
