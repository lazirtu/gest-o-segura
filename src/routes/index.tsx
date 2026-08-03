import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { appConfig, routes } from "@/config/app";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gestão Segura — Suas finanças organizadas" },
      { name: "description", content: appConfig.description },
      { property: "og:title", content: "Gestão Segura" },
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
    <div className="bg-gradient-brand flex min-h-screen flex-col items-center justify-center gap-8 text-primary-foreground">
      <div className="animate-fade-in flex flex-col items-center gap-4">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary-foreground/15 text-xl font-bold backdrop-blur">
          GF
        </span>
        <span className="text-lg font-semibold tracking-tight">{appConfig.name}</span>
      </div>
      <span className="size-5 animate-spin rounded-full border-2 border-primary-foreground/25 border-t-primary-foreground" />
    </div>
  );
}
