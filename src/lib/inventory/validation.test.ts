import { describe, expect, it } from "vitest";
import { validateAndSanitizeProductUpdate } from "./validation";

describe("inventory/validation", () => {
    it("rejeita quando obrigatórios não existem", () => {
        const result = validateAndSanitizeProductUpdate({ brand: "", model: "x", original_serial: "y", status: "EM ESTOQUE" });
        expect(result.ok).toBe(false);
    });

    it("sanitiza campos e força uppercase onde aplicável", () => {
        const result = validateAndSanitizeProductUpdate({
            brand: "  Electrolux ",
            model: "  im8  ",
            original_serial: " ab-12 ",
            voltage: "220v",
            status: "em estoque"
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.brand).toBe("Electrolux");
            expect(result.data.model).toBe("im8");
            expect(result.data.original_serial).toBe("AB-12");
            expect(result.data.voltage).toBe("220V");
            expect(result.data.status).toBe("EM ESTOQUE");
        }
    });
});

