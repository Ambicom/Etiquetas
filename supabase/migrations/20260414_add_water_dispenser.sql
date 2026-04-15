ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS has_water_dispenser boolean NOT NULL DEFAULT false;
