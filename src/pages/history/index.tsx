import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/dashboard";
import { MessageSquare, Loader2, Calendar, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { ConversationListItem } from "@/types/chat";

const HistoryPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get<{
          data: ConversationListItem[];
        }>("/conversations");

        setConversations(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
        toast.error(
          t(
            "error.loadConversations",
            "Erreur lors du chargement des conversations"
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleConversationClick = (conversationId: string) => {
    router.push(`/quick-off/${conversationId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return t("date.today", "Aujourd'hui");
    } else if (diffInDays === 1) {
      return t("date.yesterday", "Hier");
    } else if (diffInDays < 7) {
      return t("date.daysAgo", "Il y a {{count}} jours", { count: diffInDays });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const getMessageCountText = (count: number) => {
    if (count === 0) return t("messages.none", "Aucun message");
    if (count === 1) return t("messages.one", "1 message");
    return t("messages.count", "{{count}} messages", { count });
  };

  return (
    <DashboardLayout title={t("history.title", "Historique")}>
      <div className="flex-1 overflow-hidden relative h-full">

        {/* Contenu */}
        <div className="overflow-y-auto h-full px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-gray-600">
                    {t("loading.conversations", "Chargement des conversations...")}
                  </p>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  {t("history.empty", "Aucune conversation")}
                </p>
                <p className="text-gray-500 text-sm">
                  {t(
                    "history.emptyDescription",
                    "Commencez par générer du contenu pour voir vos conversations ici"
                  )}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                              {conversation.title}
                            </h3>
                            {conversation.metadata.platform && (
                              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary flex-shrink-0">
                                {conversation.metadata.platform}
                              </span>
                            )}
                          </div>

                          {conversation.last_message_preview && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {conversation.last_message_preview}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4" />
                              <span>
                                {getMessageCountText(conversation.message_count)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(conversation.updated_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
