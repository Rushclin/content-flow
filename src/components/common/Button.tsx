import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  children,
  className,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const baseClass = twMerge(
    "recoleta w-full mt-5 bg-gradient-to-r cursor-pointer from-slate-600 to-slate-400 text-white py-2.5 sm:py-3 px-4 rounded-md disabled:opacity-50 transition-all duration-200",
    className
  );

  return (
    <button
      className={baseClass}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : children}
    </button>
  );
};

export default Button;
