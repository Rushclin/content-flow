import React, { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Send, Settings } from "lucide-react";
import { appConfig } from "@/config/app";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Popover from "../base/Headless/Popover";
import { FormSelect, FormLabel } from "../base/Form";

interface ComposerFormProps {
  register: any;
  errors: any;
  control: any;
  isValid: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  message: string;
  setMessage: (message: string) => void;
}

const ComposerForm: React.FC<ComposerFormProps> = ({
  register,
  control,
  isLoading,
  onSubmit,
  message,
  setMessage,
}) => {
  const { t } = useTranslation();
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      setIsMultiline(textarea.scrollHeight > lineHeight + 4);
    }
  }, [message]);

  return (
    <form onSubmit={onSubmit}>
      <div
        className={`flex ${
          isMultiline ? "items-end" : "items-center"
        } w-full rounded-md shadow-sm border border-slate-200 px-3 py-2 focus-within:ring-1 focus-within:ring-primary transition-all`}
      >
        <Popover>
          <Popover.Button
            as="button"
            type="button"
            className="p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </Popover.Button>

          <Popover.Panel
            placement="bottom-start"
            className="w-80 p-4 space-y-4 bg-slate-50"
          >
            <div>
              <FormLabel htmlFor="targetAudience">
                {t("form.targetAudience", "Public cible")}
              </FormLabel>
              <FormSelect id="targetAudience" {...register("targetAudience")}>
                <option value="">
                  {t("form.selectAudience", "Sélectionner une audience")}
                </option>
                {appConfig.targetPeoples.map((audience, index) => (
                  <option key={index} value={audience.value}>
                    {audience.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <FormLabel htmlFor="tone">
                {t("form.tone", "Ton de la publication")}
              </FormLabel>
              <FormSelect id="tone" {...register("tone")}>
                <option value="">
                  {t("form.selectTone", "Sélectionner un ton")}
                </option>
                {appConfig.pupblicationTonalities.map((tone, index) => (
                  <option key={index} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <FormLabel htmlFor="length">
                {t("form.contentLength", "Longueur du contenu")}
              </FormLabel>
              <Controller
                name="length"
                control={control}
                render={({ field }) => (
                  <FormSelect id="length" {...field}>
                    <option value="courte">{t("form.short", "Courte")}</option>
                    <option value="moyenne">
                      {t("form.medium", "Moyenne")}
                    </option>
                    <option value="longue">{t("form.long", "Longue")}</option>
                  </FormSelect>
                )}
              />
            </div>

            <div>
              <FormLabel htmlFor="platform">
                {t("form.renderFormat", "Format de rendu")}
              </FormLabel>
              <FormSelect id="platform" {...register("platform")}>
                <option value="">
                  {t("form.selectPlatform", "Sélectionner une plateforme")}
                </option>
                {appConfig.platforms.map((platform, index) => (
                  <option key={index} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </FormSelect>
            </div>
          </Popover.Panel>
        </Popover>

        <textarea
          ref={textareaRef}
          {...register("subject")}
          className="flex-1 resize-none border-none bg-transparent text-slate-800 placeholder-gray-400 focus:outline-none px-2 text-sm md:text-base max-h-40 overflow-y-auto"
          placeholder={t(
            "form.subjectPlaceholder",
            "Sujet de votre publication..."
          )}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center gap-1 ml-2">
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

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
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
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
  const [message, setMessage] = useState("");

  const subject = watch("subject");

  useEffect(() => {
    setMessage(subject || "");
  }, [subject]);

  const onSubmitHandler = useCallback(async (data: FormGenerationData) => {
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
      setMessage("");
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const copyToClipboard = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      alert(t("success.copied", "Contenu copié !"));
    }
  }, [generatedContent, t]);

  return (
    <>
      <div className="flex flex-col h-[100vh] max-w-5xl mx-auto bg-white dark:bg-[#1f1f1f]">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {generatedContent && (
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-[#2b2b2b] text-left space-y-4 shadow-sm">
              <h2 className="text-xl font-semibold">
                {generatedContent.title}
              </h2>
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {generatedContent.content}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                  <Copy className="w-4 h-4" /> {t("common.copy", "Copier")}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white px-4 py-3">
          <ComposerForm
            register={register}
            errors={errors}
            control={control}
            isValid={isValid}
            isLoading={isLoading}
            onSubmit={handleSubmit(onSubmitHandler)}
            message={message}
            setMessage={setMessage}
          />
        </div>
      </div>

      {/* <div className="text-center max-w-5xl mx-auto ">
      <div className="relative bottom-0 bg-red-500">
        <ComposerForm
          register={register}
          errors={errors}
          control={control}
          isValid={isValid}
          isLoading={isLoading}
          onSubmit={handleSubmit(onSubmitHandler)}
          message={message}
          setMessage={setMessage}
        />
      </div>

      {generatedContent && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50 text-left space-y-4">
          <h2 className="text-xl font-semibold">{generatedContent.title}</h2>
          <p className="whitespace-pre-line">{generatedContent.content}</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              <Copy className="w-4 h-4" /> {t("common.copy", "Copier")}
            </button>
          </div>
        </div>
      )}
    </div> */}
    </>
  );
};

export default FormGeneration;
