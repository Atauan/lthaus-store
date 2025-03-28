
export interface Sale {
  id: number;
  sale_number: number;
  sale_date: string;
  customer_name?: string;
  customer_contact?: string;
  sale_channel?: string;
  payment_method: string;
  subtotal: number;
  discount?: number;
  final_total: number;
  profit?: number;
  delivery_fee?: number;
  delivery_address?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id?: number;
  price: number;
  quantity: number;
  cost?: number;
  name: string;
  type: 'product' | 'service';
  custom_price?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SalePayment {
  id: number;
  sale_id: number;
  method: string;
  amount: number;
  created_at?: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface SalesStatistics {
  totalSales: number;
  totalRevenue: number;
  averageSale: number;
  totalProfit: number;
  periodSales: { date: string; value: number }[];
}

export interface SaleDetails {
  sale: Sale;
  items: SaleItem[];
  payments: SalePayment[];
}
