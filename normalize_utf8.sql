-- SCRIPT DE NORMALIZAÇÃO DE ENCODING (UTF-8)
-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- ESTE SCRIPT CORRIGE CARACTERES CORROMPIDOS PELO ENCODING CP850/LATIN1

DO $$
DECLARE
    row_record RECORD;
BEGIN
    -- 1. CORREÇÃO NA TABELA DE CLIENTES
    UPDATE clients SET 
        name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, '├Â', 'Ã'), '├ç', 'Ç'), '├â', 'Ã'), '├í', 'á'), '├│', 'ó'), '├ú', 'ã'),
        address = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(address, '├Â', 'Ã'), '├ç', 'Ç'), '├â', 'Ã'), '├í', 'á'), '├│', 'ó'), '├ú', 'ã')
    WHERE name LIKE '%├%' OR address LIKE '%├%';

    -- 2. CORREÇÃO NA TABELA DE PRODUTOS
    UPDATE products SET 
        status = REPLACE(REPLACE(status, '├ç', 'Ç'), '├â', 'Ã'),
        brand = REPLACE(REPLACE(brand, '├ç', 'Ç'), '├â', 'Ã'),
        model = REPLACE(REPLACE(model, '├ç', 'Ç'), '├â', 'Ã'),
        commercial_code = REPLACE(REPLACE(commercial_code, '├ç', 'Ç'), '├â', 'Ã'),
        color = REPLACE(REPLACE(color, '├ç', 'Ç'), '├â', 'Ã'),
        product_type = REPLACE(REPLACE(product_type, '├ç', 'Ç'), '├â', 'Ã'),
        pressure_high_low = REPLACE(REPLACE(pressure_high_low, '├ç', 'Ç'), '├â', 'Ã'),
        stock_status = REPLACE(REPLACE(stock_status, '├ç', 'Ç'), '├â', 'Ã')
    WHERE status LIKE '%├%' OR brand LIKE '%├%' OR model LIKE '%├%';

    -- 3. CORREÇÃO NA TABELA DE LOGS
    UPDATE product_logs SET 
        notes = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(notes, '├Â', 'Ã'), '├ç', 'Ç'), '├â', 'Ã'), '├í', 'á'), '├│', 'ó'), '├ú', 'ã'),
        old_status = REPLACE(REPLACE(old_status, '├ç', 'Ç'), '├â', 'Ã'),
        new_status = REPLACE(REPLACE(new_status, '├ç', 'Ç'), '├â', 'Ã')
    WHERE notes LIKE '%├%' OR old_status LIKE '%├%' OR new_status LIKE '%├%';

    -- 4. CORREÇÃO NA TABELA DE PEDIDOS
    UPDATE orders SET 
        notes = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(notes, '├Â', 'Ã'), '├ç', 'Ç'), '├â', 'Ã'), '├í', 'á'), '├│', 'ó'), '├ú', 'ã')
    WHERE notes LIKE '%├%';

END $$;
