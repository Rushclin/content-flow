import React, { useState } from "react";
import InputForm from "@/components/common/InputForm";
import PublicLayout from "@/layout/public/PublicLayout";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    
    console.log("Tentative de connexion avec:", form);
    setIsLoading(false);
  };

  return (
    <PublicLayout title="Connexion">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo et en-tête */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size={120} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bon retour !
            </h1>
            <p className="text-gray-600 text-lg">
              Connectez-vous à votre compte Content Flow
            </p>
          </div>

          {/* Carte du formulaire */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
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
                    placeholder="Votre mot de passe"
                    required
                    inputClassName="pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Lien mot de passe oublié */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading || !form.email || !form.password}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
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

            {/* Lien d'inscription */}
            <div className="text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;