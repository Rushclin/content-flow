import React, { useState } from "react";
import InputForm from "@/components/common/InputForm";
import PublicLayout from "@/layout/public/PublicLayout";
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/Logo";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Tentative d'inscription avec:", form);
    setIsLoading(false);
  };

  return (
    <PublicLayout title="Inscription">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo et en-tête */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size={120} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Rejoignez-nous !
            </h1>
            <p className="text-gray-600 text-lg">
              Créez votre compte Content Flow
            </p>
          </div>

          {/* Carte du formulaire */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom avec icône */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputForm
                    type="text"
                    value={form.name}
                    onChange={(val) => handleChange("name", val)}
                    placeholder="Votre nom complet"
                    required
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Email avec icône */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputForm
                    type="email"
                    value={form.email}
                    onChange={(val) => handleChange("email", val)}
                    placeholder="votre@email.com"
                    required
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Mot de passe avec icône */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputForm
                    type="password"
                    value={form.password}
                    onChange={(val) => handleChange("password", val)}
                    placeholder="Minimum 6 caractères"
                    required
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Confirmation mot de passe avec icône */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputForm
                    type="password"
                    value={form.confirmPassword}
                    onChange={(val) => handleChange("confirmPassword", val)}
                    placeholder="Répétez votre mot de passe"
                    required
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading || !form.name || !form.email || !form.password || !form.confirmPassword}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>
            </div>

            {/* Lien de connexion */}
            <div className="text-center">
              <p className="text-gray-600">
                Déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;