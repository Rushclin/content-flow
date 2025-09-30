import { ConversationWithMessages } from "@/types/chat";
import { Download, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import React from "react";

interface HistoryCardProps {
  conversation: ConversationWithMessages;
  isExpanded: boolean;
  toggleConversation: (id: string) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  conversation,
  isExpanded,
  toggleConversation,
}) => {
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
  return (
    <div>
      <div
        key={conversation.id}
        className="bg-white border border-primary/20 rounded-md p-6 shadow-xs hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-md font-semibold text-slate-600">
                {conversation.title}
              </h3>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {conversation.messages.length} messages
              </span>
            </div>

            {conversation.meta && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {conversation.meta.platform && (
                  <span className="flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    <span>{conversation.meta.platform}</span>
                  </span>
                )}
                {conversation.meta.tone && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium`}
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
          <div className="text-xs text-slate-500 text-right">
            <p>{new Date(conversation.lastMessageAt).toLocaleDateString()}</p>
            <p>{new Date(conversation.lastMessageAt).toLocaleTimeString()}</p>
          </div>
        </div>

        {isExpanded ? (
          <div className="space-y-4 mb-4">
            {conversation.messages.map((message) => (
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
                      <p className="text-sm font-medium">{message.content}</p>
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
              {conversation.messages.length > 0 &&
                conversation.messages[
                  conversation.messages.length - 1
                ].content.substring(0, 150)}
              {conversation.messages.length > 0 &&
                conversation.messages[conversation.messages.length - 1].content
                  .length > 150 && "..."}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toggleConversation(conversation.id)}
              className="flex items-center space-x-2 text-sm text-primary/70 hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isExpanded ? "Réduire" : "Voir conversation"}</span>
            </button>
            <button
              onClick={() => downloadConversation(conversation)}
              className="flex items-center space-x-2 text-sm text-primary/60 hover:text-primary cursor-pointer transition-colors"
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
    </div>
  );
};

export default HistoryCard;
