import React from 'react';
import { BarChart3, ArrowUpRight, CreditCard } from 'lucide-react';
import GlassCard from '@/components/ui/custom/GlassCard';
import { SalesStatistics as SalesStatsType } from '@/hooks/sales/types';

export interface SalesStatisticsProps {
  totalSales: number;
  productsSold: number;
  totalRevenue: number;
  isLoading?: boolean;
}

const SalesStatistics: React.FC<SalesStatisticsProps> = ({ 
  totalSales, 
  productsSold, 
  totalRevenue,
  isLoading = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <GlassCard className="animate-scale-in">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '-' : totalSales}</h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="animate-scale-in">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Produtos Vendidos</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '-' : productsSold}</h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="animate-scale-in">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
            <h3 className="text-2xl font-bold mt-1">R$ {isLoading ? '-' : totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SalesStatistics;
