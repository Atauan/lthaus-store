
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/hooks/products/utils/pricingUtils';
import { Loader2 } from 'lucide-react';

interface SalesStatisticsProps {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  averageSale: number;
  isLoading: boolean;
}

const SalesStatistics: React.FC<SalesStatisticsProps> = ({
  totalSales,
  totalRevenue,
  totalProfit,
  averageSale,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando estatísticas...</span>
      </div>
    );
  }

  const stats = [
    {
      title: "Total de Vendas",
      value: totalSales,
      description: "Número total de vendas realizadas",
      icon: <ShoppingCart className="h-5 w-5 text-purple-600" />,
      format: (value: number) => value.toString(),
      color: "bg-purple-50"
    },
    {
      title: "Receita Total",
      value: totalRevenue,
      description: "Valor total das vendas realizadas",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      format: formatCurrency,
      color: "bg-green-50"
    },
    {
      title: "Lucro Total",
      value: totalProfit,
      description: "Lucro total das vendas",
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      format: formatCurrency,
      color: "bg-blue-50"
    },
    {
      title: "Ticket Médio",
      value: averageSale,
      description: "Valor médio por venda",
      icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
      format: formatCurrency,
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className={`flex flex-row items-center justify-between p-4 ${stat.color}`}>
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-full p-2 bg-white/90">{stat.icon}</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stat.format(stat.value)}</div>
            <CardDescription>{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalesStatistics;
