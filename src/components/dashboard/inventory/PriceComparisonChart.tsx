
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap } from 'lucide-react';

interface ProductMarginData {
  name: string;
  custo: number;
  preco: number;
  margem: number;
}

interface PriceComparisonChartProps {
  productMarginData: ProductMarginData[];
}

const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ productMarginData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5 text-primary" />
          Comparação Custo vs. Preço de Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={productMarginData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
              formatter={(value, name) => {
                return [`R$ ${Number(value).toFixed(2)}`, name === "custo" ? "Custo" : "Preço de Venda"];
              }}
            />
            <Legend />
            <Bar dataKey="custo" name="Custo" fill="#8884d8" />
            <Bar dataKey="preco" name="Preço de Venda" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceComparisonChart;
