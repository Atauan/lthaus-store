import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/hooks/sales/types';
import { 
  CreditCard, TrendingUp, Clock, MapPin, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SalesAnalysisModuleProps {
  sales: Sale[];
  timeRange: 'day' | 'week' | 'month' | 'year';
  isLoading?: boolean;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a05195', '#d45087', '#f95d6a'];

const SalesAnalysisModule: React.FC<SalesAnalysisModuleProps> = ({
  sales,
  timeRange,
  isLoading = false
}) => {
  // Sales by period
  const salesByPeriodData = useMemo(() => {
    if (sales.length === 0) return [];
    
    // Get sales dates and organize by period
    const salesDates = sales.map(sale => {
      const date = parseISO(sale.sale_date || '');
      return {
        date,
        amount: sale.final_total
      };
    });
    
    if (timeRange === 'day') {
      // Group by hour for day view
      const hourlyData = Array(24).fill(0).map((_, i) => ({
        name: `${i}:00`,
        value: 0,
        count: 0
      }));
      
      salesDates.forEach(({ date, amount }) => {
        const hour = date.getHours();
        hourlyData[hour].value += amount;
        hourlyData[hour].count += 1;
      });
      
      return hourlyData;
    } else if (timeRange === 'week') {
      // Group by day of week
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const weeklyData = dayNames.map(day => ({ name: day, value: 0, count: 0 }));
      
      salesDates.forEach(({ date, amount }) => {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        weeklyData[dayOfWeek].value += amount;
        weeklyData[dayOfWeek].count += 1;
      });
      
      return weeklyData;
    } else if (timeRange === 'month') {
      // Group by day of month
      const today = new Date();
      const daysInMonth = eachDayOfInterval({
        start: startOfMonth(today),
        end: endOfMonth(today)
      });
      
      const monthlyData = daysInMonth.map(date => ({
        name: format(date, 'dd/MM'),
        value: 0,
        count: 0
      }));
      
      salesDates.forEach(({ date, amount }) => {
        const dayOfMonth = date.getDate() - 1; // 0-indexed
        if (dayOfMonth < monthlyData.length) {
          monthlyData[dayOfMonth].value += amount;
          monthlyData[dayOfMonth].count += 1;
        }
      });
      
      return monthlyData;
    } else { // year
      // Group by month
      const monthNames = Array(12).fill(0).map((_, i) => 
        format(new Date(2023, i, 1), 'MMM', { locale: ptBR })
      );
      
      const yearlyData = monthNames.map(month => ({ name: month, value: 0, count: 0 }));
      
      salesDates.forEach(({ date, amount }) => {
        const monthIndex = date.getMonth();
        yearlyData[monthIndex].value += amount;
        yearlyData[monthIndex].count += 1;
      });
      
      return yearlyData;
    }
  }, [sales, timeRange]);
  
  // Payment methods data
  const paymentMethodsData = useMemo(() => {
    if (sales.length === 0) return [];
    
    const methods: { [key: string]: number } = {};
    
    sales.forEach(sale => {
      const method = sale.payment_method || 'Desconhecido';
      methods[method] = (methods[method] || 0) + 1;
    });
    
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [sales]);
  
  // Sales by hour (for peak hours)
  const peakHoursData = useMemo(() => {
    if (sales.length === 0) return [];
    
    const hours: { [key: number]: { count: number, value: number } } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hours[i] = { count: 0, value: 0 };
    }
    
    sales.forEach(sale => {
      if (!sale.sale_date) return;
      
      const date = parseISO(sale.sale_date);
      const hour = date.getHours();
      
      hours[hour].count += 1;
      hours[hour].value += sale.final_total;
    });
    
    return Object.entries(hours).map(([hour, data]) => ({
      name: `${hour}:00`,
      vendas: data.count,
      valor: data.value
    }));
  }, [sales]);
  
  // Conversion rate data (mocked)
  const conversionRateData = [
    { name: 'Visitas', value: 100 },
    { name: 'Interessados', value: 65 },
    { name: 'Vendas', value: 35 }
  ];
  
  // Sales by location (mocked)
  const salesByLocationData = [
    { name: 'Central', value: 4000 },
    { name: 'Norte', value: 3000 },
    { name: 'Sul', value: 2000 },
    { name: 'Leste', value: 2780 },
    { name: 'Oeste', value: 1890 }
  ];
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando dados de análise...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Sales by Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Vendas por Período
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesByPeriodData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Area type="monotone" dataKey="value" name="Valor (R$)" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Formas de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={peakHoursData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value, name) => {
                  if (name === "vendas") return [`${value} vendas`, "Quantidade"];
                  return [`R$ ${Number(value).toFixed(2)}`, "Valor"];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="vendas" name="Número de Vendas" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="valor" name="Valor (R$)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Quantidade']} />
                <Bar dataKey="value" name="Quantidade" fill="#8884d8">
                  {conversionRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-lg font-bold">
                Taxa de Conversão: {((conversionRateData[2].value / conversionRateData[0].value) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales by Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Vendas por Região
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByLocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByLocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalysisModule;
