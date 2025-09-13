import React from "react";
import { twMerge } from "tailwind-merge";

interface DividerProps {
  title?: string;
  className?: string;
}
const Divider: React.FC<DividerProps> = ({ title, className }) => {
  return (
    <div className={twMerge("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500">{title ?? title}</span>
      </div>
    </div>
  );
};

export default Divider;
