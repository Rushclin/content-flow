import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Sparkles, History, Copy } from "lucide-react";
import { appConfig } from "@/config/app";
import DashboardLayout from "@/layout/dashboard";
import {
  Platform,
  Tone,
  Length,
  ChatMessageType,
  GenerateWithConversationResponse,
} from "@/types/chat";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatLoadingIndicator from "@/components/chat/ChatLoadingIndicator";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import GenerationSettings from "@/components/chat/GenerationSettings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  ComposerForm,
  FormGenerationData,
  formGenerationSchema,
} from "@/components/public/FormGeneration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

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

const GenerateChatPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // const [form, setForm] = useState({
  //   subject: "",
  //   targetAudience: "Professionnels",
  //   tone: "professionnel" as Tone,
  //   length: "moyenne" as Length,
  //   platform: "linkedin" as Platform,
  // });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [conversationHistory, setConversationHistory] = useState<
    ChatMessageType[]
  >([]);

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
        const { data: responseData } = await axiosInstance.post<{
          data: GenerateWithConversationResponse;
        }>(
          "/content/generate-with-conversation",
          {
            theme: data.subject,
            details: `Public cible: ${data.targetAudience}, Ton: ${data.tone}, Longueur: ${data.length}`,
            platform: data.platform,
            message: data.subject,
          },
          {
            timeout: 50000,
          }
        );

        const apiResponse = responseData.data;

        // Extraire le contenu généré depuis generated_content.output
        const generatedContent = apiResponse.generated_content.output;

        // Créer le message AI avec le contenu parsé
        const aiMessage: ChatMessageType = {
          id: apiResponse.assistant_message.id,
          type: "ai",
          content: generatedContent,
          timestamp: new Date(apiResponse.assistant_message.created_at),
          metadata: {
            platform: data.platform,
            tone: data.tone,
            length: data.length,
          },
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Stocker l'ID de la conversation
        const conversationId = apiResponse.conversation.id;
        setCurrentConversationId(conversationId);

        // Rediriger vers la route historique de la conversation
        router.push(`/quick-off/${conversationId}`);

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
        toast.error(
          t("error.generation", "Erreur lors de la génération du contenu")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [form, router, t]
  );

  const copyToClipboard = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content);
      toast.success(t("success.copied", "Contenu copié !"));
    },
    [t]
  );

  // Charger une conversation existante si spécifiée dans l'URL
  // useEffect(() => {
  //   const loadConversation = async () => {
  //     const conversationId = router.query.conversation as string;
  //     if (conversationId && user) {
  //       try {
  //         const response = await axios.get(
  //           `/api/generation/conversation/${conversationId}`
  //         );
  //         if (response.data.success) {
  //           const conversation = response.data.data;
  //           setCurrentConversationId(conversation.id);

  //           // Convertir les messages en format pour l'affichage
  //           const messages: ChatMessageType[] = conversation.messages.map(
  //             (msg: {
  //               id: string;
  //               senderType: string;
  //               content: string;
  //               createdAt: string;
  //               contentJson?: { metadata?: unknown };
  //             }) => ({
  //               id: msg.id,
  //               type: msg.senderType === "USER" ? "user" : "ai",
  //               content: msg.content,
  //               timestamp: new Date(msg.createdAt),
  //               metadata: msg.contentJson?.metadata,
  //             })
  //           );

  //           setConversationHistory(messages);

  //           // Mettre à jour les paramètres de forme avec ceux de la conversation
  //           if (conversation.meta) {
  //             setForm((prev) => ({
  //               ...prev,
  //               platform: conversation.meta.platform || prev.platform,
  //               tone: conversation.meta.tone || prev.tone,
  //               length: conversation.meta.length || prev.length,
  //               targetAudience:
  //                 conversation.meta.audience || prev.targetAudience,
  //             }));
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Erreur lors du chargement de la conversation:", error);
  //       }
  //     }
  //   };

  //   if (router.isReady) {
  //     loadConversation();
  //   }
  // }, [router.isReady, router.query.conversation, user]);

  // Charger l'historique depuis localStorage au montage (fallback)
  // useEffect(() => {
  //   if (!router.query.conversation) {
  //     try {
  //       const raw = localStorage.getItem("cf_conversation_history");
  //       if (raw) {
  //         const parsed = JSON.parse(raw) as Array<{
  //           type: "user" | "ai";
  //           content: string;
  //           timestamp: string;
  //           metadata?: { platform: string; tone: string; length: string };
  //         }>;
  //         const withDates: ChatMessageType[] = parsed.map((m) => ({
  //           ...m,
  //           timestamp: new Date(m.timestamp),
  //         }));
  //         setConversationHistory(withDates);
  //       }
  //     } catch (err) {
  //       console.error("Impossible de charger l'historique", err);
  //     }
  //   }
  // }, [router.query.conversation]);

  // Persister l'historique à chaque modification
  // useEffect(() => {
  //   try {
  //     const serializable = conversationHistory.map((m) => ({
  //       ...m,
  //       timestamp: m.timestamp.toISOString(),
  //     }));
  //     localStorage.setItem(
  //       "cf_conversation_history",
  //       JSON.stringify(serializable)
  //     );
  //   } catch (err) {
  //     console.error("Impossible d'enregistrer l'historique", err);
  //   }
  // }, [conversationHistory]);

  // const handleChange = (key: string, value: string) => {
  //   setForm((prev) => ({ ...prev, [key]: value }));
  // };

  // const startNewConversation = () => {
  //   setCurrentConversationId(null);
  //   setConversationHistory([]);
  //   setForm((prev) => ({ ...prev, subject: "" }));
  // };

  // const saveToDatabase = async (userMessage: string, aiMessage: string) => {
  //   try {
  //     const response = await axios.post("/api/generation/save", {
  //       conversationId: currentConversationId,
  //       userMessage,
  //       aiMessage,
  //       platform: form.platform,
  //       tone: form.tone,
  //       length: form.length,
  //       audience: form.targetAudience,
  //       userId: user!.id,
  //     });

  //     if (response.data.success) {
  //       const { conversation } = response.data.data;
  //       if (!currentConversationId) {
  //         setCurrentConversationId(conversation.id);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de la sauvegarde:", error);
  //   }
  // };

  // const handleSubmit = useCallback(async () => {
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.post(
  //       appConfig.n8nBaseUrl ||
  //         "https://automation.novalitix.com/webhook/generate-content",
  //       {
  //         theme: form.subject,
  //         details: `Public cible: ${form.targetAudience}, Ton: ${form.tone}, Longueur: ${form.length}`,
  //         platform: form.platform,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const { output } = response.data;

  //     const newContent: GeneratedContent = {
  //       id: Date.now().toString(),
  //       title: form.subject,
  //       content: output,
  //       platform: form.platform,
  //       tone: form.tone,
  //       length: form.length,
  //       createdAt: new Date(),
  //       isFavorite: false,
  //     };

  //     // Ajouter à l'historique de conversation
  //     const userMessage: ChatMessageType = {
  //       type: "user" as const,
  //       content: form.subject,
  //       timestamp: new Date(),
  //       metadata: {
  //         platform: form.platform,
  //         tone: form.tone,
  //         length: form.length,
  //       },
  //     };

  //     const aiMessage: ChatMessageType = {
  //       type: "ai" as const,
  //       content: output,
  //       timestamp: new Date(),
  //       metadata: {
  //         platform: form.platform,
  //         tone: form.tone,
  //         length: form.length,
  //       },
  //     };

  //     setConversationHistory((prev) => [...prev, userMessage, aiMessage]);
  //     setGeneratedContent(newContent);

  //     // Sauvegarder en base de données
  //     await saveToDatabase(form.subject, output);

  //     // Réinitialiser le champ de saisie pour permettre une nouvelle question
  //     setForm((prev) => ({ ...prev, subject: "" }));
  //   } catch (error) {
  //     console.error("Erreur lors de la génération:", error);
  //     alert("Erreur lors de la génération du contenu. Veuillez réessayer.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form]);

  return (
    <DashboardLayout title={t("generate.title", "Générateur de Contenu")}>
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
        <div className="flex flex-col max-w-6xl mx-auto mt-24">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`md:max-w-[75%] w-full ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm"
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
                        message.type === "user" ? "text-white" : "text-gray-800"
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
                        {new Date(message.timestamp).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  )}

                  {message.type === "user" && (
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-white/70">
                        {new Date(message.timestamp).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
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

      {/* <div className="flex-1 overflow-hidden bg-white relative h-full">
        <div className="overflow-y-auto h-full px-6 py-6 pb-80">
          <div className="max-w-4xl mx-auto">
            {conversationHistory.length > 0 ? (
              <div className="space-y-6">
                {conversationHistory.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    index={index}
                    showActions={message.type === "ai"}
                  />
                ))}

                {isLoading && <ChatLoadingIndicator />}
              </div>
            ) : (
              <ChatEmptyState
                icon={Sparkles}
                title={appConfig.name}
                description={t("generate.description", "Décrivez le contenu que vous souhaitez créer et notre IA le générera pour vous.")}
              />
            )}
          </div>
        </div>

        <ChatInput
          value={form.subject}
          onChange={(value) => handleChange("subject", value)}
          onSubmit={() => handleSubmit()}
          isLoading={isLoading}
          placeholder={t("generate.placeholder", "Décrivez le contenu que vous souhaitez créer...")}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          settingsPanel={
            <GenerationSettings
              targetAudience={form.targetAudience}
              tone={form.tone}
              length={form.length}
              platform={form.platform}
              onTargetAudienceChange={(value) =>
                handleChange("targetAudience", value)
              }
              onToneChange={(value) => handleChange("tone", value)}
              onLengthChange={(value) => handleChange("length", value)}
              onPlatformChange={(value) => handleChange("platform", value)}
            />
          }
          footerContent={
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                {t("generate.disclaimer", "Content Flow peut faire des erreurs. Envisagez de vérifier les informations importantes.")}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {conversationHistory.length > 0 && (
                  <button
                    onClick={startNewConversation}
                    className="text-xs text-green-600 hover:text-green-800 transition-colors flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{t("generate.newConversation", "Nouvelle conversation")}</span>
                  </button>
                )}
                <Link
                  href="/generate/history"
                  className="text-xs text-primary/90 hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <History className="w-3 h-3" />
                  <span>{t("generate.viewHistory", "Voir l'historique")}</span>
                </Link>
              </div>
            </div>
          }
        />
      </div> */}
    </DashboardLayout>
  );
};

export default GenerateChatPage;
