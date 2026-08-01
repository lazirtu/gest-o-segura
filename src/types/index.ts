/** Tipos base compartilhados. Amplie conforme os módulos financeiros forem criados. */

export type UUID = string;

export interface AuthUser {
  id: UUID;
  email: string | null;
}

export interface Profile {
  id: UUID;
  displayName: string | null;
  avatarUrl: string | null;
}
