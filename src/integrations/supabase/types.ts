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
        Args: { user_id: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
