import { describe, expect, it } from "vitest";
import { buildOrderSummaryBySize } from "./summary";

describe("orders/summary", () => {
    it("agrega por tamanho e considera Grande/A quando dispenser marcado", () => {
        const order = {
            order_items: [
                { unit_price: 10, products: { size: "Grande", has_water_dispenser: true } },
                { unit_price: 30, products: { size: "Grande", has_water_dispenser: false } },
                { unit_price: 20, products: { size: "Médio", has_water_dispenser: true } }
            ]
        };

        const summary = buildOrderSummaryBySize(order);
        const bySize = new Map(summary.rows.map(r => [r.size, r]));

        expect(summary.grandTotal).toBe(60);
        expect(bySize.get("Grande/A")?.qty).toBe(1);
        expect(bySize.get("Grande")?.qty).toBe(1);
        expect(bySize.get("Médio")?.qty).toBe(1);
    });
});

