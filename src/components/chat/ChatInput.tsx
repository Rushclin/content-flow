import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(56); // hauteur initiale (py-4 = 32px + 24px line-height)
  const [isMultiline, setIsMultiline] = useState(false);

  // Ajuste dynamiquement la hauteur du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 8 * 24 + 32); // max 8 lignes + padding
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);

      // Détecter si multiline (plus d'une ligne)
      const lineHeight = 24;
      const padding = 32;
      const isNowMultiline = newHeight > (lineHeight + padding);
      setIsMultiline(isNowMultiline);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {settingsPanel && showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {t("generate.settings", "Paramètres de génération")}
                  </h3>
                  {onToggleSettings && (
                    <button
                      onClick={onToggleSettings}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title={t("common.close", "Fermer")}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {settingsPanel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          animate={{ height: textareaHeight }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled || isLoading}
            className="w-full px-6 py-4 text-md border border-primary rounded-md
              focus:outline-none focus:ring-primary focus:border-primary resize-none
              placeholder-gray-400 transition-all duration-200 bg-white pr-28 leading-6"
            style={{ maxHeight: "192px", overflowY: "auto" }}
          />

          <motion.div
            className="absolute right-5 flex items-center space-x-2"
            animate={{
              bottom: isMultiline ? "12px" : "50%",
              translateY: isMultiline ? "0%" : "50%",
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {onToggleSettings && (
              <Button
                type="button"
                onClick={onToggleSettings}
                className="rounded-md text-white bg-slate-600 transition-colors"
              >
                <Settings className="w-3 h-3" />
              </Button>
            )}

            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || disabled || !value.trim()}
              className="rounded-md bg-primary/90 text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ArrowUpRight className="w-3 h-3" />
              )}
            </Button>
          </motion.div>
        </motion.div>

        {footerContent && (
          <div className="text-center mt-3">{footerContent}</div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
