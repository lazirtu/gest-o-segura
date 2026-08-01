import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { appConfig, routes } from "@/config/app";

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to={routes.splash} className="mb-8 flex items-center justify-center gap-2.5">
          <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground">
            GF
          </span>
          <span className="text-lg font-semibold tracking-tight">{appConfig.name}</span>
        </Link>

        <div className="surface-card p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
