import { supabase } from "./client";

export async function fetchStatePolicies() {
  const { data, error } = await supabase.from('states').select('*');
  if (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
  return data || [];
}
