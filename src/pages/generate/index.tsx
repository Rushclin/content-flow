import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Copy,
  Loader2,
  Download,
  Sparkles,
  Zap,
  Target,
  Palette,
  Globe,
  Settings,
  X,
} from "lucide-react";
import { appConfig } from "@/config/app";
import DashboardLayout from "@/layout/dashboard";

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
  const [showSettings, setShowSettings] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    metadata?: {
      platform: string;
      tone: string;
      length: string;
    };
  }>>([]);

  // Charger l'historique depuis localStorage au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cf_conversation_history");
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{
          type: 'user' | 'ai';
          content: string;
          timestamp: string;
          metadata?: { platform: string; tone: string; length: string };
        }>;
        const withDates = parsed.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setConversationHistory(withDates);
      }
    } catch (err) {
      console.error("Impossible de charger l'historique", err);
    }
  }, []);

  // Persister l'historique à chaque modification
  useEffect(() => {
    try {
      const serializable = conversationHistory.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      }));
      localStorage.setItem("cf_conversation_history", JSON.stringify(serializable));
    } catch (err) {
      console.error("Impossible d'enregistrer l'historique", err);
    }
  }, [conversationHistory]);

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

        // Ajouter à l'historique de conversation
        const userMessage = {
          type: 'user' as const,
          content: form.subject,
          timestamp: new Date(),
          metadata: { platform: form.platform, tone: form.tone, length: form.length }
        };

        const aiMessage = {
          type: 'ai' as const,
          content: output,
          timestamp: new Date(),
          metadata: { platform: form.platform, tone: form.tone, length: form.length }
        };

        setConversationHistory(prev => [...prev, userMessage, aiMessage]);
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


  return (
    <DashboardLayout title="Générateur de Contenu">
      <div className="flex-1 overflow-hidden bg-white relative h-full">
        {/* Zone de conversation - Scrollable avec padding bottom pour éviter le chevauchement */}
        <div className="overflow-y-auto h-full px-6 py-6 pb-80">
            <div className="max-w-4xl mx-auto">
              {/* Historique de conversation */}
              {conversationHistory.length > 0 ? (
                <div className="space-y-6">
                  {conversationHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-3xl">
                        {message.type === 'user' ? (
                          // Bulle utilisateur
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md px-6 py-4 shadow-lg">
                            <p className="text-lg font-medium">{message.content}</p>
                            {message.metadata && (
                              <div className="mt-2 text-sm opacity-90">
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs mr-2">
                                  {message.metadata.platform}
                      </span>
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs mr-2">
                                  {message.metadata.tone}
                      </span>
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                  {message.metadata.length}
                      </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Bulle IA
                          <div className="flex items-start space-x-3">
                            {/* Avatar IA */}
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Sparkles className="w-4 h-4 text-white" />
                    </div>

                    {/* Contenu */}
                            <div className="flex-1">
                              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
                                <div className="prose max-w-none">
                                  <p className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
                                    {message.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                              <div className="flex items-center space-x-4 mt-3 ml-11">
                        <button
                                  onClick={() => navigator.clipboard.writeText(message.content)}
                                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copier</span>
                        </button>
                                <button
                                  onClick={() => {
                                    const blob = new Blob([message.content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `contenu_${index}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Télécharger</span>
                        </button>
                      </div>
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className={`mt-2 text-sm text-gray-500 ${message.type === 'user' ? 'text-right' : 'text-left ml-11'}`}>
                          {message.type === 'user' ? 'Vous' : 'Content Flow'} • {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  ))}

                  {/* Indicateur de génération en cours */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-3xl">
                        <div className="flex items-start space-x-3">
                          {/* Avatar IA */}
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                    </div>

                          {/* Indicateur de frappe */}
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                              <span className="text-gray-500 text-sm">Content Flow génère votre contenu...</span>
              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // État vide - Premier message
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Content Flow
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Décrivez le contenu que vous souhaitez créer et notre IA le générera pour vous.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Zone de saisie */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-yellow-200 shadow-lg z-50">
            <div className="max-w-4xl mx-auto p-6">
              {/* Panneau des paramètres */}
              {showSettings && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Paramètres de génération</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Public cible */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Public cible
                      </label>
                      <select
                        value={form.targetAudience}
                        onChange={(e) => handleChange("targetAudience", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        {appConfig.targetPeoples.map((people) => (
                          <option key={people.value} value={people.value}>
                            {people.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ton */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ton de la publication
                      </label>
                      <select
                        value={form.tone}
                        onChange={(e) => handleChange("tone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        {appConfig.pupblicationTonalities.map((tonality) => (
                          <option key={tonality.value} value={tonality.value}>
                            {tonality.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Longueur */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Longueur du contenu
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(["courte", "moyenne", "longue"] as Length[]).map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => handleChange("length", len)}
                            className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                              form.length === len
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {len === "courte" ? "📝" : len === "moyenne" ? "📄" : "📚"} {len}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Plateforme */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Plateforme
                      </label>
                      <select
                        value={form.platform}
                        onChange={(e) => handleChange("platform", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        {appConfig.platforms.map((p) => (
                          <option key={p.value} value={p.value.toLowerCase()}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Champ de saisie principal */}
              <div className="relative">
                <textarea
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Décrivez le contenu que vous souhaitez créer..."
                  className="w-full px-6 py-4 text-lg border border-yellow-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200 shadow-sm bg-white pr-20"
                  rows={1}
                  required
                />

                {/* Bouton paramètres */}
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className="absolute bottom-5 right-13 w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || !form.subject.trim()}
                  className="absolute bottom-5 right-5 w-8 h-8 bg-blue-400 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Footer disclaimer */}
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500">
                  Content Flow peut faire des erreurs. Envisagez de vérifier les informations importantes.
                </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
