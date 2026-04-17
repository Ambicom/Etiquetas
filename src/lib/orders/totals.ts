export function calculateItemsTotal(items?: Array<{ unit_price?: number | null }>): number {
    return (items || []).reduce((acc, item) => acc + Number(item.unit_price || 0), 0);
}

export type SupabaseRpcErrorLike = {
    code?: string | null;
    message?: string | null;
};

export function isMissingRpcError(error: unknown): boolean {
    const code = String((error as SupabaseRpcErrorLike)?.code || "");
    const message = String((error as SupabaseRpcErrorLike)?.message || "").toLowerCase();
    return code === "PGRST202" || message.includes("schema cache") || message.includes("could not find the function");
}

