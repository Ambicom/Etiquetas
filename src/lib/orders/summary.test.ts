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

    it("retorna vazio quando não há itens", () => {
        const summary = buildOrderSummaryBySize({ order_items: [] });
        expect(summary.rows).toEqual([]);
        expect(summary.grandTotal).toBe(0);
    });

    it("ignora itens sem produto e agrega Não informado quando tamanho é nulo", () => {
        const summary = buildOrderSummaryBySize({
            order_items: [
                { unit_price: 0, products: null },
                { unit_price: 0, products: { size: null, has_water_dispenser: false } },
                { unit_price: 15, products: { size: null, has_water_dispenser: false } }
            ]
        });

        const row = summary.rows.find(r => r.size === "Não informado");
        expect(row?.qty).toBe(2);
        expect(row?.unit).toBe(15);
        expect(summary.grandTotal).toBe(15);
    });
});
