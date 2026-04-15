SET client_encoding = 'UTF8';

UPDATE public.clients
SET
  name = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(name, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', ''),
  address = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(address, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', '')
WHERE name like '%├%' OR name like '%�%' OR address like '%├%' OR address like '%�%';

UPDATE public.checklist_items
SET
  label = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(label, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', ''),
  category = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(category, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', '')
WHERE label like '%├%' OR label like '%�%' OR category like '%├%' OR category like '%�%';

UPDATE public.products
SET
  size = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(size, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', '')
WHERE size like '%├%' OR size like '%�%';

UPDATE public.system_settings
SET
  description = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(description, '├ç', 'Ç'), '├º', 'ç'), '├â', 'Ã'), '├ú', 'ã'), '├ë', 'É'), '├®', 'é'), '├ò', 'Õ'), '├ì', 'Í'), '├ü', 'Á'), '�', '')
WHERE description like '%├%' OR description like '%�%';

