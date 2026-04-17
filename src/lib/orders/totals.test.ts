import { describe, expect, it } from "vitest";
import { calculateItemsTotal, isMissingRpcError } from "./totals";

describe("orders/totals", () => {
    it("soma unit_price corretamente", () => {
        expect(calculateItemsTotal([{ unit_price: 10 }, { unit_price: 2.5 }, { unit_price: null }])).toBe(12.5);
    });

    it("identifica erro de RPC ausente por código", () => {
        expect(isMissingRpcError({ code: "PGRST202", message: "x" })).toBe(true);
    });

    it("identifica erro de RPC ausente por mensagem", () => {
        expect(isMissingRpcError({ message: "Could not find the function public.recalculate_order_total(p_order_id) in the schema cache" })).toBe(true);
    });

    it("retorna false quando não é erro de RPC ausente", () => {
        expect(isMissingRpcError({ code: "OTHER", message: "x" })).toBe(false);
    });
});
