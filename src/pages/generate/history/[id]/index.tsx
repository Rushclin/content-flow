import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  ArrowLeft,
  Copy,
  Download,
  Calendar,
  MessageCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import { useUser } from "@clerk/nextjs";
import Button from "@/components/common/Button";
import ChatMessage from "@/components/chat/ChatMessage";
import { ConversationWithMessages, ChatMessageType } from "@/types/chat";

const ConversationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [conversation, setConversation] =
    useState<ConversationWithMessages | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = async (userId: string) => {
    if (!id || typeof id !== "string") return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/generation/conversation/${id}?userId=${userId}`
      );

      console.log({ response });
      if (response.data.success) {
        const conv = response.data.data;
        setConversation(conv);

        // Convertir les messages au format ChatMessageType
        const messages: ChatMessageType[] = conv.messages.map((msg: any) => ({
          id: msg.id,
          type: msg.senderType === "USER" ? "user" : "ai",
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          metadata: msg.contentJson?.metadata,
        }));
        setChatMessages(messages);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement de la conversation:", error);
      if (error.response?.status === 404) {
        setError("Conversation non trouvée");
      } else if (error.response?.status === 401) {
        setError("Non autorisé");
      } else {
        setError("Erreur lors du chargement de la conversation");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchConversation(user.id);
  }, [id, user?.id]);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const downloadConversation = () => {
    if (!chatMessages.length) return;

    const content = chatMessages
      .map((msg) => {
        const sender = msg.type === "user" ? "Vous" : "Content Flow";
        const timestamp = msg.timestamp.toLocaleString();
        return `[${timestamp}] ${sender}: ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation_${
      conversation?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
      "conversation"
    }.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getToneColor = (tone: string) => {
    const toneMap: Record<string, string> = {
      professionnel: "bg-blue-100 text-blue-800",
      amical: "bg-green-100 text-green-800",
      formel: "bg-purple-100 text-purple-800",
      decontracte: "bg-yellow-100 text-yellow-800",
    };
    return toneMap[tone?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const continueConversation = () => {
    router.push(`/generate?conversation=${conversation?.id}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Détails de la conversation">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement de la conversation...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Erreur">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error}
            </h3>
            <button
              onClick={() => router.push("/generate/history")}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'historique</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout title="Conversation non trouvée">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Conversation non trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Cette conversation n'existe pas ou a été supprimée.
            </p>
            <button
              onClick={() => router.push("/generate/history")}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-purple-600  text-white rounded-lg hover:bg-purple-700  transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'historique</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={conversation.title || "Conversation"}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/generate/history")}
            className="flex items-center space-x-2 text-white bg-primary/80 rounded-full py-1 px-3 hover:bg-primary  mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="text-xs">Retour à l'historique</span>
          </button>

          <div className="bg-white border border-primary/30 rounded-md p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-xl font-light text-slate-700 mb-2">
                  {conversation.title || "Conversation sans titre"}
                </h1>

                {conversation.meta && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {conversation.meta.platform && (
                      <span className="flex  items-center space-x-1 bg-gray-100  text-gray-700 px-3 py-1 rounded-full text-sm">
                        <span>{conversation.meta.platform}</span>
                      </span>
                    )}
                    {conversation.meta.tone && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getToneColor(
                          conversation.meta.tone
                        )}`}
                      >
                        {conversation.meta.tone}
                      </span>
                    )}
                    {conversation.meta.length && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {conversation.meta.length}
                      </span>
                    )}

                    {conversation.meta.audience && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        {conversation.meta.audience}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1 text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Créée le{" "}
                      {new Date(conversation.createdAt).toLocaleDateString()} à{" "}
                      {new Date(conversation.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />

                    <span>
                      {conversation.messages.length}
                      messages
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={continueConversation}
                className="inline-flex w-auto items-center space-x-2 px-4 py-0 bg-primary/80 text-white rounded-full hover:bg-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Continuer la conversation</span>
              </Button>

              <Button
                onClick={downloadConversation}
                className="inline-flex w-auto items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </Button>

              <Button
                onClick={() =>
                  copyToClipboard(
                    chatMessages.map((m) => m.content).join("\n\n")
                  )
                }
                className="inline-flex w-auto items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copier tout</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {chatMessages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              message={message}
              index={index}
              showActions={message.type === "ai"}
              onCopy={copyToClipboard}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className=" border  border-primary rounded-xl p-6 recoleta">
            <h3
              className="text-lg  font-semibold text-gray-900 mb-2"
            >
              Voulez-vous continuer cette conversation ?
            </h3>
            <p className="text-gray-600 mb-4">
              Reprenez là où vous vous êtes arrêté et générez plus de contenu.
            </p>
            <Button
              onClick={continueConversation}
              className="inline-flex w-auto items-center  space-x-2 mx-auto px-6 py-3 bg-primary/80  text-white rounded-full hover:bg-primary  transition-colors"
            >
              <ExternalLink
                className="w-5  h-5"
              />
              <span>Continuer la conversation</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationDetailPage;
