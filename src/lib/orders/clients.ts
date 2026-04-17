import type { SupabaseClient } from "@supabase/supabase-js";

export type ClientPricingRow = {
    id: string;
    name: string | null;
    price_small: number | null;
    price_medium: number | null;
    price_large: number | null;
    price_large_a: number | null;
};

export async function fetchClientPricingById(supabase: SupabaseClient, clientId: string): Promise<ClientPricingRow | null> {
    const { data, error } = await supabase
        .from("clients")
        .select("id,name,price_small,price_medium,price_large,price_large_a")
        .eq("id", clientId)
        .maybeSingle();

    if (error) throw error;
    return data as ClientPricingRow | null;
}

