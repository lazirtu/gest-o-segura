# Estrutura do projeto

- `src/routes` — rotas (file-based routing). Rotas protegidas devem ficar em `src/routes/_authenticated/`.
- `src/components/layout` — layouts e chrome da aplicação.
- `src/components/ui` — primitivas de interface (shadcn).
- `src/features` — módulos de domínio (ex.: `transactions`, `budgets`), cada um com seus componentes, hooks e chamadas de dados.
- `src/config` — configuração central da aplicação.
- `src/types` — tipos compartilhados.
- `src/lib` — utilitários genéricos (formatação, helpers).
- `src/hooks` — hooks reutilizáveis.

## Convenções

- Cores, sombras e gradientes vivem em `src/styles.css` como tokens semânticos; não use classes de cor fixas nos componentes.
- Acesso a dados fica em server functions (`*.functions.ts`) dentro do módulo da feature.
- Ao habilitar o backend, o cliente autenticado e os tipos gerados ficam em `src/integrations/`.
