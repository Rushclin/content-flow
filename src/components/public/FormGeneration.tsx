import React, { useState, useCallback } from "react";
import InputForm from "../common/Input";
import { Copy } from "lucide-react";
import { appConfig } from "@/config/app";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "../common/Select";
import RadioCardGroup from "../common/RadioGroup";
import Button from "../common/Button";

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  tone: string;
  length: string;
  language: string;
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
    message: "Veuillez sélectionner un ton valide",
  }),
  length: z.enum(["courte", "moyenne", "longue"], {
    message: "Veuillez sélectionner une longueur valide",
  }),
  platform: z.enum(
    ["LinkedIn", "Facebook", "Twitter/X", "WordPress", "Reddit"],
    {
      message: "Veuillez sélectionner une plateforme valide",
    }
  ),
  language: z.enum(["fr", "en", "es"], {
    message: "Veuillez sélectionner une langue valide",
  }),
});

type FormGenerationData = z.infer<typeof formGenerationSchema>;

const FormGeneration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
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

  const onSubmit = useCallback(async (data: FormGenerationData) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        appConfig.n8nBaseUrl ||
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
  }, []);

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
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

          <Select
            label=" Public cible"
            {...register("targetAudience")}
            required
            options={appConfig.targetPeoples}
            error={errors.targetAudience?.message}
            placeholder="Sélectionne une audiance"
          />

          <Select
            label="Ton de la publication"
            {...register("tone")}
            required
            options={appConfig.pupblicationTonalities}
            error={errors.tone?.message}
            placeholder="Sélectionne un ton"
            className="my-5"
          />

          <Controller
            name="length"
            control={control}
            render={({ field }) => (
              <RadioCardGroup
                name="length"
                label="Longueur du contenu"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                options={[
                  { value: "courte", label: "courte" },
                  { value: "moyenne", label: "moyenne" },
                  { value: "longue", label: "longue" },
                ]}
                error={errors.length?.message}
              />
            )}
          />

          <Select
            label="Format de rendu"
            {...register("platform")}
            required
            options={appConfig.platforms}
            error={errors.platform?.message}
            placeholder="Sélectionne une plateforme"
            className="my-5"
          />

          <Button
            type="submit"
            loading={isSubmitting || isLoading}
            disabled={!isValid}
            className="rounded-full bg-primary"
          >
            {" "}
            Générer le contenu
          </Button>
        </div>
      </form>

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
