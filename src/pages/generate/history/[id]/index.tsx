// import DashboardLayout from '@/layout/dashboard'
// import axios from 'axios'
// import { useRouter } from 'next/router'
// import React, { useEffect } from 'react'

// const Details = () => {
//   const router = useRouter()
//   const { id } = router.query

//   useEffect(() => {
//     const fetHistory = async () => {
//         const res = axios.get(`/api/`)
//     }
//     fetHistory()
//   },[router])
//   return (
//     <DashboardLayout title='Hello' description='hell'>
//       <div>
//         <h1>Détails de la conversation</h1>
//         <p>ID : {id}</p>
//       </div>
//     </DashboardLayout>
//   )
// }

// export default Details

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  ArrowLeft,
  Copy,
  Download,
  Sparkles,
  Calendar,
  MessageCircle,
  ExternalLink,
  Share2,
  RefreshCw,
  User,
  Bot,
} from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import { useUser } from "@clerk/nextjs";

interface Message {
  id: string;
  content: string;
  senderType: string;
  senderUserId?: string | null;
  createdAt: string;
  contentJson?: any;
  isDeleted: boolean;
}

interface ConversationDetail {
  id: string;
  title?: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string | null;
  meta?: any;
  messages: Message[];
}

const ConversationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [conversation, setConversation] = useState<ConversationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = async (userId: string) => {
    if (!id || typeof id !== "string") return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/generation/conversation/${id}?userId=${userId}`);

            console.log({response})
      if (response.data.success) {
        setConversation(response.data.data);
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
    if (!conversation) return;

    const content = conversation.messages
      .map((msg) => {
        const sender = msg.senderType === "USER" ? "Vous" : "Content Flow";
        const timestamp = new Date(msg.createdAt).toLocaleString();
        return `[${timestamp}] ${sender}: 
 ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation_${
      conversation.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
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
      <DashboardLayout
        title="Détails de la conversation"
      >
        <div
          className="flex items-center justify-center h-full"
        >
          <div className="text-center">
            <RefreshCw
              className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4"
            />
            <p className="text-gray-600">Chargement de la conversation...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Erreur">
        <div
          className="flex items-center 
 justify-center h-full"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 
 bg-red-100 rounded-full flex items-center 
 justify-center mx-auto mb-4"
            >
              <MessageCircle
                className="w-8 
 h-8 text-red-600"
              />
            </div>
            <h3
              className="text-lg 
 font-semibold text-gray-900 mb-2"
            >
              {error}
            </h3>
            <button
              onClick={() => router.push("/generate/history")}
              className="flex items-center 
 space-x-2 mx-auto px-4 py-2 bg-purple-600 
 text-white rounded-lg hover:bg-purple-700 
 transition-colors"
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
      <DashboardLayout
        title="Conversation non
  trouvée"
      >
        <div
          className="flex items-center 
 justify-center h-full"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 
 bg-gray-100 rounded-full flex items-center 
 justify-center mx-auto mb-4"
            >
              <MessageCircle
                className="w-8 
 h-8 text-gray-400"
              />
            </div>
            <h3
              className="text-lg 
 font-semibold text-gray-900 mb-2"
            >
              Conversation non trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Cette conversation n'existe pas ou a été supprimée.
            </p>
            <button
              onClick={() => router.push("/generate/history")}
              className="flex items-center 
 space-x-2 mx-auto px-4 py-2 bg-purple-600 
 text-white rounded-lg hover:bg-purple-700 
 transition-colors"
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
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/generate/history")}
            className="flex items-center 
 space-x-2 text-gray-600 hover:text-gray-800 
 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'historique</span>
          </button>

          <div
            className="bg-white border 
 border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div
              className="flex items-start 
 justify-between mb-4"
            >
              <div className="flex-1">
                <h1
                  className="text-2xl 
 font-bold text-gray-900 mb-2"
                >
                  {conversation.title || "Conversation sans titre"}
                </h1>

                {conversation.meta && (
                  <div
                    className="flex 
 flex-wrap items-center gap-2 mb-3"
                  >
                    {conversation.meta.platform && (
                      <span
                        className="flex 
 items-center space-x-1 bg-gray-100 
 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {/* <span>{getPlatformEmoji(conversation.meta.platform)}</span> */}

                        <span>{conversation.meta.platform}</span>
                      </span>
                    )}
                    {conversation.meta.tone && (
                      <span
                        className={`px-3 py-1 
 rounded-full text-sm font-medium 
 ${getToneColor(conversation.meta.tone)}`}
                      >
                        {conversation.meta.tone}
                      </span>
                    )}
                    {conversation.meta.length && (
                      <span
                        className="bg-purple-100 text-purple-700 px-3 
 py-1 rounded-full text-sm"
                      >
                        {conversation.meta.length}
                      </span>
                    )}

                    {conversation.meta.audience && (
                      <span
                        className="bg-orange-100 text-orange-700 px-3 
 py-1 rounded-full text-sm"
                      >
                        {conversation.meta.audience}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className="flex 
 items-center space-x-4 text-sm text-gray-500"
                >
                  <div
                    className="flex 
 items-center space-x-1"
                  >
                    <Calendar
                      className="w-4 
 h-4"
                    />
                    <span>
                      Créée le{" "}
                      {new Date(conversation.createdAt).toLocaleDateString()} à{" "}
                      {new Date(conversation.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    className="flex 
 items-center space-x-1"
                  >
                    <MessageCircle className="w-4 h-4" />

                    <span>
                      {conversation.messages.length}
                      messages
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-wrap 
 items-center gap-3"
            >
              <button
                onClick={continueConversation}
                className="flex items-center 
 space-x-2 px-4 py-2 bg-purple-600 text-white 
 rounded-lg hover:bg-purple-700 
 transition-colors"
              >
                <ExternalLink
                  className="w-4 
 h-4"
                />
                <span>Continuer la conversation</span>
              </button>

              <button
                onClick={downloadConversation}
                className="flex items-center 
 space-x-2 px-4 py-2 bg-gray-100 text-gray-700 
 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>

              <button
                onClick={() =>
                  copyToClipboard(
                    conversation.messages.map((m) => m.content).join("\n\n")
                  )
                }
                className="flex items-center 
 space-x-2 px-4 py-2 bg-gray-100 text-gray-700 
 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copier tout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {conversation.messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderType === "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-4xl ${
                  message.senderType === "USER" ? "ml-12" : "mr-12"
                }`}
              >
                {message.senderType === "USER" ? (
                  <div
                    className="bg-gradient-to-r from-purple-600 
 to-indigo-600 text-white rounded-2xl 
 rounded-br-md px-6 py-4 shadow-lg"
                  >
                    <div
                      className="flex 
 items-center space-x-2 mb-2"
                    >
                      <User
                        className="w-4 
 h-4"
                      />
                      <span
                        className="text-sm
  font-medium opacity-90"
                      >
                        Vous
                      </span>
                    </div>
                    <p
                      className="whitespace-pre-line 
 leading-relaxed"
                    >
                      {message.content}
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex 
 items-start space-x-3"
                  >
                    <div
                      className="w-8 h-8 
 bg-gradient-to-r from-purple-600 to-indigo-600 
 rounded-full flex items-center justify-center 
 flex-shrink-0 mt-1"
                    >
                      <Bot
                        className="w-4 h-4 
 text-white"
                      />
                    </div>
                    <div
                      className="bg-gray-50
  border border-gray-200 rounded-2xl 
 rounded-bl-md px-6 py-4 shadow-sm"
                    >
                      <div
                        className="flex 
 items-center space-x-2 mb-2"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span
                          className="text-sm font-medium 
 text-gray-700"
                        >
                          Content Flow
                        </span>
                      </div>
                      <p
                        className="text-gray-800 whitespace-pre-line 
 leading-relaxed"
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className={`mt-2 flex 
 items-center space-x-2 text-xs text-gray-500 ${
   message.senderType === "USER" ? "justify-end" : "justify-start ml-11"
 }`}
                >
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="opacity-0 
 group-hover:opacity-100 hover:text-gray-700 
 transition-all"
                    title="Copier ce message"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue conversation CTA */}
        <div className="mt-8 text-center">
          <div
            className="bg-gradient-to-r 
 from-purple-50 to-indigo-50 border 
 border-purple-200 rounded-xl p-6"
          >
            <h3
              className="text-lg 
 font-semibold text-gray-900 mb-2"
            >
              Voulez-vous continuer cette conversation ?
            </h3>
            <p className="text-gray-600 mb-4">
              Reprenez là où vous vous êtes arrêté et générez plus de contenu.
            </p>
            <button
              onClick={continueConversation}
              className="flex items-center 
 space-x-2 mx-auto px-6 py-3 bg-purple-600 
 text-white rounded-lg hover:bg-purple-700 
 transition-colors"
            >
              <ExternalLink
                className="w-5 
 h-5"
              />
              <span>Continuer la conversation</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationDetailPage;
