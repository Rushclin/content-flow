import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  RefreshCw,
  MessageCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/layout/dashboard";
import { useUser } from "@clerk/nextjs";
import StatCard from "@/components/chat/StatCard";
import Input from "@/components/common/Input";
import { ConversationWithMessages } from "@/services";
import { useTranslation } from "react-i18next";
import HistoryCard from "@/components/chat/history/HistoryCard";

const GenerationHistoryPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [conversations, setConversations] = useState<
    ConversationWithMessages[]
  >([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationWithMessages[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Déclencher quand l'utilisateur est chargé

  useEffect(() => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(
        (conversation) =>
          conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conversation.messages.some((message: { content: string }) =>
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }


    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  const toggleConversation = (conversationId: string) => {
    const newExpanded = new Set(expandedConversations);
    if (newExpanded.has(conversationId)) {
      newExpanded.delete(conversationId);
    } else {
      newExpanded.add(conversationId);
    }
    setExpandedConversations(newExpanded);
  };

  // const getPlatformEmoji = (platform: string) => {
  //   const platformMap: Record<string, string> = {
  //     linkedin: "💼",
  //     twitter: "🐦",
  //     facebook: "📘",
  //     wordpress: "📝",
  //     reddit: "🤖",
  //   };
  //   return platformMap[platform.toLowerCase()] || "📄";
  // };

  // const getToneColor = (tone: string) => {
  //   const toneMap: Record<string, string> = {
  //     professionnel: "bg-blue-100 text-blue-800",
  //     amical: "bg-green-100 text-green-800",
  //     formel: "bg-purple-100 text-purple-800",
  //     decontracte: "bg-yellow-100 text-yellow-800",
  //   };
  //   return toneMap[tone.toLowerCase()] || "bg-gray-100 text-gray-800";
  // };

  if (isLoading) {
    return (
      <DashboardLayout title="Historique des Générations">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t("generate.history.title", "Historique des Générations")}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              prefix={
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              }
              placeholder={t("generate.history.searchPlaceholder", "Rechercher dans l'historique...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* <Select
              label="Toutes les plateforme"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              options={appConfig.platforms.map((platform) => ({
                label: platform.label,
                value: platform.value,
              }))}
            /> */}

            <button
              onClick={fetchHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/90 text-white rounded-full hover:bg-primary cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t("generate.history.refresh", "Actualiser")}</span>
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={MessageCircle}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
            title={t("generate.history.conversations", "Conversations")}
            value={conversations.length}
          />

          <StatCard
            icon={MessageSquare}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            title={t("generate.history.totalMessages", "Messages totaux")}
            value={conversations.reduce(
              (total, conv) => total + conv.messages.length,
              0
            )}
          />

          <StatCard
            icon={Calendar}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            title={t("generate.history.thisMonth", "Ce mois-ci")}
            value={
              conversations.filter((conv) => {
                const now = new Date();
                const convDate = new Date(conv.createdAt);
                return (
                  convDate.getMonth() === now.getMonth() &&
                  convDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          />
        </div>

        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 recoleta">
              {conversations.length === 0
                ? t("generate.history.noConversationsFound", "Aucune conversation trouvée")
                : t("generate.history.noResultsFound", "Aucun résultat ne correspond à vos critères")}
            </h3>
            <p className="text-gray-600 recoleta">
              {conversations.length === 0
                ? t("generate.history.startFirstConversation", "Commencez par créer votre première conversation.")
                : t("generate.history.tryModifyFilters", "Essayez de modifier vos filtres de recherche.")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const isExpanded = expandedConversations.has(conversation.id);
              return (
                <HistoryCard
                  key={conversation.id}
                  conversation={conversation}
                  isExpanded={isExpanded}
                  toggleConversation={toggleConversation}
                />
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GenerationHistoryPage;
