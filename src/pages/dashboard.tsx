import { useState, useCallback } from "react";
import { Send, Copy, Download, Star, Loader2, History, Settings } from "lucide-react";
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

const Dashboard = () => {
  const [form, setForm] = useState({
    subject: "",
    targetAudience: "Professionnels",
    tone: "professionnel" as Tone,
    length: "moyenne" as Length,
    platform: "linkedin" as Platform,
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CFT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ContentFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <History className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Générateur de Contenu IA
          </h1>
          <p className="text-gray-600">
            Créez du contenu captivant en quelques clics
          </p>
        </div>

        {/* Formulaire principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sujet principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quel contenu voulez-vous créer ?
              </label>
              <textarea
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Ex: Les tendances marketing 2024, Comment améliorer sa productivité..."
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg"
                rows={3}
                required
              />
            </div>

            {/* Options en ligne */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Public cible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public cible
                </label>
                <select
                  value={form.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  Ton
                </label>
                <select
                  value={form.tone}
                  onChange={(e) => handleChange("tone", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  Longueur
                </label>
                <select
                  value={form.length}
                  onChange={(e) => handleChange("length", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="courte">📝 Courte</option>
                  <option value="moyenne">📄 Moyenne</option>
                  <option value="longue">📚 Longue</option>
                </select>
              </div>

              {/* Plateforme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plateforme
                </label>
                <select
                  value={form.platform}
                  onChange={(e) => handleChange("platform", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-lg"
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
          </form>
        </div>

        {/* Résultat généré */}
        {generatedContent && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{generatedContent.title}</h3>
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
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                {generatedContent.content}
              </p>
            </div>
            
            <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {generatedContent.platform}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {generatedContent.tone}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {generatedContent.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
