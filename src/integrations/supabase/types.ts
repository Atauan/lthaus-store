export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      cost_change_logs: {
        Row: {
          change_percentage: number
          created_at: string
          id: string
          new_cost: number
          notes: string | null
          previous_cost: number
          product_id: number
        }
        Insert: {
          change_percentage: number
          created_at?: string
          id?: string
          new_cost: number
          notes?: string | null
          previous_cost: number
          product_id: number
        }
        Update: {
          change_percentage?: number
          created_at?: string
          id?: string
          new_cost?: number
          notes?: string | null
          previous_cost?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cost_change_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          cost: number | null
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          image_url: string | null
          min_stock: number
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          brand: string
          category: string
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          image_url?: string | null
          min_stock?: number
          name: string
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          brand?: string
          category?: string
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          image_url?: string | null
          min_stock?: number
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          cost: number | null
          created_at: string | null
          id: number
          price: number
          product_id: number
          quantity: number
          sale_id: number
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: number
          price: number
          product_id: number
          quantity: number
          sale_id: number
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: number
          price?: number
          product_id?: number
          quantity?: number
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          method: string
          sale_id: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          method: string
          sale_id: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          method?: string
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          customer_contact: string | null
          customer_name: string | null
          delivery_address: string | null
          delivery_fee: number | null
          discount: number | null
          final_total: number
          id: number
          notes: string | null
          payment_method: string
          profit: number | null
          sale_channel: string | null
          sale_date: string | null
          sale_number: number
          status: string | null
          subtotal: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          final_total: number
          id?: number
          notes?: string | null
          payment_method: string
          profit?: number | null
          sale_channel?: string | null
          sale_date?: string | null
          sale_number: number
          status?: string | null
          subtotal: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          final_total?: number
          id?: number
          notes?: string | null
          payment_method?: string
          profit?: number | null
          sale_channel?: string | null
          sale_date?: string | null
          sale_number?: number
          status?: string | null
          subtotal?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stock_logs: {
        Row: {
          change_amount: number
          created_at: string
          id: string
          new_stock: number
          notes: string | null
          previous_stock: number
          product_id: number
          reference_id: string | null
          reference_type: string
        }
        Insert: {
          change_amount: number
          created_at?: string
          id?: string
          new_stock: number
          notes?: string | null
          previous_stock: number
          product_id: number
          reference_id?: string | null
          reference_type: string
        }
        Update: {
          change_amount?: number
          created_at?: string
          id?: string
          new_stock?: number
          notes?: string | null
          previous_stock?: number
          product_id?: number
          reference_id?: string | null
          reference_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_costs: {
        Row: {
          created_at: string
          id: string
          marketing: number
          month: string
          other: number
          rent: number
          salaries: number
          updated_at: string
          utilities: number
          year: string
        }
        Insert: {
          created_at?: string
          id?: string
          marketing?: number
          month: string
          other?: number
          rent?: number
          salaries?: number
          updated_at?: string
          utilities?: number
          year: string
        }
        Update: {
          created_at?: string
          id?: string
          marketing?: number
          month?: string
          other?: number
          rent?: number
          salaries?: number
          updated_at?: string
          utilities?: number
          year?: string
        }
        Relationships: []
      }
      store_info: {
        Row: {
          address: string
          city: string
          cnpj: string | null
          created_at: string | null
          defaultseller: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          ownername: string | null
          phone: string | null
          state: string
          updated_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          cnpj?: string | null
          created_at?: string | null
          defaultseller?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          ownername?: string | null
          phone?: string | null
          state: string
          updated_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          cnpj?: string | null
          created_at?: string | null
          defaultseller?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          ownername?: string | null
          phone?: string | null
          state?: string
          updated_at?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          categories: string[]
          contact: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[]
          contact?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[]
          contact?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
