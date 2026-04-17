import { describe, expect, it } from "vitest";
import { fetchClientPricingById } from "./clients";

describe("orders/clients", () => {
    it("retorna dados quando a consulta funciona", async () => {
        const supabase = {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        maybeSingle: async () => ({
                            data: { id: "1", name: "C", price_small: 1, price_medium: 2, price_large: 3, price_large_a: 4 },
                            error: null
                        })
                    })
                })
            })
        } as any;

        const client = await fetchClientPricingById(supabase, "1");
        expect(client?.price_large_a).toBe(4);
    });

    it("lança erro quando a consulta retorna error", async () => {
        const supabase = {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        maybeSingle: async () => ({
                            data: null,
                            error: new Error("db")
                        })
                    })
                })
            })
        } as any;

        await expect(fetchClientPricingById(supabase, "1")).rejects.toThrow("db");
    });
});

