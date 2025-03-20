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
      products: {
        Row: {
          brand: string
          category: string
          cost: number | null
          created_at: string | null
          description: string | null
          id: number
          image: string | null
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
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
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
          subtotal: number
          updated_at: string | null
          user_id: string
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
          subtotal: number
          updated_at?: string | null
          user_id: string
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
          subtotal?: number
          updated_at?: string | null
          user_id?: string
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
      suppliers: {
        Row: {
          address: string | null
          categories: string[]
          contact: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          categories?: string[]
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          categories?: string[]
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
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
