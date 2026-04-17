import { describe, expect, it } from "vitest";
import { getUnitPriceForClientAndSize, normalizeSizeLabel } from "./pricing";

describe("orders/pricing", () => {
    it("normalizeSizeLabel normaliza Medio para Médio", () => {
        expect(normalizeSizeLabel("Medio")).toBe("Médio");
        expect(normalizeSizeLabel("Médio")).toBe("Médio");
    });

    it("retorna 0 quando cliente não existe", () => {
        expect(getUnitPriceForClientAndSize(null, "Pequeno")).toBe(0);
    });

    it("retorna preços corretos por tamanho", () => {
        const client = { price_small: 10, price_medium: 20, price_large: 30, price_large_a: 40 };
        expect(getUnitPriceForClientAndSize(client, "Pequeno")).toBe(10);
        expect(getUnitPriceForClientAndSize(client, "Médio")).toBe(20);
        expect(getUnitPriceForClientAndSize(client, "Medio")).toBe(20);
        expect(getUnitPriceForClientAndSize(client, "Grande")).toBe(30);
        expect(getUnitPriceForClientAndSize(client, "Grande/A")).toBe(40);
    });
});

