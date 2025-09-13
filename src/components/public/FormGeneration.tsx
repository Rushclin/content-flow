import React, { useState, useCallback } from "react";
import InputForm from "../common/InputForm";
import { Loader2, Copy } from "lucide-react";
import { appConfig } from "@/config/app";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Platform = "wordpress" | "twitter" | "facebook" | "linkedin" | "reddit";
type Tone = "professionnel" | "amical" | "formel" | "décontracté";
type Length = "courte" | "moyenne" | "longue";
type Language = "fr" | "en" | "es";

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: Platform | string;
  tone: Tone;
  length: Length;
  language: Language;
  createdAt: Date;
  isFavorite: boolean;
  images?: string[];
  videos?: string[];
}

// Schéma de validation avec Zod
const formGenerationSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est obligatoire")
    .min(10, "Le sujet doit contenir au moins 10 caractères")
    .max(500, "Le sujet ne peut pas dépasser 500 caractères"),
  targetAudience: z.string().min(1, "Le public cible est obligatoire"),
  tone: z.enum(["professionnel", "amical", "formel", "décontracté"], {
    message: "Veuillez sélectionner un ton valide"
  }),
  length: z.enum(["courte", "moyenne", "longue"], {
    message: "Veuillez sélectionner une longueur valide"
  }),
  platform: z.enum(["LinkedIn", "Facebook", "Twitter/X", "WordPress", "Reddit"], {
    message: "Veuillez sélectionner une plateforme valide"
  }),
  language: z.enum(["fr", "en", "es"], {
    message: "Veuillez sélectionner une langue valide"
  }),
});

type FormGenerationData = z.infer<typeof formGenerationSchema>;

const FormGeneration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormGenerationData>({
    resolver: zodResolver(formGenerationSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      targetAudience: "Professionnels",
      tone: "professionnel",
      length: "moyenne",
      platform: "LinkedIn",
      language: "fr",
    },
  });

  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const watchedValues = watch();

  const onSubmit = useCallback(
    async (data: FormGenerationData) => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://automation.novalitix.com/webhook/generate-content",
          {
            theme: data.subject,
            details: `Public cible: ${data.targetAudience}, Ton: ${data.tone}, Longueur: ${data.length}`,
            platform: data.platform,
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
          title: data.subject,
          content: output,
          platform: data.platform,
          tone: data.tone,
          length: data.length,
          language: data.language,
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
    []
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div className="mt-5 border border-slate-200 shadow-2xs bg-white max-w-5xl mx-auto p-3 rounded-md">
          <div className="text-left">
            <InputForm
              {...register("subject")}
              type="text"
              textarea
              label="Sujet de votre publication"
              placeholder="Ex: Les tendances marketing 2024..."
              required
              error={errors.subject?.message}
            />
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-gray-600 font-medium">
              Public cible<span className="text-red-500">*</span>
            </label>
            <select
              {...register("targetAudience")}
              className={`w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm ${errors.targetAudience ? 'border-red-500' : ''}`}
            >
              {appConfig.targetPeoples.map((people) => (
                <option key={people.value} value={people.value}>
                  {people.label}
                </option>
              ))}
            </select>
            {errors.targetAudience && (
              <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
            )}
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-gray-600 font-medium">
              Ton de la publication<span className="text-red-500">*</span>
            </label>
            <select
              {...register("tone")}
              className={`w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm ${errors.tone ? 'border-red-500' : ''}`}
            >
              {appConfig.pupblicationTonalities.map((tonality) => (
                <option key={tonality.value} value={tonality.value}>
                  {tonality.label}
                </option>
              ))}
            </select>
            {errors.tone && (
              <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
            )}
          </div>

          <div className="mt-5 text-left">
            <label className="text-slate-500">Longueur du contenu</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(["courte", "moyenne", "longue"] as Length[]).map((len) => (
                <label
                  key={len}
                  className={`relative flex items-center justify-center p-2 sm:p-3 border-1 rounded-md cursor-pointer transition-all duration-200 ${
                    watchedValues.length === len
                      ? "border-slate-500 bg-slate-50 text-slate-700"
                      : "border-gray-200 hover:border-slate-300 text-gray-600"
                  }`}
                >
                  <input
                    {...register("length")}
                    type="radio"
                    value={len}
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
            {errors.length && (
              <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
            )}
          </div>

          <div className="text-left mt-5">
            <label className="mb-1 text-slate-500 font-medium">
              Format de rendu<span className="text-red-500">*</span>
            </label>
            <select
              {...register("platform")}
              className={`w-full px-3 py-2.5 sm:py-3 border-1 border-gray-200 rounded-md focus:outline-none transition-all duration-200 text-gray-700 appearance-none bg-white text-sm ${errors.platform ? 'border-red-500' : ''}`}
            >
              {appConfig.platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading || !isValid}
            className="recoleta w-full mt-5 bg-gradient-to-r from-slate-600 to-slate-400 text-white py-2.5 sm:py-3 px-4 rounded-md disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
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
