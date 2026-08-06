/**
 * Configuração central da aplicação.
 * Mantenha aqui valores estáticos compartilhados entre módulos.
 */
export const appConfig = {
  name: "Gestão Segura",
  description:
    "Plataforma para organizar receitas, despesas e planejamento financeiro com clareza.",
  locale: "pt-BR",
  currency: "BRL",
} as const;

/**
 * Rotas conhecidas da aplicação. Adicione novas entradas ao criar rotas
 * em `src/routes` para manter a navegação centralizada.
 */
export const routes = {
  splash: "/",
  signIn: "/auth",
  signUp: "/auth/cadastro",
  forgotPassword: "/auth/recuperar-senha",
  resetPassword: "/redefinir-senha",
  dashboard: "/dashboard",
  accounts: "/contas",
  transactions: "/transactions",
  settings: "/configuracoes",
} as const;
