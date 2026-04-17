type EditableProductInput = {
    brand?: string | null;
    model?: string | null;
    original_serial?: string | null;
    voltage?: string | null;
    commercial_code?: string | null;
    color?: string | null;
    product_type?: string | null;
    pnc_ml?: string | null;
    manufacturing_date?: string | null;
    market_class?: string | null;
    refrigerant_gas?: string | null;
    gas_charge?: string | null;
    compressor?: string | null;
    volume_freezer?: string | null;
    volume_refrigerator?: string | null;
    volume_total?: string | null;
    pressure_high_low?: string | null;
    freezing_capacity?: string | null;
    electric_current?: string | null;
    defrost_power?: string | null;
    frequency?: string | null;
    status?: string | null;
};

function sanitizeText(value: unknown, maxLen: number, upper: boolean = false): string | null {
    const base = typeof value === "string" ? value.trim() : "";
    if (!base) return null;
    const withoutControls = Array.from(base).map((ch) => {
        const code = ch.charCodeAt(0);
        if (code < 32 || code === 127) return " ";
        return ch;
    }).join("");
    const cleaned = withoutControls.replace(/\s+/g, " ").slice(0, maxLen);
    return upper ? cleaned.toUpperCase() : cleaned;
}

export function validateAndSanitizeProductUpdate(input: EditableProductInput): { ok: true; data: EditableProductInput } | { ok: false; message: string } {
    const brand = sanitizeText(input.brand, 60);
    const model = sanitizeText(input.model, 80);
    const originalSerial = sanitizeText(input.original_serial, 80, true);

    if (!brand) return { ok: false, message: "Marca é obrigatória." };
    if (!model) return { ok: false, message: "Modelo é obrigatório." };
    if (!originalSerial) return { ok: false, message: "Serial original é obrigatório." };

    const status = sanitizeText(input.status, 30, true);
    if (!status) return { ok: false, message: "Status é obrigatório." };

    return {
        ok: true,
        data: {
            ...input,
            brand,
            model,
            original_serial: originalSerial,
            voltage: sanitizeText(input.voltage, 20, true),
            commercial_code: sanitizeText(input.commercial_code, 40, true),
            color: sanitizeText(input.color, 40),
            product_type: sanitizeText(input.product_type, 60),
            pnc_ml: sanitizeText(input.pnc_ml, 40, true),
            manufacturing_date: sanitizeText(input.manufacturing_date, 30),
            market_class: sanitizeText(input.market_class, 60),
            refrigerant_gas: sanitizeText(input.refrigerant_gas, 40, true),
            gas_charge: sanitizeText(input.gas_charge, 40, true),
            compressor: sanitizeText(input.compressor, 40, true),
            volume_freezer: sanitizeText(input.volume_freezer, 20, true),
            volume_refrigerator: sanitizeText(input.volume_refrigerator, 20, true),
            volume_total: sanitizeText(input.volume_total, 20, true),
            pressure_high_low: sanitizeText(input.pressure_high_low, 30, true),
            freezing_capacity: sanitizeText(input.freezing_capacity, 30, true),
            electric_current: sanitizeText(input.electric_current, 30, true),
            defrost_power: sanitizeText(input.defrost_power, 30, true),
            frequency: sanitizeText(input.frequency, 30, true),
            status
        }
    };
}
