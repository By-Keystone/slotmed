import { User as SUser } from "@supabase/supabase-js";

export type SupabaseUser = SUser;

export type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  authId: string;
};
