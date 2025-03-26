
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyProfit } from '@/hooks/settings/useStoreCosts';

interface MonthlyProfitChartProps {
  data: MonthlyProfit[];
}

const MonthlyProfitChart: React.FC<MonthlyProfitChartProps> = ({ data }) => {
  const getMonthName = (monthNumber: string) => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    return months[parseInt(monthNumber) - 1];
  };
  
  const chartData = data.map(item => ({
    name: `${getMonthName(item.month)}/${item.year.substring(2)}`,
    Vendas: Math.round(item.totalSales),
    'Lucro Bruto': Math.round(item.totalProfit),
    Custos: Math.round(item.totalCosts),
    'Lucro Líquido': Math.round(item.netProfit)
  })).slice(0, 6).reverse(); // Last 6 months in chronological order
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análise de Lucro Mensal</CardTitle>
        <CardDescription>
          Comparativo entre vendas, custos e lucro líquido
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value}`, '']}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Bar dataKey="Vendas" fill="#8884d8" />
              <Bar dataKey="Lucro Bruto" fill="#82ca9d" />
              <Bar dataKey="Custos" fill="#ff8042" />
              <Bar dataKey="Lucro Líquido" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyProfitChart;
