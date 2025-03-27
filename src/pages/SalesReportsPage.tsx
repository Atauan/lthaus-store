import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import SalesReportsTab from '@/components/sales/SalesReportsTab';
import { useSales } from '@/hooks/useSales';

export default function SalesReportsPage() {
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const { 
    sales, 
    loading: salesLoading, 
    salesStatistics, 
    getSalesStatistics, 
    refresh: refreshSales 
  } = useSales();

  // Load initial data
  useEffect(() => {
    refreshSales();
    getSalesStatistics(reportPeriod);
  }, [reportPeriod, refreshSales, getSalesStatistics]);

  const handlePeriodChange = (value: string) => {
    setReportPeriod(value as 'day' | 'week' | 'month' | 'year');
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Relatórios de Vendas</h1>
            <p className="text-muted-foreground">
              Análises detalhadas do desempenho de vendas
            </p>
          </div>
          
          <div className="mb-6">
            <Tabs
              defaultValue={reportPeriod}
              value={reportPeriod}
              onValueChange={handlePeriodChange}
            >
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="day">Hoje</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="year">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dashboard de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SalesReportsTab />
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
}
