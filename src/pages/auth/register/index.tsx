import React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import AuthLayout from "@/layout/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom est obligatoire")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    email: z
      .string()
      .min(1, "L'email est obligatoire")
      .email("Format d'email invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est obligatoire")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est obligatoire"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...credentials } = data;
      await registerUser(credentials);
    } catch (err: any) {
      // Les erreurs sont déjà gérées par le contexte via toast
    }
  };

  return (
    <AuthLayout title={t("auth.register.title", "Inscription")}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo size={200} justLogo />
        </div>
        <h1 className="text-3xl font-light text-gray-900 mb-2 montserat py-4">
          {t("auth.register.subtitle", "Plateforme IA tout-en-un")}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("name")}
          label={t("auth.register.fullNameLabel", "Nom complet")}
          type="text"
          placeholder="Votre nom complet"
          required
          error={errors.name?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
        />

        <Input
          {...register("email")}
          label={t("auth.register.emailLabel", "Adresse email")}
          type="email"
          placeholder="votre@email.com"
          required
          error={errors.email?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
        />

        <Input
          {...register("password")}
          label={t("auth.register.passwordLabel", "Mot de passe")}
          type="password"
          placeholder="Minimum 8 caractères"
          required
          error={errors.password?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
          // smallText="Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre"
        />

        <Input
          {...register("confirmPassword")}
          label={t("auth.register.confirmPasswordLabel", "Confirmer le mot de passe")}
          type="password"
          placeholder="Répétez votre mot de passe"
          required
          error={errors.confirmPassword?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
        />

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full mt-5 bg-primary/80 cursor-pointer text-white py-3 px-6 rounded-full font-semibold hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          ) : (
            <>
              {t("auth.register.createAccountButton", "Créer mon compte")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          {t("auth.register.haveAccount", "Déjà un compte ?")}{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold"
          >
            {t("auth.register.signInLink", "Se connecter")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
