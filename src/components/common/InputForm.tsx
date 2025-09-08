import React, { ChangeEvent, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email" | "phone";
  textarea?: boolean;
  placeholder?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  validation?: (value: string) => boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  smallText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  placeholder,
  required = false,
  prefix,
  suffix,
  validation,
  disabled = false,
  className,
  inputClassName,
  smallText,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [customType, setCustomType] = useState(type);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    if (validation) {
      setError(validation(val) ? null : "Invalid input");
    }
    onChange(val);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    setCustomType(customType === "password" ? "text" : "password");
  };

  const customSuffix = useMemo(() => {
    if (type === "password") {
      return (
        <div onClick={handlePasswordToggle} className="cursor-pointer px-2">
          {showPassword ? <Eye /> : <EyeOff />}
        </div>
      );
    }
    return suffix;
  }, [type, showPassword, suffix]);

  const baseClass = twMerge(
    "w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-slate-400 text-sm py-2",
    prefix ? "pl-10" : "pl-2",
    customSuffix ? "pr-12" : "pr-2",
    inputClassName,
    error ? "ring-red-500" : ""
  );

  return (
    <div className={twMerge("flex flex-col my-2", className)}>
      {label && (
        <label className="mb-1 text-gray-600 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            {prefix}
          </div>
        )}

        {textarea ? (
          <textarea
            className={twMerge(baseClass, "resize-none h-32")}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        ) : (
          <input
            type={customType}
            className={baseClass}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        )}

        {customSuffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {customSuffix}
          </div>
        )}
      </div>
      {(smallText || error) && (
        <small className={twMerge(error ? "text-red-500" : "text-gray-500")}>
          {error || smallText}
        </small>
      )}
    </div>
  );
};

export default Input;
