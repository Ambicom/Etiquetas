export function sanitizeSearchTerm(input: string, maxLen: number = 60): string {
    const trimmed = (input || "").trim();
    if (!trimmed) return "";
    const normalized = trimmed
        .replace(/[_%]/g, " ")
        .replace(/[^\p{L}\p{N}\s.\-_/]/gu, " ")
        .replace(/\s+/g, " ")
        .slice(0, maxLen);
    return normalized;
}

export function buildInventoryOrSearch(searchTerm: string): string | null {
    const safe = sanitizeSearchTerm(searchTerm);
    if (!safe) return null;

    const escaped = safe.replace(/[%_]/g, "");
    const pattern = `%${escaped}%`;

    return [
        `brand.ilike.${pattern}`,
        `model.ilike.${pattern}`,
        `internal_serial.ilike.${pattern}`,
        `original_serial.ilike.${pattern}`,
        `product_type.ilike.${pattern}`,
        `market_class.ilike.${pattern}`,
        `refrigerant_gas.ilike.${pattern}`,
        `voltage.ilike.${pattern}`,
        `pnc_ml.ilike.${pattern}`,
        `commercial_code.ilike.${pattern}`
    ].join(",");
}
