SET client_encoding = 'UTF8';

UPDATE public.checklist_items
SET
  label = replace(label, '├¡', 'í'),
  category = replace(category, '├¡', 'í')
WHERE label like '%├¡%' OR category like '%├¡%';
