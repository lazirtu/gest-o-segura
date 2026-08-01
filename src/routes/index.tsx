import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { appConfig } from "@/config/app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gestão Financeira — Base do aplicativo" },
      { name: "description", content: appConfig.description },
      { property: "og:title", content: "Gestão Financeira" },
      { property: "og:description", content: appConfig.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const foundations = [
  {
    title: "Estrutura modular",
    body: "Pastas separadas por responsabilidade: rotas, componentes, features, configuração, tipos e utilitários.",
  },
  {
    title: "Pronto para banco de dados",
    body: "Camada de dados isolada para receber tabelas, políticas de acesso e consultas tipadas.",
  },
  {
    title: "Pronto para autenticação",
    body: "Rotas públicas e privadas previstas, com espaço para sessão de usuário e proteção de rotas.",
  },
];

function Index() {
  return (
    <AppLayout>
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Estrutura inicial
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          <span className="text-gradient-brand">Gestão Financeira</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{appConfig.description}</p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {foundations.map((item) => (
            <article key={item.title} className="surface-card p-6">
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
