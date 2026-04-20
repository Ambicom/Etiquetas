-- Migração para corrigir a tabela 'active_bridges' usada pela ponte de impressão (Flutter Print Bridge)
-- Arquivo: supabase/migrations/20260419_fix_active_bridges.sql

-- 1. Garante que 'bridge_name' tenha uma restrição UNIQUE. 
-- Sem isso, o upsert (onConflict: 'bridge_name') falha silenciosamente ou retorna erro 42501/constraint.
-- OBS: Esta linha está comentada pois o sistema identificou que a chave 'active_bridges_bridge_name_key' já existe.
-- ALTER TABLE active_bridges ADD CONSTRAINT active_bridges_bridge_name_key UNIQUE (bridge_name);

-- 2. Configurações de RLS (Row Level Security)
-- Como o aplicativo em Flutter pode estar utilizando a "Anon Key" (a chave anônima), 
-- o Supabase exige políticas claras para permitir INSERT, UPDATE ou SELECT.
-- Se preferir maior segurança, garanta que a ponte Flutter utilize APENAS a **Service Role Key**.

ALTER TABLE active_bridges ENABLE ROW LEVEL SECURITY;

-- Permite que qualquer um leia (necessário para a fila web)
CREATE POLICY "Allow anon select to active_bridges"
  ON active_bridges FOR SELECT
  USING (true);

-- Permite INSERT ou UPSERT do Heartbeat da Impressora
CREATE POLICY "Allow anon insert to active_bridges"
  ON active_bridges FOR INSERT
  WITH CHECK (true);

-- Permite UPDATE (Heartbeat recebido)
CREATE POLICY "Allow anon update to active_bridges"
  ON active_bridges FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Permite DELETE (quando o usuário remove o Bridge nas Configurações)
CREATE POLICY "Allow anon delete to active_bridges"
  ON active_bridges FOR DELETE
  USING (true);

-- (Opcional, mas recomendado) Assegura que 'print_jobs' também possua as permissões corretas
ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on print_jobs"
  ON print_jobs FOR SELECT
  USING (true);

CREATE POLICY "Allow anon update on print_jobs"
  ON print_jobs FOR UPDATE
  USING (true)
  WITH CHECK (true);
