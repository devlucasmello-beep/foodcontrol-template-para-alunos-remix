export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          app_name: string | null
          created_at: string
          id: string
          singleton: boolean
          super_admin_emails: string[]
          system_settings: Json | null
          updated_at: string
        }
        Insert: {
          app_name?: string | null
          created_at?: string
          id?: string
          singleton?: boolean
          super_admin_emails?: string[]
          system_settings?: Json | null
          updated_at?: string
        }
        Update: {
          app_name?: string | null
          created_at?: string
          id?: string
          singleton?: boolean
          super_admin_emails?: string[]
          system_settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      company: {
        Row: {
          business_hours: Json | null
          cnpj: string | null
          cor_primaria: string
          created_at: string
          delivery_fee: number
          email: string | null
          endereco: Json | null
          id: string
          logo_url: string | null
          min_order: number
          name: string
          plano: Database["public"]["Enums"]["plan_tier"]
          slug: string
          status: Database["public"]["Enums"]["company_status"]
          telefone: string | null
          trial_ate: string
          ultimo_acesso: string | null
          updated_at: string
          valor_mensal: number
          whatsapp: string | null
        }
        Insert: {
          business_hours?: Json | null
          cnpj?: string | null
          cor_primaria?: string
          created_at?: string
          delivery_fee?: number
          email?: string | null
          endereco?: Json | null
          id?: string
          logo_url?: string | null
          min_order?: number
          name: string
          plano?: Database["public"]["Enums"]["plan_tier"]
          slug: string
          status?: Database["public"]["Enums"]["company_status"]
          telefone?: string | null
          trial_ate?: string
          ultimo_acesso?: string | null
          updated_at?: string
          valor_mensal?: number
          whatsapp?: string | null
        }
        Update: {
          business_hours?: Json | null
          cnpj?: string | null
          cor_primaria?: string
          created_at?: string
          delivery_fee?: number
          email?: string | null
          endereco?: Json | null
          id?: string
          logo_url?: string | null
          min_order?: number
          name?: string
          plano?: Database["public"]["Enums"]["plan_tier"]
          slug?: string
          status?: Database["public"]["Enums"]["company_status"]
          telefone?: string | null
          trial_ate?: string
          ultimo_acesso?: string | null
          updated_at?: string
          valor_mensal?: number
          whatsapp?: string | null
        }
        Relationships: []
      }
      company_user: {
        Row: {
          ativo: boolean
          company_id: string
          created_at: string
          email: string
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["app_role"]
          ultimo_login: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          company_id: string
          created_at?: string
          email: string
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          ultimo_login?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          ultimo_login?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_user_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      customer: {
        Row: {
          address: Json | null
          company_id: string
          created_at: string
          email: string | null
          id: string
          last_order_at: string | null
          name: string
          phone: string
          status: string
          total_orders: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          address?: Json | null
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          name: string
          phone: string
          status?: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          address?: Json | null
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          name?: string
          phone?: string
          status?: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zone: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          delivery_fee: number | null
          eta_minutes: number
          id: string
          min_order: number | null
          name: string
          polygon: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          delivery_fee?: number | null
          eta_minutes?: number
          id?: string
          min_order?: number | null
          name: string
          polygon?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          delivery_fee?: number | null
          eta_minutes?: number
          id?: string
          min_order?: number | null
          name?: string
          polygon?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zone_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_entry: {
        Row: {
          amount: number
          category: string | null
          company_id: string
          created_at: string
          date: string
          description: string | null
          id: string
          reference_order_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          company_id: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          reference_order_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          company_id?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          reference_order_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_entry_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entry_reference_order_id_fkey"
            columns: ["reference_order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_category: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_category_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item: {
        Row: {
          available: boolean
          category_id: string | null
          company_id: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          name: string
          prep_time_minutes: number
          price: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          category_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          prep_time_minutes?: number
          price?: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          prep_time_minutes?: number
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_extra: {
        Row: {
          created_at: string
          id: string
          max_qty: number
          menu_item_id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_qty?: number
          menu_item_id: string
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_qty?: number
          menu_item_id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_extra_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_item"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          company_id: string
          created_at: string
          customer_address: Json | null
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_fee: number
          discount: number
          eta_minutes: number | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          rider_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_address?: Json | null
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_fee?: number
          discount?: number
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          type?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_address?: Json | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number
          discount?: number
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "rider"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item: {
        Row: {
          created_at: string
          extras: Json | null
          id: string
          menu_item_id: string | null
          name: string
          notes: string | null
          order_id: string
          qty: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          extras?: Json | null
          id?: string
          menu_item_id?: string | null
          name: string
          notes?: string | null
          order_id: string
          qty?: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          extras?: Json | null
          id?: string
          menu_item_id?: string | null
          name?: string
          notes?: string | null
          order_id?: string
          qty?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rider: {
        Row: {
          active: boolean
          commission_pct: number
          company_id: string
          created_at: string
          id: string
          name: string
          phone: string
          plate: string | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          active?: boolean
          commission_pct?: number
          company_id: string
          created_at?: string
          id?: string
          name: string
          phone: string
          plate?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          active?: boolean
          commission_pct?: number
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          plate?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_company_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "garcom"
        | "cozinha"
        | "entregador"
        | "caixa"
        | "demo"
      company_status:
        | "trial"
        | "active"
        | "inadimplente"
        | "suspended"
        | "inactive"
      order_status:
        | "novo"
        | "preparo"
        | "pronto"
        | "saiu"
        | "entregue"
        | "cancelado"
      plan_tier: "starter" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "garcom",
        "cozinha",
        "entregador",
        "caixa",
        "demo",
      ],
      company_status: [
        "trial",
        "active",
        "inadimplente",
        "suspended",
        "inactive",
      ],
      order_status: [
        "novo",
        "preparo",
        "pronto",
        "saiu",
        "entregue",
        "cancelado",
      ],
      plan_tier: ["starter", "pro", "enterprise"],
    },
  },
} as const

