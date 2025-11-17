import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChatMessageType } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessageType;
  onCopy?: (content: string) => void;
}

const MessageBubble = ({ message, onCopy }: MessageBubbleProps) => {
  const { t } = useTranslation();

  return (
    <div
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
            {message.metadata.platform && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {message.metadata.platform}
              </span>
            )}
            {message.metadata.tone && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                {message.metadata.tone}
              </span>
            )}
            {message.metadata.length && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                {message.metadata.length}
              </span>
            )}
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

        {message.type === "ai" && onCopy && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={() => onCopy(message.content)}
              className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              {t("common.copy", "Copier")}
            </button>
            <span className="ml-auto text-xs text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {message.type === "user" && (
          <div className="flex justify-end mt-2">
            <span className="text-xs text-white/70">
              {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
