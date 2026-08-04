import type { LucideIcon } from "lucide-react";
import { Laptop, Smartphone, Tablet } from "lucide-react";

/** Dados apenas de apresentação para a área de configurações (sem persistência). */

export const languageOptions = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
] as const;

export const currencyOptions = [
  { value: "BRL", label: "Real (R$ 1.234,56)" },
  { value: "USD", label: "Dólar ($ 1,234.56)" },
  { value: "EUR", label: "Euro (€ 1.234,56)" },
] as const;

export const notificationOptions = [
  {
    id: "bills",
    title: "Vencimentos próximos",
    description: "Avise-me 3 dias antes de cada conta vencer.",
    defaultChecked: true,
  },
  {
    id: "goals",
    title: "Progresso de metas",
    description: "Resumo semanal do avanço das suas metas.",
    defaultChecked: true,
  },
  {
    id: "reports",
    title: "Relatório mensal",
    description: "Receba o fechamento do mês por e-mail.",
    defaultChecked: false,
  },
  {
    id: "marketing",
    title: "Novidades do app",
    description: "Recursos, melhorias e dicas financeiras.",
    defaultChecked: false,
  },
] as const;

export const accentOptions = [
  { id: "emerald", label: "Esmeralda", swatch: "oklch(0.62 0.14 158)" },
  { id: "petrol", label: "Petróleo", swatch: "oklch(0.42 0.06 215)" },
  { id: "royal", label: "Azul royal", swatch: "oklch(0.55 0.15 258)" },
  { id: "violet", label: "Violeta", swatch: "oklch(0.55 0.17 300)" },
  { id: "amber", label: "Âmbar", swatch: "oklch(0.75 0.14 75)" },
  { id: "coral", label: "Coral", swatch: "oklch(0.63 0.18 25)" },
] as const;

export type ActiveSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: LucideIcon;
};

export const activeSessions: ActiveSession[] = [
  {
    id: "s1",
    device: "Chrome · macOS",
    location: "São Paulo, BR",
    lastActive: "Ativo agora",
    current: true,
    icon: Laptop,
  },
  {
    id: "s2",
    device: "App iOS · iPhone 15",
    location: "São Paulo, BR",
    lastActive: "Há 2 horas",
    current: false,
    icon: Smartphone,
  },
  {
    id: "s3",
    device: "Safari · iPad",
    location: "Campinas, BR",
    lastActive: "Ontem, 21:40",
    current: false,
    icon: Tablet,
  },
];

export const appInfo = {
  version: "1.0.0",
  build: "2026.08.01",
} as const;
