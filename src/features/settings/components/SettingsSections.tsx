import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronRight,
  Coins,
  Globe,
  HelpCircle,
  Info,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  Palette,
  Pencil,
  Rows3,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app";
import {
  accentOptions,
  activeSessions,
  appInfo,
  currencyOptions,
  languageOptions,
  notificationOptions,
} from "@/features/settings/data";

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="surface-card animate-rise p-5 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="flex items-start gap-3">
        <span className="bg-accent text-accent-foreground grid size-10 shrink-0 place-items-center rounded-2xl">
          <Icon className="size-[1.05rem]" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight sm:text-lg">{title}</h2>
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed sm:text-sm">
            {description}
          </p>
        </div>
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        {description ? (
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* --------------------------------- Perfil -------------------------------- */

export function ProfileSection() {
  return (
    <section className="bg-gradient-brand text-primary-foreground animate-rise relative overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-lift)] sm:p-7">
      <div
        aria-hidden
        className="bg-primary-foreground/10 absolute -top-20 -right-14 size-52 rounded-full blur-2xl"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="ring-primary-foreground/25 size-16 shrink-0 ring-2 sm:size-20">
            <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-lg font-bold backdrop-blur">
              GS
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                Usuário Gestão Segura
              </h2>
              <BadgeCheck className="text-primary-foreground/80 size-4 shrink-0" />
            </div>
            <p className="text-primary-foreground/75 mt-1 flex items-center gap-1.5 truncate text-sm">
              <Mail className="size-3.5 shrink-0" />
              usuario@gestaosegura.app
            </p>
            <p className="text-primary-foreground/60 mt-1 flex items-center gap-1.5 text-xs">
              <CalendarDays className="size-3.5 shrink-0" />
              Conta criada em 12 de março de 2026
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="focus-ring text-secondary-foreground h-11 shrink-0 rounded-2xl font-semibold"
            >
              <Pencil className="size-4" />
              Editar perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
              <DialogDescription>
                Atualize suas informações pessoais. (Pré-visualização)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Nome completo</Label>
                <Input
                  id="settings-name"
                  defaultValue="Usuário Gestão Segura"
                  className="h-11 rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">E-mail</Label>
                <Input
                  id="settings-email"
                  type="email"
                  defaultValue="usuario@gestaosegura.app"
                  className="h-11 rounded-2xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="h-11 w-full rounded-2xl font-semibold">
                Salvar alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

/* ------------------------------ Preferências ------------------------------ */

export function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SectionCard
      icon={Sparkles}
      title="Preferências do aplicativo"
      description="Ajuste idioma, moeda, tema e como você quer ser avisado."
      delay={60}
    >
      <div className="divide-border divide-y">
        <Row title="Tema" description="Alterne entre o modo claro e escuro.">
          <div className="flex items-center gap-2.5">
            <Sun className="text-muted-foreground size-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              aria-label="Alternar tema"
            />
            <Moon className="text-muted-foreground size-4" />
          </div>
        </Row>

        <Row title="Idioma" description="Idioma da interface do aplicativo.">
          <Select defaultValue="pt-BR">
            <SelectTrigger className="focus-ring h-10 w-[13rem] rounded-2xl">
              <Globe className="text-muted-foreground size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row title="Formato de moeda" description="Como os valores serão exibidos.">
          <Select defaultValue="BRL">
            <SelectTrigger className="focus-ring h-10 w-[13rem] rounded-2xl">
              <Coins className="text-muted-foreground size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
      </div>

      <div className="border-border mt-5 rounded-2xl border p-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="size-4" />
          Notificações
        </p>
        <div className="divide-border mt-1 divide-y">
          {notificationOptions.map((option) => (
            <Row key={option.id} title={option.title} description={option.description}>
              <Switch defaultChecked={option.defaultChecked} aria-label={option.title} />
            </Row>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------- Segurança ------------------------------- */

export function SecuritySection() {
  return (
    <SectionCard
      icon={ShieldCheck}
      title="Segurança"
      description="Gerencie sua senha e os dispositivos conectados à sua conta."
      delay={120}
    >
      <div className="divide-border divide-y">
        <Row
          title="Alterar senha"
          description="Recomendamos trocar sua senha a cada 6 meses."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="focus-ring h-10 rounded-2xl font-semibold"
              >
                <KeyRound className="size-4" />
                Alterar
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Alterar senha</DialogTitle>
                <DialogDescription>
                  Use ao menos 8 caracteres. (Pré-visualização)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button className="h-11 w-full rounded-2xl font-semibold">
                  Atualizar senha
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
          Sessões ativas
        </p>
        {activeSessions.map((session) => (
          <div
            key={session.id}
            className="border-border hover:bg-accent/40 flex items-center justify-between gap-3 rounded-2xl border p-4 transition-colors"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-muted text-muted-foreground grid size-10 shrink-0 place-items-center rounded-2xl">
                <session.icon className="size-[1.05rem]" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate text-sm font-semibold">
                  {session.device}
                  {session.current ? (
                    <Badge className="bg-success/15 text-success hover:bg-success/15 border-0 text-[0.65rem] font-semibold">
                      Este dispositivo
                    </Badge>
                  ) : null}
                </p>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  {session.location} · {session.lastActive}
                </p>
              </div>
            </div>
            {!session.current ? (
              <Button
                variant="ghost"
                className="focus-ring text-muted-foreground hover:text-destructive h-9 shrink-0 rounded-xl text-xs font-semibold"
              >
                Encerrar
              </Button>
            ) : null}
          </div>
        ))}

        <Separator className="my-4" />

        <div className="border-destructive/25 bg-destructive/5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Sair de todos os dispositivos</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              Encerra todas as sessões, inclusive a atual.
            </p>
          </div>
          <Button
            variant="destructive"
            className="focus-ring h-10 shrink-0 rounded-2xl font-semibold"
          >
            <LogOut className="size-4" />
            Sair de tudo
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

/* ----------------------------- Personalização ----------------------------- */

export function PersonalizationSection() {
  const [accent, setAccent] = useState<string>(accentOptions[0].id);
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");

  return (
    <SectionCard
      icon={Palette}
      title="Personalização"
      description="Escolha a cor de destaque e a densidade de visualização."
      delay={180}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold">Cor de destaque</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {accentOptions.map((option) => {
              const active = accent === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAccent(option.id)}
                  aria-pressed={active}
                  aria-label={option.label}
                  className={cn(
                    "focus-ring grid size-11 place-items-center rounded-2xl transition-all duration-200",
                    active
                      ? "ring-ring scale-105 ring-2 ring-offset-2 ring-offset-[var(--color-card)]"
                      : "hover:scale-105 hover:opacity-90",
                  )}
                  style={{ backgroundColor: option.swatch }}
                >
                  {active ? (
                    <BadgeCheck className="size-4 text-white/90" strokeWidth={2.6} />
                  ) : null}
                </button>
              );
            })}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Selecionado: {accentOptions.find((o) => o.id === accent)?.label}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Preferência de visualização</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  id: "compact" as const,
                  title: "Compacto",
                  description: "Mais informação por tela, espaçamento reduzido.",
                },
                {
                  id: "comfortable" as const,
                  title: "Confortável",
                  description: "Respiro maior entre elementos e leitura fluida.",
                },
              ]
            ).map((option) => {
              const active = density === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDensity(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "focus-ring rounded-2xl border p-4 text-left transition-all duration-200",
                    active
                      ? "border-ring bg-accent/50 shadow-[var(--shadow-soft)]"
                      : "border-border hover:bg-accent/30",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Rows3 className="size-4" />
                    {option.title}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------ Sobre o app ------------------------------- */

const appLinks = [
  { title: "Termos de uso", icon: ScrollText },
  { title: "Política de privacidade", icon: ShieldCheck },
  { title: "Central de ajuda", icon: HelpCircle },
];

export function AppInfoSection() {
  return (
    <SectionCard
      icon={Info}
      title="Informações do aplicativo"
      description="Versão, documentos legais e suporte."
      delay={240}
    >
      <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-2xl p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{appConfig.name}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Versão {appInfo.version} · build {appInfo.build}
          </p>
        </div>
        <Badge className="bg-success/15 text-success hover:bg-success/15 shrink-0 border-0 font-semibold">
          Atualizado
        </Badge>
      </div>

      <div className="divide-border mt-2 divide-y">
        {appLinks.map((link) => (
          <button
            key={link.title}
            type="button"
            className="focus-ring hover:bg-accent/40 -mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-2xl px-2 py-3.5 text-left transition-colors"
          >
            <span className="flex items-center gap-3 text-sm font-medium">
              <link.icon className="text-muted-foreground size-4" />
              {link.title}
            </span>
            <ChevronRight className="text-muted-foreground size-4" />
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        © {new Date().getFullYear()} {appConfig.name}. Todos os direitos reservados.
      </p>
    </SectionCard>
  );
}
