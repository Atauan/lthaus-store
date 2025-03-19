
export interface Sale {
  id: number;
  sale_number: number;
  customer_name?: string;
  customer_contact?: string;
  sale_channel?: string;
  payment_method: string;
  sale_date?: string;
  notes?: string;
  subtotal: number;
  discount?: number;
  final_total: number;
  profit?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SaleItem {
  id: number;
  sale_id?: number;
  product_id?: number;
  name: string;
  price: number;
  cost?: number;
  quantity: number;
  type: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SalePayment {
  id: number;
  sale_id?: number;
  method: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SalesStatistics {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  period: 'day' | 'week' | 'month';
  sales: Sale[];
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface SaleDetails {
  sale: Sale;
  items: SaleItem[];
  payments: SalePayment[];
}
