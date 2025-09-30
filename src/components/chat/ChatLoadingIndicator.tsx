import React from "react";
import { Sparkles } from "lucide-react";

interface ChatLoadingIndicatorProps {
  message?: string;
}

const ChatLoadingIndicator: React.FC<ChatLoadingIndicatorProps> = ({
  message = "Content Flow génère votre contenu...",
}) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-3xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-gray-500 text-sm">{message}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLoadingIndicator;
