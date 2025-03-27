import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type StoreCost = {
  id: string;
  month: string;
  year: string;
  rent: number;
  utilities: number;
  salaries: number;
  marketing: number;
  other: number;
  created_at?: string;
  updated_at?: string;
};

export type MonthlyProfit = {
  month: string;
  year: string;
  totalSales: number;
  totalProfit: number;
  totalCosts: number;
  netProfit: number;
};

export function useStoreCosts() {
  const [costs, setCosts] = useState<StoreCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyProfits, setMonthlyProfits] = useState<MonthlyProfit[]>([]);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('store_costs')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setCosts(data as StoreCost[]);
      
      // Fetch sales data for profit calculation
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear().toString();
      const lastYear = (currentDate.getFullYear() - 1).toString();
      
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('sale_date, subtotal, profit, final_total')
        .gte('sale_date', `${lastYear}-01-01`)
        .order('sale_date', { ascending: false });
        
      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        return;
      }
      
      calculateMonthlyProfits(data as StoreCost[], salesData);
    } catch (error: any) {
      toast.error(`Erro ao carregar custos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyProfits = (costs: StoreCost[], sales: any[]) => {
    // Map to store monthly totals
    const monthlyTotals: Record<string, MonthlyProfit> = {};
    
    // Process sales data
    sales.forEach(sale => {
      const saleDate = new Date(sale.sale_date);
      const month = (saleDate.getMonth() + 1).toString().padStart(2, '0');
      const year = saleDate.getFullYear().toString();
      const key = `${year}-${month}`;
      
      if (!monthlyTotals[key]) {
        monthlyTotals[key] = {
          month,
          year,
          totalSales: 0,
          totalProfit: 0,
          totalCosts: 0,
          netProfit: 0
        };
      }
      
      monthlyTotals[key].totalSales += sale.final_total || 0;
      monthlyTotals[key].totalProfit += sale.profit || 0;
    });
    
    // Process costs data
    costs.forEach(cost => {
      const key = `${cost.year}-${cost.month}`;
      
      if (!monthlyTotals[key]) {
        monthlyTotals[key] = {
          month: cost.month,
          year: cost.year,
          totalSales: 0,
          totalProfit: 0,
          totalCosts: 0,
          netProfit: 0
        };
      }
      
      const totalCost = 
        cost.rent + 
        cost.utilities + 
        cost.salaries + 
        cost.marketing + 
        cost.other;
        
      monthlyTotals[key].totalCosts = totalCost;
      monthlyTotals[key].netProfit = monthlyTotals[key].totalProfit - totalCost;
    });
    
    // Convert to array and sort
    const result = Object.values(monthlyTotals).sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      return parseInt(b.month) - parseInt(a.month);
    });
    
    setMonthlyProfits(result);
  };

  const saveCost = async (cost: Omit<StoreCost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Check if a record for this month/year already exists
      const { data: existingData, error: existingError } = await supabase
        .from('store_costs')
        .select('id')
        .eq('month', cost.month)
        .eq('year', cost.year)
        .maybeSingle();
        
      if (existingError) {
        throw existingError;
      }
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('store_costs')
          .update({
            rent: cost.rent,
            utilities: cost.utilities,
            salaries: cost.salaries,
            marketing: cost.marketing,
            other: cost.other
          })
          .eq('id', existingData.id)
          .select();
          
        toast.success('Custos atualizados com sucesso!');
      } else {
        // Create new record
        result = await supabase
          .from('store_costs')
          .insert(cost)
          .select();
          
        toast.success('Custos registrados com sucesso!');
      }
      
      if (result.error) {
        throw result.error;
      }
      
      fetchCosts();
    } catch (error: any) {
      toast.error(`Erro ao salvar custos: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, []);

  return {
    costs,
    loading,
    monthlyProfits,
    saveCost,
    refresh: fetchCosts
  };
}
