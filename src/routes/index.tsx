import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { appConfig, routes } from "@/config/app";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gestão Financeira — Suas finanças organizadas" },
      { name: "description", content: appConfig.description },
      { property: "og:title", content: "Gestão Financeira" },
      { property: "og:description", content: appConfig.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      navigate({
        to: data.session ? routes.dashboard : routes.signIn,
        replace: true,
      });
    });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="flex flex-col items-center gap-3">
        <span className="bg-gradient-brand flex size-16 items-center justify-center rounded-2xl text-xl font-bold text-primary-foreground">
          GF
        </span>
        <span className="text-lg font-semibold tracking-tight">{appConfig.name}</span>
      </div>
      <span className="size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
