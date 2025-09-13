import React, { useState } from "react";
import PublicLayout from "@/layout/public/PublicLayout";
import { Loader2, ArrowLeft } from "lucide-react";
import Logo from "@/components/common/Logo";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Envoi d'email de réinitialisation pour:", email);
    setIsEmailSent(true);
    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <PublicLayout title="Email envoyé">
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header avec logo */}
          <div className="flex justify-start p-6">
            <Logo size={120} />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
              {/* Titre principal */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Vérifiez votre boîte mail
                </h1>
                <p className="text-gray-600 text-lg">
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="text-gray-700 mb-4">
                  Si vous ne recevez pas l&apos;email dans les prochaines minutes :
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Vérifiez votre dossier spam</li>
                  <li>• Assurez-vous que l&apos;adresse email est correcte</li>
                  <li>• Contactez le support si le problème persiste</li>
                </ul>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-4">
                <button
                  onClick={() => setIsEmailSent(false)}
                  className="w-full bg-slate-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200 text-lg"
                >
                  Réessayer avec une autre adresse
                </button>
                
                <Link
                  href="/login"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-4 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title="Mot de passe oublié">
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header avec logo */}
        <div className="flex justify-start p-6">
          <Logo size={120} />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            {/* Titre principal */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Mot de passe oublié ?
              </h1>
              <p className="text-gray-600 text-lg">
                Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse e-mail"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Bouton Envoyer */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-slate-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </button>
            </form>

            {/* Lien retour */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-500 font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;