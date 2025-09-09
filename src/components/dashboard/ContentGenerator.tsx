import { useState, useCallback } from "react";
import { Send, Copy, Download, Star, Loader2 } from "lucide-react";
import { appConfig } from "@/config/app";

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

const ContentGenerator = () => {
  const [form, setForm] = useState({
    subject: "",
    targetAudience: "Professionnels",
    tone: "professionnel" as Tone,
    length: "moyenne" as Length,
    platform: "linkedin" as Platform,
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `Voici un exemple de contenu généré pour "${form.subject}" sur ${form.platform} avec un ton ${form.tone} et une longueur ${form.length}.

Ce contenu a été créé spécialement pour votre public cible : ${form.targetAudience}.

🎯 Points clés à retenir :
• Adaptation parfaite à votre plateforme
• Ton ${form.tone} pour engager votre audience
• Longueur optimisée pour ${form.length}

N'hésitez pas à personnaliser ce contenu selon vos besoins spécifiques !`;

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        title: form.subject,
        content: mockContent,
        platform: form.platform,
        tone: form.tone,
        length: form.length,
        createdAt: new Date(),
        isFavorite: false,
      };

      setGeneratedContent(newContent);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const copyToClipboard = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  }, [generatedContent]);

  const downloadContent = useCallback(() => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [generatedContent]);

  const toggleFavorite = useCallback(() => {
    if (generatedContent) {
      setGeneratedContent(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  }, [generatedContent]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Send className="w-5 h-5 mr-2 text-purple-600" />
          Générateur de Contenu
        </h2>
        <p className="text-sm text-gray-600 mt-1">Créez du contenu personnalisé en quelques clics</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sujet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet de votre publication *
            </label>
            <textarea
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Ex: Les tendances marketing 2024, Comment améliorer sa productivité..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          {/* Options en grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public cible
              </label>
              <select
                value={form.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ton de la publication
              </label>
              <select
                value={form.tone}
                onChange={(e) => handleChange("tone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longueur du contenu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["courte", "moyenne", "longue"] as Length[]).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => handleChange("length", len)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plateforme
              </label>
              <select
                value={form.platform}
                onChange={(e) => handleChange("platform", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {appConfig.platforms.map((p) => (
                  <option key={p.value} value={p.value.toLowerCase()}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton de génération */}
          <button
            type="submit"
            disabled={isLoading || !form.subject.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Générer le contenu
              </>
            )}
          </button>
        </form>

        {/* Résultat généré */}
        {generatedContent && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{generatedContent.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    generatedContent.isFavorite
                      ? "text-yellow-500 bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                >
                  <Star className={`w-5 h-5 ${generatedContent.isFavorite ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadContent}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {generatedContent.content}
              </p>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full mr-2">
                {generatedContent.platform}
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-2">
                {generatedContent.tone}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {generatedContent.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
