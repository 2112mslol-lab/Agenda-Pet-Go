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
      agendamentos: {
        Row: {
          created_at: string
          data_hora: string
          email: string
          id: string
          nome_cliente: string
          servico: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          whatsapp: string
          profile_id: string | null
          service_id: string | null
          professional_id: string | null
          pet_id: string | null
          pet_name: string | null
          pet_species: string | null
        }
        Insert: {
          created_at?: string
          data_hora: string
          email: string
          id?: string
          nome_cliente: string
          servico: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          whatsapp: string
          profile_id?: string | null
          service_id?: string | null
          professional_id?: string | null
          pet_id?: string | null
          pet_name?: string | null
          pet_species?: string | null
        }
        Update: {
          created_at?: string
          data_hora?: string
          email?: string
          id?: string
          nome_cliente?: string
          servico?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          whatsapp?: string
          profile_id?: string | null
          service_id?: string | null
          professional_id?: string | null
          pet_id?: string | null
          pet_name?: string | null
          pet_species?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      business_hours: {
        Row: {
          id: string
          profile_id: string
          day_of_week: number
          open_time: string
          close_time: string
          is_closed: boolean
        }
        Insert: {
          id?: string
          profile_id: string
          day_of_week: number
          open_time: string
          close_time: string
          is_closed?: boolean
        }
        Update: {
          id?: string
          profile_id?: string
          day_of_week?: number
          open_time?: string
          close_time?: string
          is_closed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pets: {
        Row: {
          id: string
          profile_id: string
          name: string
          species: string
          breed: string | null
          size: string | null
          owner_name: string
          owner_whatsapp: string
          observations: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          species: string
          breed?: string | null
          size?: string | null
          owner_name: string
          owner_whatsapp: string
          observations?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          species?: string
          breed?: string | null
          size?: string | null
          owner_name?: string
          owner_whatsapp?: string
          observations?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          slug: string
          name: string
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      professionals: {
        Row: {
          id: string
          profile_id: string
          name: string
          specialty: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          specialty?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          specialty?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professionals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          duration: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          duration: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          duration?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: "pendente" | "confirmado" | "recusado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
