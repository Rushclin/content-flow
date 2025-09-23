import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  title: string;
  className?: string;
}

const Badge: FC<BadgeProps> = ({ title, className }) => {
  return (
    <span
      className={twMerge(
        "text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium",
        className
      )}
    >
      {title}
    </span>
  );
};

export default Badge;
