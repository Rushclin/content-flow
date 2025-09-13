import React, { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import AuthLayout from "@/layout/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/InputForm";

// Schéma de validation avec zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Format d'email invalide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulation d'un délai
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Envoi d'email de réinitialisation pour:", data.email);
    setSubmittedEmail(data.email);
    setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <AuthLayout title="Email envoyé">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vérifiez votre boîte mail
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Nous avons envoyé un lien de réinitialisation à{" "}
            <strong>{submittedEmail}</strong>
          </p>

          <div className=" p-6 rounded-lg mb-8 text-left">
            <p className="text-gray-700 mb-4 font-medium">
              Si vous ne recevez pas l'email dans les prochaines minutes :
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Vérifiez votre dossier spam</li>
              <li>• Assurez-vous que l'adresse email est correcte</li>
              <li>• Contactez le support si le problème persiste</li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200"
            >
              Réessayer avec une autre adresse
            </button>

            <Link
              href="/auth/login"
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Mot de passe oublié">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo size={150} justLogo />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Mot de passe oublié ?
        </h1>
        <p className="text-gray-600">
          Pas de problème ! Entrez votre adresse email et nous vous enverrons un
          lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register("email")}
          label="Adresse email"
          type="email"
          placeholder="votre@email.com"
          required
          error={errors.email?.message}
          inputClassName="pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <Link
          href="/auth/login"
          className="text-slate-600 hover:text-slate-500 font-medium flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la connexion
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
