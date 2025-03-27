export type SaleItem = {
  id?: number;
  type: 'product' | 'service';
  name: string;
  price: number;
  cost?: number;
  quantity: number;
  custom_price?: boolean;
};

export type PaymentMethod = {
  method: string;
  amount: number;
};

export type SalesFormValues = {
  customerName: string;
  customerContact: string;
  saleChannel: string;
  otherChannel?: string;
  paymentMethods: PaymentMethod[];
  discount: number;
  discountType: 'percentage' | 'fixed';
  notes: string;
  deliveryAddress?: string;
  deliveryFee?: number;
};

export type SaleData = SalesFormValues & {
  saleNumber: number;
  items: SaleItem[];
  subtotal: number;
  finalTotal: number;
  profit: number;
  date: string;
};
