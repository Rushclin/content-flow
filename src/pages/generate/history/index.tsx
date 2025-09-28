import { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  Sparkles,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import { useUser } from "@clerk/nextjs";

interface ConversationWithMessages {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  meta: any;
  messages: Array<{
    id: string;
    content: string;
    senderType: string;
    createdAt: string;
    contentJson: any;
  }>;
}

const GenerationHistoryPage = () => {
  const { user } = useUser();

  const [conversations, setConversations] = useState<
    ConversationWithMessages[]
  >([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationWithMessages[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [expandedConversations, setExpandedConversations] = useState<
    Set<string>
  >(new Set());

  const fetchHistory = async () => {
    if (!user?.id) return; // Attendre que l'utilisateur soit chargé

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/generation/history?userId=${user.id}`
      );
      if (response.data.success) {
        const conversationsData = response.data.data;
        setConversations(conversationsData);
        setFilteredConversations(conversationsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]); // Déclencher quand l'utilisateur est chargé

  useEffect(() => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(
        (conversation) =>
          conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conversation.messages.some((message) =>
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (conversation) =>
          conversation.meta?.platform?.toLowerCase() === platformFilter
      );
    }

    setFilteredConversations(filtered);
  }, [conversations, searchTerm, platformFilter]);

  const toggleConversation = (conversationId: string) => {
    const newExpanded = new Set(expandedConversations);
    if (newExpanded.has(conversationId)) {
      newExpanded.delete(conversationId);
    } else {
      newExpanded.add(conversationId);
    }
    setExpandedConversations(newExpanded);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const downloadConversation = (conversation: ConversationWithMessages) => {
    const content = conversation.messages
      .map((msg) => {
        const sender = msg.senderType === "USER" ? "Vous" : "Content Flow";
        const timestamp = new Date(msg.createdAt).toLocaleString();
        return `[${timestamp}] ${sender}: ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation_${conversation.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPlatformEmoji = (platform: string) => {
    const platformMap: Record<string, string> = {
      linkedin: "💼",
      twitter: "🐦",
      facebook: "📘",
      wordpress: "📝",
      reddit: "🤖",
    };
    return platformMap[platform.toLowerCase()] || "📄";
  };

  const getToneColor = (tone: string) => {
    const toneMap: Record<string, string> = {
      professionnel: "bg-blue-100 text-blue-800",
      amical: "bg-green-100 text-green-800",
      formel: "bg-purple-100 text-purple-800",
      decontracte: "bg-yellow-100 text-yellow-800",
    };
    return toneMap[tone.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Historique des Générations">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement de l'historique...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Historique des Générations">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Filtres et recherche */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Toutes les plateformes</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="wordpress">WordPress</option>
                <option value="reddit">Reddit</option>
              </select>
            </div>

            <button
              onClick={fetchHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Messages totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.reduce(
                    (total, conv) => total + conv.messages.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    conversations.filter((conv) => {
                      const now = new Date();
                      const convDate = new Date(conv.createdAt);
                      return (
                        convDate.getMonth() === now.getMonth() &&
                        convDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Résultats filtrés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredConversations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des conversations */}
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {conversations.length === 0
                ? "Aucune conversation trouvée"
                : "Aucun résultat ne correspond à vos critères"}
            </h3>
            <p className="text-gray-600">
              {conversations.length === 0
                ? "Commencez par créer votre première conversation."
                : "Essayez de modifier vos filtres de recherche."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const isExpanded = expandedConversations.has(conversation.id);
              return (
                <div
                  key={conversation.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {conversation.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {conversation.messages.length} messages
                        </span>
                      </div>

                      {conversation.meta && (
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {conversation.meta.platform && (
                            <span className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              <span>
                                {getPlatformEmoji(conversation.meta.platform)}
                              </span>
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
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <p>
                        {new Date(
                          conversation.lastMessageAt
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        {new Date(
                          conversation.lastMessageAt
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Aperçu ou messages complets */}
                  {isExpanded ? (
                    <div className="space-y-4 mb-4">
                      {conversation.messages.map((message, msgIndex) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderType === "USER"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-4xl ${
                              message.senderType === "USER" ? "ml-12" : "mr-12"
                            }`}
                          >
                            {message.senderType === "USER" ? (
                              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                                <p className="text-sm font-medium">
                                  {message.content}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                  <p className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div
                              className={`mt-1 text-xs text-gray-500 ${
                                message.senderType === "USER"
                                  ? "text-right"
                                  : "text-left ml-9"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        <span className="font-medium">Dernier message:</span>{" "}
                        {conversation.messages[
                          conversation.messages.length - 1
                        ]?.content.substring(0, 150)}
                        {conversation.messages[conversation.messages.length - 1]
                          ?.content.length > 150 && "..."}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleConversation(conversation.id)}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {isExpanded ? "Réduire" : "Voir conversation"}
                        </span>
                      </button>
                      <button
                        onClick={() => downloadConversation(conversation)}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </button>
                    </div>

                    <a
                      href={`/generate?conversation=${conversation.id}`}
                      className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Continuer</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GenerationHistoryPage;
