import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Sparkles, History } from "lucide-react";
import { appConfig } from "@/config/app";
import DashboardLayout from "@/layout/dashboard";
import { Platform, Tone, Length, ChatMessageType } from "@/types/chat";
import { useUser } from "@clerk/nextjs";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatLoadingIndicator from "@/components/chat/ChatLoadingIndicator";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import GenerationSettings from "@/components/chat/GenerationSettings";

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
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    subject: "",
    targetAudience: "Professionnels",
    tone: "professionnel" as Tone,
    length: "moyenne" as Length,
    platform: "linkedin" as Platform,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [conversationHistory, setConversationHistory] = useState<
    ChatMessageType[]
  >([]);

  // Charger une conversation existante si spécifiée dans l'URL
  useEffect(() => {
    const loadConversation = async () => {
      const conversationId = router.query.conversation as string;
      if (conversationId && user) {
        try {
          const response = await axios.get(
            `/api/generation/conversation/${conversationId}`
          );
          if (response.data.success) {
            const conversation = response.data.data;
            setCurrentConversationId(conversation.id);

            // Convertir les messages en format pour l'affichage
            const messages: ChatMessageType[] = conversation.messages.map(
              (msg: { id: string; senderType: string; content: string; createdAt: string; contentJson?: { metadata?: unknown } }) => ({
                id: msg.id,
                type: msg.senderType === "USER" ? "user" : "ai",
                content: msg.content,
                timestamp: new Date(msg.createdAt),
                metadata: msg.contentJson?.metadata,
              })
            );

            setConversationHistory(messages);

            // Mettre à jour les paramètres de forme avec ceux de la conversation
            if (conversation.meta) {
              setForm((prev) => ({
                ...prev,
                platform: conversation.meta.platform || prev.platform,
                tone: conversation.meta.tone || prev.tone,
                length: conversation.meta.length || prev.length,
                targetAudience:
                  conversation.meta.audience || prev.targetAudience,
              }));
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la conversation:", error);
        }
      }
    };

    if (router.isReady) {
      loadConversation();
    }
  }, [router.isReady, router.query.conversation, user]);

  // Charger l'historique depuis localStorage au montage (fallback)
  useEffect(() => {
    if (!router.query.conversation) {
      try {
        const raw = localStorage.getItem("cf_conversation_history");
        if (raw) {
          const parsed = JSON.parse(raw) as Array<{
            type: "user" | "ai";
            content: string;
            timestamp: string;
            metadata?: { platform: string; tone: string; length: string };
          }>;
          const withDates: ChatMessageType[] = parsed.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setConversationHistory(withDates);
        }
      } catch (err) {
        console.error("Impossible de charger l'historique", err);
      }
    }
  }, [router.query.conversation]);

  // Persister l'historique à chaque modification
  useEffect(() => {
    try {
      const serializable = conversationHistory.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      }));
      localStorage.setItem(
        "cf_conversation_history",
        JSON.stringify(serializable)
      );
    } catch (err) {
      console.error("Impossible d'enregistrer l'historique", err);
    }
  }, [conversationHistory]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setConversationHistory([]);
    setForm((prev) => ({ ...prev, subject: "" }));
  };

  const saveToDatabase = async (userMessage: string, aiMessage: string) => {
    try {
      const response = await axios.post("/api/generation/save", {
        conversationId: currentConversationId,
        userMessage,
        aiMessage,
        platform: form.platform,
        tone: form.tone,
        length: form.length,
        audience: form.targetAudience,
        userId: user!.id,
      });

      if (response.data.success) {
        const { conversation } = response.data.data;
        if (!currentConversationId) {
          setCurrentConversationId(conversation.id);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        appConfig.n8nBaseUrl ||
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
        createdAt: new Date(),
        isFavorite: false,
      };

      // Ajouter à l'historique de conversation
      const userMessage: ChatMessageType = {
        type: "user" as const,
        content: form.subject,
        timestamp: new Date(),
        metadata: {
          platform: form.platform,
          tone: form.tone,
          length: form.length,
        },
      };

      const aiMessage: ChatMessageType = {
        type: "ai" as const,
        content: output,
        timestamp: new Date(),
        metadata: {
          platform: form.platform,
          tone: form.tone,
          length: form.length,
        },
      };

      setConversationHistory((prev) => [...prev, userMessage, aiMessage]);
      setGeneratedContent(newContent);

      // Sauvegarder en base de données
      await saveToDatabase(form.subject, output);

      // Réinitialiser le champ de saisie pour permettre une nouvelle question
      setForm((prev) => ({ ...prev, subject: "" }));
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      alert("Erreur lors de la génération du contenu. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <DashboardLayout title="Générateur de Contenu">
      <div className="flex-1 overflow-hidden bg-white relative h-full">
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
                description="Décrivez le contenu que vous souhaitez créer et notre IA le générera pour vous."
              />
            )}
          </div>
        </div>

        <ChatInput
          value={form.subject}
          onChange={(value) => handleChange("subject", value)}
          onSubmit={() => handleSubmit()}
          isLoading={isLoading}
          placeholder="Décrivez le contenu que vous souhaitez créer..."
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
                Content Flow peut faire des erreurs. Envisagez de vérifier les
                informations importantes.
              </p>
              <div className="flex items-center justify-center space-x-4">
                {conversationHistory.length > 0 && (
                  <button
                    onClick={startNewConversation}
                    className="text-xs text-green-600 hover:text-green-800 transition-colors flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Nouvelle conversation</span>
                  </button>
                )}
                <Link
                  href="/generate/history"
                  className="text-xs text-primary/90 hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <History className="w-3 h-3" />
                  <span>Voir l&apos;historique</span>
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default GenerateChatPage;
