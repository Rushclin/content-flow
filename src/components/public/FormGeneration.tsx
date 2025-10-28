import React, { useState } from "react";
import { Loader2, Plus, Send } from "lucide-react";
import { appConfig } from "@/config/app";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { FormLabel } from "../base/Form";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { motion } from "framer-motion";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button as ShadCnButton } from "@/components/ui/button";

export interface ComposerFormProps {
  form: UseFormReturn<FormGenerationData>;
  onSubmit: (data: FormGenerationData) => void;
  isLoading?: boolean;
}

export const ComposerForm: React.FC<ComposerFormProps> = ({
  form,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { control, register, handleSubmit } = form;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        className="relative rounded-2xl p-4 z-10"
        animate={{
          borderColor: isFocused ? "#036eb7" : "#0a0a0a",
        }}
        transition={{
          duration: 0.3,
        }}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <div className="relative mb-6">
          <Textarea
            {...register("subject")}
            placeholder={t(
              "form.subjectPlaceholder",
              "Sujet de votre publication..."
            )}
            autoFocus
            className="min-h-[60px] resize-none bg-transparent border-none text-base placeholder:text-slate-400
                focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none shadow-none
                [&:focus]:ring-0 [&:focus]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <ShadCnButton
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 cursor-pointer rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white p-0 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </ShadCnButton>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="bg-white border-slate-400 w-80 space-y-4 p-4"
              >
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("form.targetAudience", "Public cible")}
                  </FormLabel>
                  <Controller
                    name="targetAudience"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "form.selectAudience",
                              "Sélectionner une audience"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {appConfig.targetPeoples.map((audience, index) => (
                              <SelectItem key={index} value={audience.value}>
                                {audience.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("form.tone", "Ton de la publication")}
                  </FormLabel>
                  <Controller
                    name="tone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "form.selectTone",
                              "Sélectionner un ton"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {appConfig.pupblicationTonalities.map(
                              (tone, index) => (
                                <SelectItem key={index} value={tone.value}>
                                  {tone.label}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("form.contentLength", "Longueur du contenu")}
                  </FormLabel>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "form.selectLength",
                              "Sélectionner une longueur"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectItem value="courte">
                              {t("form.short", "Courte")}
                            </SelectItem>
                            <SelectItem value="moyenne">
                              {t("form.medium", "Moyenne")}
                            </SelectItem>
                            <SelectItem value="longue">
                              {t("form.long", "Longue")}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("form.renderFormat", "Format de rendu")}
                  </FormLabel>
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "form.selectPlatform",
                              "Sélectionner une plateforme"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            {appConfig.platforms.map((platform, index) => (
                              <SelectItem key={index} value={platform.value}>
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-3">
            <ShadCnButton
              type="submit"
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="h-10 w-10 cursor-pointer rounded-full bg-primary text-white hover:bg-primary/90 p-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </ShadCnButton>
          </div>
        </div>
      </motion.div>
    </form>
  );
};

export interface GeneratedContent {
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

export const formGenerationSchema = z.object({
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

export type FormGenerationData = z.infer<typeof formGenerationSchema>;
