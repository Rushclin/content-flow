import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { Copy } from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import {
  ChatMessageType,
  GenerateWithConversationResponse,
} from "@/types/chat";
import { useTranslation } from "react-i18next";
import {
  ComposerForm,
  FormGenerationData,
  formGenerationSchema,
} from "@/components/public/FormGeneration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const GenerateChatPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
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
        const conversationId = apiResponse.conversation.id;
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

    </DashboardLayout>
  );
};

export default GenerateChatPage;
