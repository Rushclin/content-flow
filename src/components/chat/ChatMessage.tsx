import React from "react";
import { Copy, Download, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy?: (content: string) => void;
  onDownload?: (content: string, index: number) => void;
  index?: number;
  showActions?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  onDownload,
  index = 0,
  showActions = true,
}) => {
  const { t } = useTranslation();
  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(message.content, index);
    } else {
      const blob = new Blob([message.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contenu_${index}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-3xl">
        {message.type === "user" ? (
          <div className="bg-primary/90  text-white rounded-2xl rounded-br-md px-6 py-4 shadow-xs">
            <p className="text-lg font-medium">{message.content}</p>
            {message.metadata && (
              <div className="mt-2 text-sm opacity-90">
                {message.metadata.platform && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs mr-2">
                    {message.metadata.platform}
                  </span>
                )}
                {message.metadata.tone && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs mr-2">
                    {message.metadata.tone}
                  </span>
                )}
                {message.metadata.length && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {message.metadata.length}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1">
              <div className="bg-white border border-primary rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
                    {message.content}
                  </p>
                </div>
              </div>

              {showActions && (
                <div className="flex items-center space-x-4 mt-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{t("generate.history.copy", "Copier")}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t("generate.history.download", "Télécharger")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`mt-2 text-sm text-gray-500 ${
            message.type === "user" ? "text-right" : "text-left ml-11"
          }`}
        >
          {message.type === "user" ? t("generate.history.you", "Vous") : "Content Flow"} •{" "}
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
