import FormGeneration from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import { appConfig } from "@/config/app";
import PublicLayout from "@/layout/PublicLayout";
import Image from "next/image";
import Link from "next/link";
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
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
          setHistory((prev) => [newContent, ...prev]);
          setShowFullContent(false);
        } else {
          console.error("Erreur lors de la génération du contenu");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [subject, targetAudience, tone, length, platform, language]
  );

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
            <p class="subtitle">Contenu généré le ${new Date().toLocaleDateString(
              "fr-FR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}</p>
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
    a.download = `${generatedContent.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.html`;

    // Ouvrir dans une nouvelle fenêtre pour impression PDF
    const newWindow = window.open(url, "_blank");
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

  const toggleFavorite = useCallback(
    (id: string) => {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
      if (generatedContent?.id === id) {
        setGeneratedContent((prev) =>
          prev ? { ...prev, isFavorite: !prev.isFavorite } : null
        );
      }
    },
    [generatedContent?.id]
  );

  const deleteFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (generatedContent?.id === id) {
        setGeneratedContent(null);
      }
    },
    [generatedContent?.id]
  );

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(debouncedSearchHistory.toLowerCase()) ||
        item.content
          .toLowerCase()
          .includes(debouncedSearchHistory.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;
      return matchesSearch && matchesFavorites;
    });
  }, [history, debouncedSearchHistory, showFavoritesOnly]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  return (
    <PublicLayout>
      <Header />
      {/* <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"> */}
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    CFT
                  </span>
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ContentFlow Toolbox
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
                    Créez du contenu captivant en quelques clics
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-6">
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                  <button
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="Télécharger"
                  >
                    <span className="text-lg">📥</span>
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="Paramètres"
                  >
                    <span className="text-lg">⚙️</span>
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="Aide"
                  >
                    <span className="text-lg">❓</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-purple-200">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      U
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs sm:text-sm font-semibold text-gray-800">
                      Utilisateur Demo
                    </div>
                    <div className="text-xs text-gray-600">Premium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header> */}

      {/* Main Content */}

      {/* </div> */}
      <Hero />
      <FormGeneration/>
    </PublicLayout>
  );
}
