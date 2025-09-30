import React from "react";
import { LucideIcon } from "lucide-react";

interface ChatEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  iconClassName = "text-purple-600",
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className={`w-8 h-8 ${iconClassName}`} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
