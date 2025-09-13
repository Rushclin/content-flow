import React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import AuthLayout from "@/layout/auth";
import Divider from "@/components/common/Divider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/InputForm";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Simulation d'un délai
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Tentative d'inscription avec:", data);
  };

  return (
    <AuthLayout title="Inscription">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo size={200} justLogo />
        </div>
        <h1 className="text-3xl font-light text-gray-900 mb-2 montserat py-4">
          Plateforme IA tout-en-un
        </h1>
      </div>

      <div className="space-y-3 mb-8">
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-sm shadow-sm">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          S&apos;inscrire avec Google
        </button>

        <button className="w-full bg-[#1877F2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#166FE5] transition-colors flex items-center justify-center text-sm shadow-sm">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          S&apos;inscrire avec Facebook
        </button>
      </div>

      <Divider title="ou avec votre email" className="mb-8" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("name")}
          label="Nom complet"
          type="text"
          placeholder="Votre nom complet"
          required
          error={errors.name?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
        />

        <Input
          {...register("email")}
          label="Adresse email"
          type="email"
          placeholder="votre@email.com"
          required
          error={errors.email?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
        />

        <Input
          {...register("password")}
          label="Mot de passe"
          type="password"
          placeholder="Minimum 8 caractères"
          required
          error={errors.password?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
          // smallText="Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre"
        />

        <Input
          {...register("confirmPassword")}
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Répétez votre mot de passe"
          required
          error={errors.confirmPassword?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
        />

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full mt-5 bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
