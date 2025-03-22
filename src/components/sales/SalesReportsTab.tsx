
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, LineChart } from '@/components/ui/chart';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useSalesData } from '@/hooks/sales/useSalesData';

const SalesReportsTab = () => {
  const { sales } = useSalesData();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="chart">
        <TabsList className="w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="chart" className="flex-1">Gráficos</TabsTrigger>
          <TabsTrigger value="summary" className="flex-1">Resumo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendas por Mês</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendência de Vendas</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Canais de Venda</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Relatórios detalhados serão implementados em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesReportsTab;
