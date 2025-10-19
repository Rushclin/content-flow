import { Loader2 } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

interface LoadingProps {
  className?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const Loading: React.FC<LoadingProps> = ({
  className,
  centered = true,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const icon = (
    <Loader2
      className={twMerge("animate-spin", sizeClasses[size], className)}
    />
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full h-[100vh] text-slate-500">
        {icon}
      </div>
    );
  }

  return icon;
};

export default Loading;
