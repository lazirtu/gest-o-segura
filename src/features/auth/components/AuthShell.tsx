import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, TrendingUp, Target } from "lucide-react";

import { appConfig, routes } from "@/config/app";

const highlights = [
  { icon: TrendingUp, text: "Acompanhe receitas e despesas em tempo real" },
  { icon: Target, text: "Defina metas e veja o progresso mês a mês" },
  { icon: ShieldCheck, text: "Seus dados protegidos de ponta a ponta" },
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
      <div className="bg-gradient-brand relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <Link to={routes.splash} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15 text-sm font-bold backdrop-blur">
            GS
          </span>
          <span className="text-base font-semibold tracking-tight">{appConfig.name}</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl leading-tight font-semibold">
            Clareza financeira, do saldo à meta.
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/75">
            {appConfig.description}
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-foreground/12">
                  <item.icon className="size-4" />
                </span>
                <span className="text-primary-foreground/85">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {appConfig.name}
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="animate-fade-in w-full max-w-md">
          <Link
            to={routes.splash}
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <span className="bg-gradient-brand grid size-10 place-items-center rounded-xl text-sm font-bold text-primary-foreground">
              GS
            </span>
            <span className="text-lg font-semibold tracking-tight">{appConfig.name}</span>
          </Link>

          <div className="surface-card p-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            <div className="mt-7">{children}</div>
          </div>

          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
