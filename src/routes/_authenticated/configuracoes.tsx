import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  AppInfoSection,
  PersonalizationSection,
  PreferencesSection,
  ProfileSection,
  SecuritySection,
} from "@/features/settings/components/SettingsSections";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Gestão Segura" },
      {
        name: "description",
        content:
          "Perfil, preferências, segurança e personalização da sua conta no Gestão Segura.",
      },
      { property: "og:title", content: "Configurações — Gestão Segura" },
      {
        property: "og:description",
        content:
          "Perfil, preferências, segurança e personalização da sua conta no Gestão Segura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout title="Configurações" subtitle="Perfil, preferências e segurança">
      <div className="animate-fade-in mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        <ProfileSection />
        <PreferencesSection />
        <SecuritySection />
        <PersonalizationSection />
        <AppInfoSection />
      </div>
    </AppLayout>
  );
}
