import React, { useState, useCallback } from "react";
import InputForm from "../common/InputForm";
import { Loader2, Copy } from "lucide-react";
import { appConfig } from "@/config/app";
import axios from "axios";

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

interface FormState {
  subject: string;
  targetAudience: string;
  tone: Tone;
  length: Length;
  platform: Platform;
  language: Language;
}

const FormGeneration = () => {
  const [form, setForm] = useState<FormState>({
    subject: "",
    targetAudience: "Professionnels",
    tone: "professionnel",
    length: "moyenne",
    platform: "linkedin",
    language: "fr",
  });

  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: keyof FormState, value: string) => {
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
          language: form.language,
          createdAt: new Date(),
          isFavorite: false,
        };

        setGeneratedContent(newContent);
      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  const copyToClipboard = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      alert("Contenu copié !");
    }
  }, [generatedContent]);


  return (
    <div id="FormGeneration" className="text-center my-10">
      <h1 className="text-5xl recoleta">Essayez notre outil</h1>
      <p className="recoleta">Intuitif et convivial pour vos publications</p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="mt-5 border border-slate-200 shadow-2xs bg-white max-w-5xl mx-auto p-3 rounded-md">
          <div className="text-left">
            <InputForm
              type="text"
              textarea
              label="Sujet de votre publication"
              value={form.subject}
              onChange={(val) => handleChange("subject", val)}
              placeholder="Ex: Les tendances marketing 2024..."
              required
            />
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-gray-600 font-medium">
              Public cible<span className="text-red-500">*</span>
            </label>
            <select
              value={form.targetAudience}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              className="w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
            >
              {appConfig.targetPeoples.map((people) => (
                <option key={people.value} value={people.value}>
                  {people.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-gray-600 font-medium">
              Ton de la publication<span className="text-red-500">*</span>
            </label>
            <select
              value={form.tone}
              onChange={(e) => handleChange("tone", e.target.value)}
              className="w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
            >
              {appConfig.pupblicationTonalities.map((tonality) => (
                <option key={tonality.value} value={tonality.value}>
                  {tonality.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 text-left">
            <label className="text-slate-500">Longueur du contenu</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(["courte", "moyenne", "longue"] as Length[]).map((len) => (
                <label
                  key={len}
                  className={`relative flex items-center justify-center p-2 sm:p-3 border-1 rounded-md cursor-pointer transition-all duration-200 ${
                    form.length === len
                      ? "border-slate-500 bg-slate-50 text-slate-700"
                      : "border-gray-200 hover:border-slate-300 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="length"
                    value={len}
                    checked={form.length === len}
                    onChange={(e) => handleChange("length", e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {len === "courte"
                      ? "📝"
                      : len === "moyenne"
                      ? "📄"
                      : "📚"}{" "}
                    {len}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-slate-500 font-medium">
              Format de rendu<span className="text-red-500">*</span>
            </label>
            <select
              value={form.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
              className="w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm"
            >
              {appConfig.platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="recoleta w-full mt-5 bg-gradient-to-r from-slate-600 to-slate-400 text-white py-2.5 sm:py-3 px-4 rounded-md"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mx-auto" />
            ) : (
              "Générer le contenu"
            )}
          </button>
        </div>
      </form>

      {/* Affichage du contenu généré */}
      {generatedContent && (
        <div className="mt-8 max-w-5xl mx-auto p-4 border rounded-md bg-gray-50 text-left space-y-4">
          <h2 className="text-xl font-semibold">{generatedContent.title}</h2>
          <p className="whitespace-pre-line">{generatedContent.content}</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              <Copy className="w-4 h-4" /> Copier
            </button>
            {/* {navigator.share && (
              <button
                onClick={shareContent}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Partager
              </button>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormGeneration;
