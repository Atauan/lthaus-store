
// Types for supplier-related functionality
export interface Supplier {
  id: number;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  categories?: string[];
}

export interface SupplierFormData {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  categories?: string[];
}
