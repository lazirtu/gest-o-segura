import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail")
  .email("E-mail inválido")
  .max(255, "E-mail muito longo");

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha"),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo")
      .max(120, "Nome muito longo"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
