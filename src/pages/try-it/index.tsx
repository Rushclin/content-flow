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
import axiosInstance from "@/lib/axios";
import { ChatMessageType } from "@/types/chat";
import MessageBubble from "@/components/chat/MessageBubble";
import toast from "react-hot-toast";

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

  const onSubmitHandler = useCallback(
    async (data: FormGenerationData) => {
      setIsLoading(true);

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
        toast.error(t("error.generation", "Erreur lors de la génération"));
      } finally {
        setIsLoading(false);
      }
    },
    [form, t]
  );

  const copyToClipboard = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content);
      toast.success(t("success.copied", "Contenu copié !"));
    },
    [t]
  );

  if (!mounted) return <Loading />;

  return (
    <PublicLayout title="Essayez notre outil de generation">
      <Header />

      {messages.length === 0 ? (
        <div className="flex items-center justify-center max-w-6xl mx-auto min-h-[calc(100vh-200px)] px-4">
          <div className="w-full">
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
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={copyToClipboard}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4">
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
