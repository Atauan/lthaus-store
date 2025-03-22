
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useSalesData } from '@/hooks/sales/useSalesData';
import { 
  AreaChart, 
  Area, 
  PieChart as ReChartsPieChart, 
  Pie, 
  BarChart as ReChartsBarChart, 
  Bar, 
  LineChart as ReChartsLineChart, 
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Sample data for charts
const monthlyData = [
  { name: 'Jan', sales: 1200 },
  { name: 'Feb', sales: 1900 },
  { name: 'Mar', sales: 1500 },
  { name: 'Apr', sales: 2100 },
  { name: 'May', sales: 1800 },
  { name: 'Jun', sales: 2400 },
];

const paymentData = [
  { name: 'Cartão', value: 65 },
  { name: 'Pix', value: 25 },
  { name: 'Dinheiro', value: 10 },
];

const trendData = [
  { name: 'Seg', sales: 24 },
  { name: 'Ter', sales: 32 },
  { name: 'Qua', sales: 28 },
  { name: 'Qui', sales: 40 },
  { name: 'Sex', sales: 55 },
  { name: 'Sab', sales: 62 },
  { name: 'Dom', sales: 38 },
];

const channelData = [
  { name: 'Loja', value: 55 },
  { name: 'WhatsApp', value: 25 },
  { name: 'Instagram', value: 15 },
  { name: 'Outros', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const BarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ReChartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="sales" fill="#8884d8" />
    </ReChartsBarChart>
  </ResponsiveContainer>
);

const PieChart = ({ data = paymentData }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ReChartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </ReChartsPieChart>
  </ResponsiveContainer>
);

const LineChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ReChartsLineChart
      data={trendData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
    </ReChartsLineChart>
  </ResponsiveContainer>
);

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
                <PieChart data={channelData} />
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
