declare const Deno: any;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    // Trata preflight do CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({
                error: 'METHOD_NOT_ALLOWED: Use POST.',
                provider: "openai"
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 405,
            });
        }

        let body;
        try {
            body = await req.json();
        } catch (e: unknown) {
            throw new Error(`INTERNAL_JSON_PARSE_ERROR: ${(e as Error).message}`);
        }

        const { image, model: requestedModel } = body;
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        // Forçando um modelo estável para teste
        const allowedModels = new Set([
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4.1-mini",
            "gpt-4.1"
        ]);
        const model =
            typeof requestedModel === "string" && allowedModels.has(requestedModel)
                ? requestedModel
                : (Deno.env.get('OPENAI_MODEL') || "gpt-4o-mini");
        const provider = "openai";
        const endpoint = "https://api.openai.com/v1/chat/completions";
        const build = "2026-04-25T02:10:00Z"; // Forçar redeploy

        if (!openaiKey) {
            throw new Error('CONFIG_MISSING: OPENAI_API_KEY não está definida nas Secrets do Supabase.');
        }

        if (typeof image !== "string" || image.trim().length === 0) {
            throw new Error('VALIDATION_ERROR: O campo "image" (base64) é obrigatório.');
        }

        const imageTrimmed = image.trim();
        const estimatedBytes = Math.floor((imageTrimmed.length * 3) / 4);
        if (estimatedBytes > 8 * 1024 * 1024) {
            throw new Error(`VALIDATION_ERROR: Imagem muito grande (${estimatedBytes} bytes). Reduza a resolução e tente novamente.`);
        }

        const mime =
            imageTrimmed.startsWith("/9j") ? "image/jpeg" :
                imageTrimmed.startsWith("iVBOR") ? "image/png" :
                    imageTrimmed.startsWith("UklGR") ? "image/webp" :
                        "image/jpeg";

        console.log(`OpenAI Request: Provider=${provider} Endpoint=${endpoint} Model=${model} Build=${build}`);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openaiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Extraia dados técnicos desta etiqueta industrial para JSON. Retorne apenas o JSON: fabricante, modelo, codigo_comercial, cor, pnc_ml, numero_serie, data_fabricacao, gas_refrigerante, volume_total, tensao, tipo, classe_mercado, carga_gas, compressor, volume_freezer, volume_refrigerator, pressao_alta_baixa, capacidade_congelamento, corrente_eletrica, potencia_degelo, frequencia."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${mime};base64,${imageTrimmed}`
                                }
                            }
                        ]
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "etiqueta_tecnica",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                fabricante: { type: "string" },
                                modelo: { type: "string" },
                                codigo_comercial: { type: "string" },
                                cor: { type: "string" },
                                pnc_ml: { type: "string" },
                                numero_serie: { type: "string" },
                                data_fabricacao: { type: "string" },
                                gas_refrigerante: { type: "string" },
                                volume_total: { type: "string" },
                                tensao: { type: "string" },
                                tipo: { type: "string" },
                                classe_mercado: { type: "string" },
                                carga_gas: { type: "string" },
                                compressor: { type: "string" },
                                volume_freezer: { type: "string" },
                                volume_refrigerator: { type: "string" },
                                pressao_alta_baixa: { type: "string" },
                                capacidade_congelamento: { type: "string" },
                                corrente_eletrica: { type: "string" },
                                potencia_degelo: { type: "string" },
                                frequencia: { type: "string" }
                            },
                            required: ["fabricante", "modelo", "codigo_comercial", "cor", "pnc_ml", "numero_serie", "data_fabricacao", "gas_refrigerante", "volume_total", "tensao", "tipo", "classe_mercado", "carga_gas", "compressor", "volume_freezer", "volume_refrigerator", "pressao_alta_baixa", "capacidade_congelamento", "corrente_eletrica", "potencia_degelo", "frequencia"],
                            additionalProperties: false
                        }
                    }
                }
            })
        });

        const resData = await response.json();
        console.log(`OpenAI Status: ${response.status}`);

        if (!response.ok) {
            const aiError = resData.error?.message || JSON.stringify(resData);
            return new Response(JSON.stringify({
                error: `OPENAI_REJECTED (${response.status}): ${aiError}`,
                provider,
                model,
                build
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: response.status,
            });
        }

        const content = resData.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('IA_EMPTY_CONTENT: A OpenAI não devolveu conteúdo na resposta.');
        }

        return new Response(JSON.stringify({ content, provider, model, build }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro fatal desconhecido';
        console.error('Edge Function Trace:', message);

        return new Response(JSON.stringify({
            error: message,
            provider: "openai",
            build: "2026-04-25",
            diagnostic: "Verifique se a secret OPENAI_API_KEY está correta e se há créditos/limites na conta da OpenAI."
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
