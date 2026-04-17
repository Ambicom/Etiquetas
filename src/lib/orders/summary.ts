import { formatProductSizeForLabel } from "@/lib/product-utils";

export type OrderSummaryRow = { size: string; qty: number; unit: number; total: number };
export type OrderSummary = { rows: OrderSummaryRow[]; grandTotal: number };

export function buildOrderSummaryBySize(order: {
    order_items?: Array<{
        unit_price?: number | null;
        products?: { size?: string | null; has_water_dispenser?: boolean | null } | null;
    }>;
}): OrderSummary {
    const items = (order.order_items || [])
        .map(i => ({
            unitPrice: Number(i.unit_price || 0),
            product: i.products || null
        }))
        .filter(i => i.product);

    const orderKey: Record<string, number> = {
        Pequeno: 1,
        "Médio": 2,
        Medio: 2,
        Grande: 3,
        "Grande/A": 4
    };

    const map = new Map<string, OrderSummaryRow>();

    for (const item of items) {
        const sizeRaw = item.product?.size;
        const hasWater = Boolean(item.product?.has_water_dispenser);
        const sizeLabel = formatProductSizeForLabel(sizeRaw ?? null, hasWater) || "Não informado";

        const current = map.get(sizeLabel) || { size: sizeLabel, qty: 0, unit: item.unitPrice, total: 0 };
        current.qty += 1;
        current.total += item.unitPrice;
        if (!current.unit && item.unitPrice) current.unit = item.unitPrice;
        map.set(sizeLabel, current);
    }

    const rows = Array.from(map.values()).sort((a, b) => {
        const ka = orderKey[a.size] ?? 999;
        const kb = orderKey[b.size] ?? 999;
        if (ka !== kb) return ka - kb;
        return a.size.localeCompare(b.size, "pt-BR");
    });

    const grandTotal = rows.reduce((acc, r) => acc + r.total, 0);
    return { rows, grandTotal };
}
