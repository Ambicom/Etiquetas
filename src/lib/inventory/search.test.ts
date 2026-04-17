import { describe, expect, it } from "vitest";
import { buildInventoryOrSearch, sanitizeSearchTerm } from "./search";

describe("inventory/search", () => {
    it("sanitiza e limita tamanho", () => {
        const input = "  abc<>\"%__  \n\r\t 123 ";
        expect(sanitizeSearchTerm(input, 10)).toBe("abc 123");
    });

    it("retorna null quando vazio após sanitização", () => {
        expect(buildInventoryOrSearch("   ")).toBeNull();
    });

    it("gera filtro OR com ilike", () => {
        const orFilter = buildInventoryOrSearch("ELECTROLUX 220");
        expect(orFilter).toContain("brand.ilike.%ELECTROLUX 220%");
        expect(orFilter).toContain("model.ilike.%ELECTROLUX 220%");
    });
});

