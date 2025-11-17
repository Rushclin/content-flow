import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import {
  ChatMessageType,
  GenerateWithConversationResponse,
  ApiConversation,
} from "@/types/chat";
import {
  ComposerForm,
  FormGenerationData,
  formGenerationSchema,
} from "@/components/public/FormGeneration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import MessageBubble from "@/components/chat/MessageBubble";

const GenerateChatDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: conversationId } = router.query;

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [conversation, setConversation] = useState<ApiConversation | null>(
    null
  );
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
    const loadConversation = async () => {
      if (!conversationId || typeof conversationId !== "string") {
        return;
      }

      setIsLoadingConversation(true);
      try {
        const { data } = await axiosInstance.get<{
          data: ApiConversation;
        }>(`/conversations/${conversationId}`);

        const conversationData = data.data;
        setConversation(conversationData);

        const convertedMessages: ChatMessageType[] =
          conversationData.messages.map((msg) => {
            let content = msg.content;
            if (msg.role === "assistant") {
              try {
                const parsed = JSON.parse(msg.content);
                content = parsed.output || msg.content;
              } catch (e) {
                content = msg.content;
              }
            }

            return {
              id: msg.id,
              type: msg.role === "user" ? "user" : "ai",
              content,
              timestamp: new Date(msg.created_at),
              metadata: {
                platform: msg.metadata.platform,
                tone: conversationData.metadata.platform,
                length: "moyenne",
              },
            };
          });

        setMessages(convertedMessages);

        if (conversationData.metadata) {
          form.reset({
            subject: "",
            targetAudience: "Professionnels",
            tone: "professionnel",
            length: "moyenne",
            platform: (conversationData.metadata.platform as any) || "LinkedIn",
            language: "fr",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la conversation:", error);
        toast.error(
          t(
            "error.loadConversation",
            "Erreur lors du chargement de la conversation"
          )
        );
        router.push("/quick-off");
      } finally {
        setIsLoadingConversation(false);
      }
    };

    if (router.isReady) {
      loadConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, router.isReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmitHandler = useCallback(
    async (data: FormGenerationData) => {
      if (!conversationId || typeof conversationId !== "string") {
        return;
      }

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
            conversation_id: conversationId,
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
        const generatedContent = apiResponse.generated_content.output;

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

        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, form, t]
  );

  const copyToClipboard = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content);
      toast.success(t("success.copied", "Contenu copié !"));
    },
    [t]
  );

  if (isLoadingConversation) {
    return (
      <DashboardLayout title={t("generate.conversation", "Conversation")}>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-gray-600">
              {t("loading.conversation", "Chargement de la conversation...")}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={conversation?.title || t("generate.conversation", "Conversation")}
    >
      <div className="flex flex-col max-w-6xl mx-auto ">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={copyToClipboard}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm p-5">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <p className="text-gray-600">
                    {t("loading.generating", "Génération en cours...")}
                  </p>
                </div>
              </div>
            </div>
          )}

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
    </DashboardLayout>
  );
};

export default GenerateChatDetails;
