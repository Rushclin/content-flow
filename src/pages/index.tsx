import { useState, useCallback, useMemo, useEffect } from "react";

type Platform = "wordpress" | "twitter" | "facebook" | "linkedin" | "reddit";
type Tone = "professionnel" | "amical" | "formel" | "décontracté";
type Length = "courte" | "moyenne" | "longue";
type Language = "fr" | "en" | "es";

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  tone: Tone;
  length: Length;
  language: Language;
  createdAt: Date;
  isFavorite: boolean;
  images?: string[];
  videos?: string[];
}

export default function Home() {
  const [subject, setSubject] = useState("");
  const [targetAudience, setTargetAudience] = useState("Professionnels");
  const [tone, setTone] = useState<Tone>("professionnel");
  const [length, setLength] = useState<Length>("moyenne");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [language, setLanguage] = useState<Language>("fr");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [searchHistory, setSearchHistory] = useState("");
  const [debouncedSearchHistory, setDebouncedSearchHistory] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchHistory(searchHistory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchHistory]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://automation.novalitix.com/webhook/generate-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theme: subject,
            details: `Public cible: ${targetAudience}, Ton: ${tone}, Longueur: ${length}`,
            platform,
          }),
        }
      );

      if (response.ok) {
        const { output } = await response.json();

        const newContent: GeneratedContent = {
          id: Date.now().toString(),
          title: subject,
          content: output,
          platform,
          tone,
          length,
          language,
          createdAt: new Date(),
          isFavorite: false,
        };

        setGeneratedContent(newContent);
        setHistory(prev => [newContent, ...prev]);
        setShowFullContent(false);
      } else {
        console.error("Erreur lors de la génération du contenu");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setIsLoading(false);
    }
  }, [subject, targetAudience, tone, length, platform, language]);

  const copyToClipboard = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  }, [generatedContent]);

  const downloadContent = () => {
    if (!generatedContent) return;

    // Créer un contenu HTML pour le PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${generatedContent.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              color: #8b5cf6;
              font-size: 2.5em;
              margin: 0;
            }
            .subtitle {
              color: #666;
              font-size: 1.1em;
              margin: 10px 0 0 0;
            }
            .content {
              font-size: 1.1em;
              white-space: pre-wrap;
              margin-bottom: 30px;
            }
            .metadata {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #8b5cf6;
              margin-top: 20px;
            }
            .metadata h3 {
              margin: 0 0 10px 0;
              color: #8b5cf6;
            }
            .metadata p {
              margin: 5px 0;
              color: #666;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #666;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${generatedContent.title}</h1>
            <p class="subtitle">Contenu généré le ${new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="content">${generatedContent.content}</div>
          
          <div class="metadata">
            <h3>Informations du contenu</h3>
            <p><strong>Plateforme:</strong> ${generatedContent.platform}</p>
            <p><strong>Ton:</strong> ${generatedContent.tone}</p>
            <p><strong>Longueur:</strong> ${generatedContent.length}</p>
            <p><strong>Langue:</strong> ${generatedContent.language}</p>
          </div>
          
          <div class="footer">
            <p>Généré par Content Generator</p>
          </div>
        </body>
      </html>
    `;

    // Créer un blob HTML
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    
    // Ouvrir dans une nouvelle fenêtre pour impression PDF
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
      };
    }
    
    // Nettoyer l'URL après un délai
    setTimeout(() => {
    URL.revokeObjectURL(url);
    }, 1000);
  };

  const toggleFavorite = useCallback((id: string) => {
    setHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    if (generatedContent?.id === id) {
      setGeneratedContent(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  }, [generatedContent?.id]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (generatedContent?.id === id) {
      setGeneratedContent(null);
    }
  }, [generatedContent?.id]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(debouncedSearchHistory.toLowerCase()) ||
                           item.content.toLowerCase().includes(debouncedSearchHistory.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesFavorites;
  });
  }, [history, debouncedSearchHistory, showFavoritesOnly]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">CFT</span>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ContentFlow Toolbox
        </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Créez du contenu captivant en quelques clics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200" title="Télécharger">
                  <span className="text-lg">📥</span>
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200" title="Paramètres">
                  <span className="text-lg">⚙️</span>
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200" title="Aide">
                  <span className="text-lg">❓</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-purple-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-xs sm:text-sm">U</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs sm:text-sm font-semibold text-gray-800">Utilisateur Demo</div>
                  <div className="text-xs text-gray-600">Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]">
          
          {/* Left Column - Content Generator Form */}
          <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 overflow-y-auto max-h-[80vh] sm:max-h-none">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Générateur de Contenu</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Sujet de la publication *</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 pl-8 sm:pl-10 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm"
                    placeholder="Ex: Les tendances marketing 2024..."
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="targetAudience" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Public cible</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
                  >
                    <option value="Professionnels">💼 Professionnels</option>
                    <option value="Étudiants">🎓 Étudiants</option>
                    <option value="Entrepreneurs">🚀 Entrepreneurs</option>
                    <option value="Grand public">👥 Grand public</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tone" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v10h6V6H9z" />
                    </svg>
                    <span>Ton de la publication</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
                  >
                    <option value="professionnel">💼 Professionnel</option>
                    <option value="amical">😊 Amical</option>
                    <option value="formel">🎩 Formel</option>
                    <option value="décontracté">😎 Décontracté</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Longueur du contenu</span>
                  </div>
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {(['courte', 'moyenne', 'longue'] as Length[]).map((len) => (
                    <label key={len} className={`relative flex items-center justify-center p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
                      length === len 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-purple-300 text-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="length"
                        value={len}
                        checked={length === len}
                        onChange={(e) => setLength(e.target.value as Length)}
                        className="sr-only"
                      />
                      <span className="text-xs sm:text-sm font-medium capitalize">
                        {len === 'courte' ? '📝' : len === 'moyenne' ? '📄' : '📚'} {len}
                      </span>
                      {length === len && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="platform" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Format de rendu</span>
                  </div>
                </label>
                <div className="relative">
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
                >
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="facebook">📘 Facebook</option>
                    <option value="twitter">🐦 Twitter/X</option>
                    <option value="wordpress">📝 WordPress</option>
                    <option value="reddit">🤖 Reddit</option>
                </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>Langue</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
                  >
                    <option value="fr">🇫🇷 FR Français</option>
                    <option value="en">🇬🇧 EN English</option>
                    <option value="es">🇪🇸 ES Español</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm min-h-[44px] touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Générer le contenu</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Middle Column - Preview */}
          <div className="lg:col-span-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 flex flex-col min-h-[400px] sm:min-h-[500px]">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Aperçu de votre publication</h2>
                <p className="text-xs sm:text-sm text-gray-600">Voici comment votre contenu apparaîtra</p>
              </div>
            </div>

            {generatedContent ? (
              <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
                {/* Platform indicator */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-sm sm:text-xl">
                        {platform === 'facebook' ? '📘' : 
                         platform === 'linkedin' ? '💼' : 
                         platform === 'twitter' ? '🐦' : 
                         platform === 'reddit' ? '🤖' : '📝'}
                      </span>
                    </div>
                <div>
                      <div className="font-semibold text-gray-800 capitalize text-sm sm:text-base">{platform}</div>
                      <div className="text-xs text-gray-500">Format de rendu</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {tone} • {length}
                  </div>
                </div>

                {/* Social media post preview */}
                <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                  {/* Post header */}
                  <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border-b border-gray-100">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm sm:text-lg">CR</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-lg truncate">Camille Rousseau</div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1">
                        <span className="truncate">7 septembre à 23:07</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:flex items-center space-x-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Paris, France</span>
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 touch-manipulation">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Post content */}
                  <div className="p-3 sm:p-4">
                    <div className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {showFullContent 
                        ? generatedContent.content 
                        : generatedContent.content.length > 300 
                          ? generatedContent.content.substring(0, 300) + "..."
                          : generatedContent.content
                      }
                    </div>
                    {generatedContent.content.length > 300 && (
                      <div className="mt-3 text-center">
                        <button
                          onClick={() => setShowFullContent(!showFullContent)}
                          className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-medium hover:underline transition-colors touch-manipulation"
                        >
                          {showFullContent ? "Afficher moins" : "Afficher plus"}
                        </button>
                    </div>
                  )}
                  </div>

                  {/* Post actions */}
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        <button className="flex items-center space-x-1 sm:space-x-2 hover:text-red-500 transition-colors touch-manipulation">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs sm:text-sm">J'aime</span>
                        </button>
                        <button className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-500 transition-colors touch-manipulation">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-xs sm:text-sm">Commenter</span>
                        </button>
                        <button className="flex items-center space-x-1 sm:space-x-2 hover:text-green-500 transition-colors touch-manipulation">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <span className="text-xs sm:text-sm">Partager</span>
                        </button>
                      </div>
                      <button className="hover:text-gray-800 transition-colors touch-manipulation">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      </div>
                    </div>
                    </div>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">📋 Copier</span>
                  </button>
                  <button
                    onClick={downloadContent}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">📄 PDF</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => toggleFavorite(generatedContent.id)}
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 touch-manipulation min-h-[44px]"
                  >
                    <span className="text-base sm:text-lg">{generatedContent.isFavorite ? '⭐' : '☆'}</span>
                    <span className="hidden sm:inline">{generatedContent.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                    <span className="sm:hidden">{generatedContent.isFavorite ? 'Favori' : 'Favoris'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Aucun contenu généré</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Remplissez le formulaire à gauche et cliquez sur<br />
                  <span className="font-medium text-purple-600">"Générer le contenu"</span> pour voir l'aperçu ici.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 flex flex-col min-h-[300px] sm:min-h-[400px]">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Historique ({history.length})
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">Vos contenus générés</p>
              </div>
            </div>

            {/* Search and filter */}
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full px-3 py-2 pl-8 sm:pl-9 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 cursor-pointer transition-colors touch-manipulation">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded border-gray-300"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Favoris uniquement</span>
                {showFavoritesOnly && (
                  <div className="ml-auto">
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {filteredHistory.filter(item => item.isFavorite).length}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* History list */}
            <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div key={item.id} className="group border-2 border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 hover:border-purple-300 hover:shadow-md transition-all duration-200 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-1.5 sm:mb-2">
                          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.title}</h4>
                          {item.isFavorite && (
                            <span className="text-yellow-500 text-xs">⭐</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                          {item.content.substring(0, 80)}...
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span>📅</span>
                            <span>{formatDate(item.createdAt)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{item.tone === 'professionnel' ? '💼' : item.tone === 'amical' ? '😊' : item.tone === 'formel' ? '🎩' : '😎'}</span>
                            <span className="capitalize hidden sm:inline">{item.tone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{item.length === 'courte' ? '📝' : item.length === 'moyenne' ? '📄' : '📚'}</span>
                            <span className="capitalize hidden sm:inline">{item.length}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2 sm:ml-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="p-1.5 sm:p-2 text-yellow-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-all duration-200 touch-manipulation"
                          title={item.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          {item.isFavorite ? (
                            <span className="text-sm sm:text-lg">⭐</span>
                          ) : (
                            <span className="text-sm sm:text-lg">☆</span>
                          )}
                        </button>
                        <button
                          onClick={() => deleteFromHistory(item.id)}
                          className="p-1.5 sm:p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 touch-manipulation"
                          title="Supprimer"
                        >
                          <span className="text-sm sm:text-lg">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center flex-1 flex flex-col items-center justify-center px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Aucun contenu dans l'historique</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Vos contenus générés apparaîtront ici<br />
                    pour un accès rapide et facile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
