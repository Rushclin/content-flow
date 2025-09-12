import { useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Send,
  Copy,
  Download,
  Star,
  Loader2,
  History,
  Settings,
  TrendingUp,
  Clock,
  FileText,
  Zap,
  Users,
  HelpCircle,
  Home,
  ArrowLeft,
} from "lucide-react";
import { appConfig } from "@/config/app";
import DashboardLayout from "@/layout/admin/DashboardLayout";

type Platform = "wordpress" | "twitter" | "facebook" | "linkedin" | "reddit";
type Tone = "professionnel" | "amical" | "formel" | "décontracté";
type Length = "courte" | "moyenne" | "longue";

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  tone: Tone;
  length: Length;
  createdAt: Date;
  isFavorite: boolean;
}

const Dashboard = () => {
  const [form, setForm] = useState({
    subject: "",
    targetAudience: "Professionnels",
    tone: "professionnel" as Tone,
    length: "moyenne" as Length,
    platform: "linkedin" as Platform,
  });

  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://automation.novalitix.com/webhook/generate-content",
          {
            theme: form.subject,
            details: `Public cible: ${form.targetAudience}, Ton: ${form.tone}, Longueur: ${form.length}`,
            platform: form.platform,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { output } = response.data;

        const newContent: GeneratedContent = {
          id: Date.now().toString(),
          title: form.subject,
          content: output,
          platform: form.platform,
          tone: form.tone,
          length: form.length,
          createdAt: new Date(),
          isFavorite: false,
        };

        setGeneratedContent(newContent);
      } catch (error) {
        console.error("Erreur lors de la génération:", error);
        // En cas d'erreur, afficher un message d'erreur
        alert("Erreur lors de la génération du contenu. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  const copyToClipboard = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  }, [generatedContent]);

  return (
    <DashboardLayout activeTab="dashboard" setActiveTab={() => {}}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CFT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ContentFlow
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </Link>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg">
              <Send className="w-5 h-5" />
              <span>Générateur</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <History className="w-5 h-5" />
              <span>Historique</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <Star className="w-5 h-5" />
              <span>Favoris</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" />
              <span>Templates</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <Zap className="w-5 h-5" />
              <span>IA Avancée</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Équipe</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </button>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Utilisateur Demo
                </p>
                <p className="text-xs text-gray-500">Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* Header simple */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">
                Générateur de Contenu
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <History className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto min-h-[calc(100vh-200px)] flex flex-col">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Générateur de Contenu IA
                </h1>
                <p className="text-gray-600">
                  Créez du contenu captivant en quelques clics
                </p>
              </div>

              {/* Layout en deux colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Colonne gauche - Formulaire */}
                <div className="flex flex-col">
                  {/* Formulaire principal */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1 flex flex-col">
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-8 flex-1 flex flex-col"
                    >
                      {/* Sujet principal */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          Quel contenu voulez-vous créer ?
                        </label>
                        <textarea
                          value={form.subject}
                          onChange={(e) =>
                            handleChange("subject", e.target.value)
                          }
                          placeholder="Ex: Les tendances marketing 2024, Comment améliorer sa productivité..."
                          className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-lg placeholder-gray-400 transition-all duration-200"
                          rows={5}
                          required
                        />
                      </div>

                      {/* Options de configuration */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                          Configuration
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Public cible */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Public cible
                            </label>
                            <select
                              value={form.targetAudience}
                              onChange={(e) =>
                                handleChange("targetAudience", e.target.value)
                              }
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-200 bg-white"
                            >
                              {appConfig.targetPeoples.map((people) => (
                                <option key={people.value} value={people.value}>
                                  {people.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Ton */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Ton
                            </label>
                            <select
                              value={form.tone}
                              onChange={(e) =>
                                handleChange("tone", e.target.value)
                              }
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-200 bg-white"
                            >
                              {appConfig.pupblicationTonalities.map(
                                (tonality) => (
                                  <option
                                    key={tonality.value}
                                    value={tonality.value}
                                  >
                                    {tonality.label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          {/* Longueur */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Longueur
                            </label>
                            <select
                              value={form.length}
                              onChange={(e) =>
                                handleChange("length", e.target.value)
                              }
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-200 bg-white"
                            >
                              <option value="courte">📝 Courte</option>
                              <option value="moyenne">📄 Moyenne</option>
                              <option value="longue">📚 Longue</option>
                            </select>
                          </div>

                          {/* Plateforme */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Plateforme
                            </label>
                            <select
                              value={form.platform}
                              onChange={(e) =>
                                handleChange("platform", e.target.value)
                              }
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-200 bg-white"
                            >
                              {appConfig.platforms.map((p) => (
                                <option
                                  key={p.value}
                                  value={p.value.toLowerCase()}
                                >
                                  {p.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Bouton de génération */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isLoading || !form.subject.trim()}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 px-8 rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                              Génération en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-6 h-6 mr-3" />
                              Générer le contenu
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Colonne droite - Prévisualisation */}
                <div className="flex flex-col">
                  {/* Section de prévisualisation */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Prévisualisation
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">En direct</span>
                      </div>
                    </div>

                    {generatedContent ? (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {/* Métadonnées */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {generatedContent.platform}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {generatedContent.tone}
                          </span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            {generatedContent.length}
                          </span>
                        </div>

                        {/* Contenu */}
                        <div className="prose max-w-none flex-1">
                          <div className="bg-gray-50 rounded-lg p-4 border h-full">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                              {generatedContent.content}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={copyToClipboard}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              <span>Copier</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                              <Star className="w-4 h-4" />
                              <span>Favoris</span>
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            {generatedContent.createdAt.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun contenu généré
                        </h4>
                        <p className="text-gray-500">
                          Remplissez le formulaire et générez du contenu pour le
                          voir ici
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
