-- Update get_dashboard_stats to include vendidos and reprovados
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', (SELECT count(*) FROM products),
    'cadastro', (SELECT count(*) FROM products WHERE status = 'CADASTRO'),
    'em_avaliacao', (SELECT count(*) FROM products WHERE status = 'EM AVALIAÇÃO'),
    'em_estoque', (SELECT count(*) FROM products WHERE status = 'EM ESTOQUE'),
    'vendidos', (SELECT count(*) FROM products WHERE status = 'VENDIDO'),
    'reprovados', (SELECT count(*) FROM products WHERE status = 'REPROVADO')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
