
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/ui/custom/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronUp, Users, Package, DollarSign, ShoppingCart, CalendarDays } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { useSalesStatistics } from '@/hooks/sales/useSalesStatistics';
import { useSalesData } from '@/hooks/sales/useSalesData';

export default function Dashboard() {
  const [statsPeriod, setStatsPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // Get sales data and statistics
  const { sales } = useSalesData();
  const { salesStatistics, periodSales, getSalesStatistics } = useSalesStatistics(sales);
  
  // Estimated products sold since we don't have direct access to items
  const productsCount = periodSales.length * 2; // Assuming average of 2 products per sale
  
  // Handle period change
  const handlePeriodChange = (value: string) => {
    const period = value as 'day' | 'week' | 'month';
    setStatsPeriod(period);
    getSalesStatistics(period);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-20 pb-10">
        <PageTransition>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Bem-vindo ao painel de controle
                </p>
              </div>
              
              <Tabs
                defaultValue="day"
                value={statsPeriod}
                onValueChange={handlePeriodChange}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Hoje</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sales card */}
              <GlassCard hoverEffect borderEffect>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendas</p>
                    <h2 className="text-3xl font-bold">{salesStatistics.totalSales}</h2>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span>12% em relação ao período anterior</span>
                </div>
              </GlassCard>
              
              {/* Revenue card */}
              <GlassCard hoverEffect borderEffect>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita</p>
                    <h2 className="text-3xl font-bold">
                      R$ {salesStatistics.totalRevenue.toFixed(2)}
                    </h2>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span>8% em relação ao período anterior</span>
                </div>
              </GlassCard>
              
              {/* Products sold card */}
              <GlassCard hoverEffect borderEffect>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Produtos vendidos</p>
                    <h2 className="text-3xl font-bold">{productsCount}</h2>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span>5% em relação ao período anterior</span>
                </div>
              </GlassCard>
              
              {/* Profit card */}
              <GlassCard hoverEffect borderEffect>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lucro</p>
                    <h2 className="text-3xl font-bold">
                      R$ {salesStatistics.totalProfit.toFixed(2)}
                    </h2>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span>15% em relação ao período anterior</span>
                </div>
              </GlassCard>
            </div>
            
            {/* Recent Sales Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Vendas Recentes</h2>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Últimas transações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {periodSales.slice(0, 5).map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {sale.customer_name || 'Cliente não identificado'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Venda #{sale.sale_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {sale.final_total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {periodSales.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Nenhuma venda encontrada para o período selecionado.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
