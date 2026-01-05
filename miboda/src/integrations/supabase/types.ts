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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          category: Database["public"]["Enums"]["budget_category"]
          created_at: string
          id: string
          planned_amount: number
          spent_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["budget_category"]
          created_at?: string
          id?: string
          planned_amount?: number
          spent_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["budget_category"]
          created_at?: string
          id?: string
          planned_amount?: number
          spent_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      day_schedule: {
        Row: {
          activity: string
          completed: boolean
          created_at: string
          id: string
          notes: string | null
          time: string
          user_id: string
        }
        Insert: {
          activity: string
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          time: string
          user_id: string
        }
        Update: {
          activity?: string
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          time?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          confirmed: boolean | null
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          table_id: string | null
          user_id: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          table_id?: string | null
          user_id: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          table_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "seating_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          category: Database["public"]["Enums"]["budget_category"]
          city: string | null
          contacted: boolean
          created_at: string
          hired: boolean
          id: string
          instagram: string | null
          is_custom: boolean
          name: string
          notes: string | null
          price_approx: number | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["budget_category"]
          city?: string | null
          contacted?: boolean
          created_at?: string
          hired?: boolean
          id?: string
          instagram?: string | null
          is_custom?: boolean
          name: string
          notes?: string | null
          price_approx?: number | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["budget_category"]
          city?: string | null
          contacted?: boolean
          created_at?: string
          hired?: boolean
          id?: string
          instagram?: string | null
          is_custom?: boolean
          name?: string
          notes?: string | null
          price_approx?: number | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      seating_tables: {
        Row: {
          capacity: number | null
          created_at: string
          guests: string[] | null
          id: string
          table_name: string | null
          table_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          guests?: string[] | null
          id?: string
          table_name?: string | null
          table_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          guests?: string[] | null
          id?: string
          table_name?: string | null
          table_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_custom: boolean
          months_before: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_custom?: boolean
          months_before?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_custom?: boolean
          months_before?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["budget_category"] | null
          created_at: string
          description: string | null
          id: string
          provider_id: string | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["budget_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          provider_id?: string | null
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["budget_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          provider_id?: string | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      wedding_profiles: {
        Row: {
          city: string | null
          created_at: string
          guest_count: number | null
          id: string
          partner1_name: string | null
          partner2_name: string | null
          photo_url: string | null
          total_budget: number | null
          updated_at: string
          user_id: string
          wedding_date: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          guest_count?: number | null
          id?: string
          partner1_name?: string | null
          partner2_name?: string | null
          photo_url?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id: string
          wedding_date?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          guest_count?: number | null
          id?: string
          partner1_name?: string | null
          partner2_name?: string | null
          photo_url?: string | null
          total_budget?: number | null
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      budget_category:
        | "lugar_ceremonia"
        | "banquete_bebida"
        | "vestido_traje"
        | "fotografia_video"
        | "decoracion_flores"
        | "musica_sonido"
        | "invitaciones_detalles"
        | "belleza"
        | "argollas"
        | "transporte"
        | "luna_miel"
        | "imprevistos"
      transaction_type: "ingreso" | "gasto"
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
      budget_category: [
        "lugar_ceremonia",
        "banquete_bebida",
        "vestido_traje",
        "fotografia_video",
        "decoracion_flores",
        "musica_sonido",
        "invitaciones_detalles",
        "belleza",
        "argollas",
        "transporte",
        "luna_miel",
        "imprevistos",
      ],
      transaction_type: ["ingreso", "gasto"],
    },
  },
} as const
