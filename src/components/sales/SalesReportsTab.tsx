
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from '@/hooks/sales/types';
import { Loader2 } from 'lucide-react';

interface SalesReportsTabProps {
  sales: Sale[];
  isLoading: boolean;
}

const SalesReportsTab: React.FC<SalesReportsTabProps> = ({ sales, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando relatórios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Vendas</CardTitle>
          <CardDescription>Analise o desempenho da sua loja</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Functionality to generate and download sales reports coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReportsTab;
