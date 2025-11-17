import React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import AuthLayout from "@/layout/auth";
import Divider from "@/components/common/Divider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err: any) {
    }
  };

  return (
    <AuthLayout title={t("auth.login.title", "Se connecter")}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo size={200} justLogo />
        </div>
        <h1 className="text-3xl font-light text-gray-900 mb-2 montserat py-4">
          {t("auth.login.subtitle", "Plateforme IA tout-en-un")}
        </h1>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("email")}
          label={t("auth.login.emailLabel", "Adresse email")}
          type="email"
          placeholder="votre@email.com"
          required
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          className="mt-4"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          label={t("auth.login.passwordLabel", "Mot de passe")}
          type="password"
          placeholder="Votre mot de passe"
          required
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          error={errors.password?.message}
        />

        <div className="text-right">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            {t("auth.login.forgotPassword", "Mot de passe oublié ?")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              {t("auth.login.signInButton", "Se connecter")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <Divider className="my-10" title="ou alors" />

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          {t("auth.login.noAccount", "Pas encore de compte ?")}{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
          >
            {t("auth.login.createAccount", "Créer un compte")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
