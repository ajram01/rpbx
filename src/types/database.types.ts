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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      business_listings: {
        Row: {
          annual_revenue_range: string | null
          book_value_range: string | null
          can_provide_financials: boolean | null
          can_provide_tax_returns: boolean | null
          contact_email: string | null
          county: string | null
          created_at: string | null
          description: string | null
          ebitda_range: string | null
          employee_count_range: string | null
          id: string
          industry: string
          is_active: boolean | null
          is_promoted: boolean | null
          listing_image_alt: string | null
          listing_image_h: number | null
          listing_image_path: string | null
          listing_image_w: number | null
          location_city: string | null
          owner_id: string
          ownership_percentage: number | null
          status: string
          title: string
          updated_at: string | null
          years_in_business: string | null
        }
        Insert: {
          annual_revenue_range?: string | null
          book_value_range?: string | null
          can_provide_financials?: boolean | null
          can_provide_tax_returns?: boolean | null
          contact_email?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          ebitda_range?: string | null
          employee_count_range?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          is_promoted?: boolean | null
          listing_image_alt?: string | null
          listing_image_h?: number | null
          listing_image_path?: string | null
          listing_image_w?: number | null
          location_city?: string | null
          owner_id: string
          ownership_percentage?: number | null
          status?: string
          title: string
          updated_at?: string | null
          years_in_business?: string | null
        }
        Update: {
          annual_revenue_range?: string | null
          book_value_range?: string | null
          can_provide_financials?: boolean | null
          can_provide_tax_returns?: boolean | null
          contact_email?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          ebitda_range?: string | null
          employee_count_range?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          is_promoted?: boolean | null
          listing_image_alt?: string | null
          listing_image_h?: number | null
          listing_image_path?: string | null
          listing_image_w?: number | null
          location_city?: string | null
          owner_id?: string
          ownership_percentage?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          years_in_business?: string | null
        }
        Relationships: []
      }
      business_memberships: {
        Row: {
          billing_interval: string
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          max_listings: number
          plan_code: string
          product_name: string
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_interval: string
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          max_listings?: number
          plan_code: string
          product_name: string
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_interval?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          max_listings?: number
          plan_code?: string
          product_name?: string
          status?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      investor_profiles: {
        Row: {
          additional_industries: string[] | null
          avatar_alt: string | null
          avatar_h: number | null
          avatar_path: string | null
          avatar_updated_at: string | null
          avatar_w: number | null
          bio: string | null
          city: string | null
          contact_email: string | null
          created_at: string | null
          first_name: string | null
          full_name_lc: string | null
          id: string
          industry_experience: string | null
          is_accredited_investor: boolean | null
          last_name: string | null
          net_worth: string | null
          org_name_lc: string | null
          organization_entity: string | null
          ownership_max: number | null
          ownership_min: number | null
          primary_industry: string | null
          status: string
          target_cash_flow: string | null
          target_ebitda: string | null
          updated_at: string | null
          user_id: string
          willing_to_sign_nda: boolean | null
          years_in_target_industry: string | null
        }
        Insert: {
          additional_industries?: string[] | null
          avatar_alt?: string | null
          avatar_h?: number | null
          avatar_path?: string | null
          avatar_updated_at?: string | null
          avatar_w?: number | null
          bio?: string | null
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name_lc?: string | null
          id?: string
          industry_experience?: string | null
          is_accredited_investor?: boolean | null
          last_name?: string | null
          net_worth?: string | null
          org_name_lc?: string | null
          organization_entity?: string | null
          ownership_max?: number | null
          ownership_min?: number | null
          primary_industry?: string | null
          status?: string
          target_cash_flow?: string | null
          target_ebitda?: string | null
          updated_at?: string | null
          user_id: string
          willing_to_sign_nda?: boolean | null
          years_in_target_industry?: string | null
        }
        Update: {
          additional_industries?: string[] | null
          avatar_alt?: string | null
          avatar_h?: number | null
          avatar_path?: string | null
          avatar_updated_at?: string | null
          avatar_w?: number | null
          bio?: string | null
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name_lc?: string | null
          id?: string
          industry_experience?: string | null
          is_accredited_investor?: boolean | null
          last_name?: string | null
          net_worth?: string | null
          org_name_lc?: string | null
          organization_entity?: string | null
          ownership_max?: number | null
          ownership_min?: number | null
          primary_industry?: string | null
          status?: string
          target_cash_flow?: string | null
          target_ebitda?: string | null
          updated_at?: string | null
          user_id?: string
          willing_to_sign_nda?: boolean | null
          years_in_target_industry?: string | null
        }
        Relationships: []
      }
      listing_evaluations: {
        Row: {
          created_at: string
          id: number
          listing_id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          listing_id: string
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          listing_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_evaluations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_promotions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          id: number
          listing_id: string
          status: string
          stripe_subscription_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: number
          listing_id: string
          status: string
          stripe_subscription_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: number
          listing_id?: string
          status?: string
          stripe_subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          migrated_at: string | null
          migration_status: string | null
          updated_at: string | null
          user_type: string
          username: string | null
          wordpress_user_id: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          migrated_at?: string | null
          migration_status?: string | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
          wordpress_user_id?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          migrated_at?: string | null
          migration_status?: string | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
          wordpress_user_id?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_currency: string | null
          price_id: string | null
          price_interval: string | null
          price_interval_count: number | null
          price_lookup_key: string | null
          price_metadata: Json | null
          price_nickname: string | null
          price_unit_amount: number | null
          product_id: string | null
          product_metadata: Json | null
          product_name: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_currency?: string | null
          price_id?: string | null
          price_interval?: string | null
          price_interval_count?: number | null
          price_lookup_key?: string | null
          price_metadata?: Json | null
          price_nickname?: string | null
          price_unit_amount?: number | null
          product_id?: string | null
          product_metadata?: Json | null
          product_name?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_currency?: string | null
          price_id?: string | null
          price_interval?: string | null
          price_interval_count?: number | null
          price_lookup_key?: string | null
          price_metadata?: Json | null
          price_nickname?: string | null
          price_unit_amount?: number | null
          product_id?: string | null
          product_metadata?: Json | null
          product_name?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id: string
          role: string
        }
        Update: {
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_user_listing_entitlements: {
        Row: {
          allowed_active_listings: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_investor_email_by_profile_id: {
        Args: { p_profile_id: string }
        Returns: {
          email: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
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
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
      ],
    },
  },
} as const
