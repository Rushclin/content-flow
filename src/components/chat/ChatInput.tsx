import React from "react";
import { Loader2, Settings, X, Zap } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showSettings?: boolean;
  onToggleSettings?: () => void;
  settingsPanel?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Tapez votre message...",
  disabled = false,
  showSettings = false,
  onToggleSettings,
  settingsPanel,
  footerContent,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-yellow-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto p-6">
        {settingsPanel && showSettings && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Paramètres de génération
              </h3>
              {onToggleSettings && (
                <button
                  onClick={onToggleSettings}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {settingsPanel}
          </div>
        )}

        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-6 py-4 text-lg border border-yellow-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200 shadow-sm bg-white pr-20"
            rows={1}
            disabled={disabled || isLoading}
          />

          {onToggleSettings && (
            <button
              type="button"
              onClick={onToggleSettings}
              className="absolute bottom-5 right-13 w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || disabled || !value.trim()}
            className="absolute bottom-5 right-5 w-8 h-8 bg-blue-400 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </button>
        </div>

        {footerContent && (
          <div className="text-center mt-3">{footerContent}</div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
