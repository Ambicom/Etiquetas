CREATE TABLE IF NOT EXISTS public.brand_aliases (
    alias_key TEXT PRIMARY KEY,
    canonical TEXT NOT NULL,
    canonical_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS update_brand_aliases_updated_at ON public.brand_aliases;
CREATE TRIGGER update_brand_aliases_updated_at
    BEFORE UPDATE ON public.brand_aliases
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.brand_aliases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brand aliases viewable by all authenticated users" ON public.brand_aliases;
CREATE POLICY "Brand aliases viewable by all authenticated users" ON public.brand_aliases
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Only Admins can manage brand aliases" ON public.brand_aliases;
CREATE POLICY "Only Admins can manage brand aliases" ON public.brand_aliases
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    );

CREATE INDEX IF NOT EXISTS idx_brand_aliases_canonical_key ON public.brand_aliases (canonical_key);

INSERT INTO public.brand_aliases (alias_key, canonical, canonical_key)
VALUES
    ('electrolux', 'Electrolux', 'electrolux'),
    ('eletrolux', 'Electrolux', 'electrolux'),
    ('electrolux brasil', 'Electrolux', 'electrolux'),
    ('brastemp', 'Brastemp', 'brastemp'),
    ('consul', 'Consul', 'consul'),
    ('whirlpool', 'Whirlpool', 'whirlpool'),
    ('lg', 'LG', 'lg'),
    ('samsung', 'Samsung', 'samsung'),
    ('panasonic', 'Panasonic', 'panasonic'),
    ('ge', 'GE', 'ge'),
    ('bosch', 'Bosch', 'bosch')
ON CONFLICT (alias_key) DO UPDATE
SET canonical = EXCLUDED.canonical,
    canonical_key = EXCLUDED.canonical_key;
