# Otimização: Inventário

## Escopo

Arquivos principais:
- `src/app/inventory/page.tsx`
- `src/lib/inventory/*`
- `src/hooks/useDebouncedValue.ts`

Objetivos:
- Melhorar performance do carregamento e navegação do inventário.
- Evitar condições de corrida em chamadas assíncronas.
- Reduzir I/O e recomputações desnecessárias.
- Padronizar validação e tratamento de erros.
- Adicionar testes para evitar regressões.

## Mudanças Técnicas

### 1) Otimização de I/O (Supabase)

- A listagem do inventário deixou de usar `select("*")` e passou a buscar apenas as colunas necessárias para a grade/lista.
- O produto completo (`select("*")`) passa a ser buscado apenas quando o usuário abre a visualização detalhada (histórico) ou abre edição.

Impacto esperado:
- Menor payload por página.
- Menor custo de parse/render.
- Melhor tempo de resposta em conexões lentas.

### 2) Busca e Filtros mais estáveis

- Busca com debounce: evita múltiplas requisições enquanto o usuário digita.
- Sanitização do termo de busca: remove caracteres potencialmente problemáticos e limita tamanho.

Arquivos:
- `src/hooks/useDebouncedValue.ts`
- `src/lib/inventory/search.ts`

### 3) Controle de concorrência (race conditions)

- Introduzido controle de sequência de requisições no inventário e no histórico.
- Respostas antigas são ignoradas quando uma requisição mais nova já está em andamento.

Impacto esperado:
- Elimina “pisadas” de estado (ex.: lista mostrando resultados de filtros antigos).

### 4) Validação e sanitização no update

- Antes de atualizar um produto, os campos são validados e normalizados (trim, limites, uppercase em campos específicos).
- Mensagens de erro ficam mais claras e previsíveis.

Arquivo:
- `src/lib/inventory/validation.ts`

## Testes

Ferramentas:
- Vitest + JSDOM + Testing Library
- Cobertura com `@vitest/coverage-v8`

Testes adicionados:
- `src/lib/inventory/search.test.ts`
- `src/lib/inventory/validation.test.ts`
- `src/hooks/useDebouncedValue.test.tsx`

Cobertura (thresholds):
- Linhas/Funções/Statements: >= 80%
- Branches: >= 70%

Observação:
- A cobertura está configurada para os módulos “core” refatorados (helpers e hooks). A tela `page.tsx` é grande e depende de Supabase, portanto a estratégia foi maximizar a testabilidade extraindo lógica pura para módulos com cobertura alta.

## Como validar localmente

Comandos:
- `npm run lint`
- `npm run build`
- `npm test`
- `npm run test:coverage`

