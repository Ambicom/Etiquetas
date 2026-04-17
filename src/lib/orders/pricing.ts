export type ClientPricing = {
    price_small?: number | null;
    price_medium?: number | null;
    price_large?: number | null;
    price_large_a?: number | null;
};

export function normalizeSizeLabel(sizeLabel: string | null | undefined): string {
    const normalized = (sizeLabel || "").trim();
    if (normalized === "Medio") return "Médio";
    return normalized;
}

export function getUnitPriceForClientAndSize(client: ClientPricing | null | undefined, sizeLabel: string | null | undefined): number {
    const normalized = normalizeSizeLabel(sizeLabel);
    if (normalized === "Pequeno") return Number(client?.price_small || 0) || 0;
    if (normalized === "Médio") return Number(client?.price_medium || 0) || 0;
    if (normalized === "Grande") return Number(client?.price_large || 0) || 0;
    if (normalized === "Grande/A") return Number(client?.price_large_a || 0) || 0;
    return 0;
}

