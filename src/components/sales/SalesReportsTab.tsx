import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useSales } from '@/hooks/useSales';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesReportsTab = () => {
  const { sales, loading, salesStatistics, getSalesStatistics } = useSales();
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [chartData, setChartData] = useState({
    monthlyData: [],
    paymentData: [],
    trendData: [],
    channelData: []
  });
  
  useEffect(() => {
    if (sales && sales.length > 0) {
      // Update statistics with selected period
      getSalesStatistics(reportPeriod);
      
      // Generate chart data based on sales
      generateChartData(sales, reportPeriod);
    }
  }, [sales, reportPeriod]);
  
  const generateChartData = (salesData, period) => {
    // Monthly data - sales by month
    const monthlyMap = new Map();
    const paymentMethodMap = new Map();
    const channelMap = new Map();
    
    // Process sales data
    salesData.forEach(sale => {
      const saleDate = new Date(sale.sale_date);
      
      // Monthly data
      const monthKey = format(saleDate, 'MMM', { locale: ptBR });
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, 0);
      }
      monthlyMap.set(monthKey, monthlyMap.get(monthKey) + sale.final_total);
      
      // Payment method data
      const paymentMethod = sale.payment_method || 'Não especificado';
      if (!paymentMethodMap.has(paymentMethod)) {
        paymentMethodMap.set(paymentMethod, 0);
      }
      paymentMethodMap.set(paymentMethod, paymentMethodMap.get(paymentMethod) + 1);
      
      // Channel data
      const channel = sale.sale_channel || 'Loja';
      if (!channelMap.has(channel)) {
        channelMap.set(channel, 0);
      }
      channelMap.set(channel, channelMap.get(channel) + 1);
    });
    
    // Convert to array format for charts
    const monthlyData = Array.from(monthlyMap.entries()).map(([name, sales]) => ({
      name, 
      sales: Number(sales.toFixed(2))
    }));
    
    const paymentData = Array.from(paymentMethodMap.entries()).map(([name, value]) => ({
      name, 
      value
    }));
    
    const channelData = Array.from(channelMap.entries()).map(([name, value]) => ({
      name, 
      value
    }));
    
    // Generate trend data - last 7 days
    const trendData = getLast7DaysTrend(salesData);
    
    setChartData({
      monthlyData,
      paymentData,
      trendData,
      channelData
    });
  };
  
  const getLast7DaysTrend = (salesData) => {
    const last7Days = [];
    const today = new Date();
    
    // Get the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Format as day of week
      const dayName = format(date, 'EEE', { locale: ptBR });
      
      // Count sales for this day
      const dayStr = format(date, 'yyyy-MM-dd');
      const daySales = salesData.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return format(saleDate, 'yyyy-MM-dd') === dayStr;
      });
      
      const salesCount = daySales.length;
      const salesTotal = daySales.reduce((sum, sale) => sum + sale.final_total, 0);
      
      last7Days.push({
        name: dayName,
        sales: salesCount,
        value: Number(salesTotal.toFixed(2))
      });
    }
    
    return last7Days;
  };
  
  const BarChart = ({ data = chartData.monthlyData }) => (
    <ResponsiveContainer width="100%" height="100%">
      <ReChartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => {
            return typeof value === 'number' 
              ? `R$ ${value.toFixed(2)}` 
              : value;
          }}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        <Bar dataKey="sales" name="Vendas (R$)" fill="#8884d8" />
      </ReChartsBarChart>
    </ResponsiveContainer>
  );

  const PieChart = ({ data = chartData.paymentData }) => (
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
        <Tooltip 
          formatter={(value) => {
            return typeof value === 'number' 
              ? value.toString() 
              : value;
          }}
        />
        <Legend />
      </ReChartsPieChart>
    </ResponsiveContainer>
  );

  const LineChart = ({ data = chartData.trendData }) => (
    <ResponsiveContainer width="100%" height="100%">
      <ReChartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          formatter={(value, name) => {
            if (typeof value === 'number') {
              return name === "sales" ? value.toString() : `R$ ${value.toFixed(2)}`;
            }
            return value;
          }}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="sales" 
          name="Número de vendas"
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="value" 
          name="Valor (R$)"
          stroke="#82ca9d" 
        />
      </ReChartsLineChart>
    </ResponsiveContainer>
  );
  
  const handlePeriodChange = (value) => {
    setReportPeriod(value);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8">Carregando dados de relatórios...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Relatório de Vendas</h2>
        <Tabs value={reportPeriod} onValueChange={handlePeriodChange}>
          <TabsList>
            <TabsTrigger value="day">Hoje</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    
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
                <BarChart data={chartData.monthlyData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={chartData.paymentData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendência de Vendas (7 dias)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart data={chartData.trendData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Canais de Venda</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={chartData.channelData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Análise de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total de Vendas</p>
                    <h3 className="text-2xl font-bold">{salesStatistics.totalSales}</h3>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Receita Total</p>
                    <h3 className="text-2xl font-bold">R$ {salesStatistics.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Lucro Total</p>
                    <h3 className="text-2xl font-bold">R$ {salesStatistics.totalProfit.toFixed(2)}</h3>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Análise Detalhada</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Valor médio por venda:</span>
                      <span className="font-medium">
                        R$ {salesStatistics.totalSales > 0 
                          ? (salesStatistics.totalRevenue / salesStatistics.totalSales).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro médio por venda:</span>
                      <span className="font-medium">
                        R$ {salesStatistics.totalSales > 0 
                          ? (salesStatistics.totalProfit / salesStatistics.totalSales).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem de lucro média:</span>
                      <span className="font-medium">
                        {salesStatistics.totalRevenue > 0 
                          ? ((salesStatistics.totalProfit / salesStatistics.totalRevenue) * 100).toFixed(2) 
                          : '0.00'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesReportsTab;
