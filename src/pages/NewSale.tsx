
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const NewSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
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
              <p className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                Carregando formulário de venda...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewSale;
