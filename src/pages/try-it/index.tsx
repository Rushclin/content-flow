import Loading from "@/components/common/Loading";
import {
  ComposerForm,
  formGenerationSchema,
  type FormGenerationData,
} from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import PublicLayout from "@/layout/public/PublicLayout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { ChatMessageType } from "@/types/chat";

const TryPage = () => {
  const { t } = useTranslation("try-it");
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormGenerationData>({
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmitHandler = useCallback(async (data: FormGenerationData) => {
    console.log({ data });
    setIsLoading(true);

    // Ajouter le message de l'utilisateur
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      type: "user",
      content: data.subject,
      timestamp: new Date(),
      metadata: {
        platform: data.platform,
        tone: data.tone,
        length: data.length,
      },
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const { data: responseDatas } = await axiosInstance.post(
        "/content/generate",
        {
          theme: data.subject,
          details: `Public cible: ${data.targetAudience}, Ton: ${data.tone}, Longueur: ${data.length}`,
          platform: data.platform,
        },
        {
          timeout: 50000,
        }
      );
      const { output } = responseDatas.data;
      console.log({ output });

      // Ajouter la réponse de l'IA
      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: output,
        timestamp: new Date(),
        metadata: {
          platform: data.platform,
          tone: data.tone,
          length: data.length,
        },
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Réinitialiser le formulaire
      form.reset({
        subject: "",
        targetAudience: data.targetAudience,
        tone: data.tone,
        length: data.length,
        platform: data.platform,
        language: data.language,
      });
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    alert(t("success.copied", "Contenu copié !"));
  }, [t]);

  if (!mounted) return <Loading />;

  return (
    <PublicLayout title="Essayez notre outil de generation">
      <Header />

      {messages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("title", "Générez votre contenu")}
              </h1>
              <p className="text-lg text-gray-600">
                {t(
                  "subtitle",
                  "Décrivez votre sujet et laissez l'IA créer du contenu pour vous"
                )}
              </p>
            </div>
            <ComposerForm
              form={form}
              onSubmit={onSubmitHandler}
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-6xl mx-auto mt-24">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                      : "bg-white dark:bg-[#2b2b2b] border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm"
                  } p-5`}
                >
                  {message.type === "ai" && message.metadata && (
                    <div className="flex gap-2 mb-3 pb-3 border-b border-slate-200">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {message.metadata.platform}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {message.metadata.tone}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {message.metadata.length}
                      </span>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <p
                      className={`whitespace-pre-line leading-relaxed ${
                        message.type === "user"
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>

                  {message.type === "ai" && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {t("common.copy", "Copier")}
                      </button>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {message.type === "user" && (
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-white/70">
                        {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-slate-800 px-4 py-4">
            <ComposerForm
              isLoading={isLoading}
              form={form}
              onSubmit={onSubmitHandler}
            />
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default TryPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "home",
        "try-it",
      ])),
    },
  };
};
