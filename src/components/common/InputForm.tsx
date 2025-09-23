import React, { ChangeEvent, useState, useMemo, useCallback, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  error?: string;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  placeholder,
  required = false,
  prefix,
  suffix,
  // validation,
  disabled = false,
  className,
  inputClassName,
  smallText,
  error,
  name,
  onBlur,
  ...rest
}, ref) => {
  const displayError = error;
  const [showPassword, setShowPassword] = useState(false);
  const [customType, setCustomType] = useState(type);


  const handlePasswordToggle = useCallback(() => {
    setShowPassword(!showPassword);
    setCustomType(customType === "password" ? "text" : "password");
  }, [showPassword, customType]);

  const customSuffix = useMemo(() => {
    if (type === "password") {
      return (
        <div onClick={handlePasswordToggle} className="cursor-pointer px-2">
          {showPassword ? <Eye /> : <EyeOff />}
        </div>
      );
    }
    return suffix;
  }, [type, showPassword, suffix, handlePasswordToggle]);

  const baseClass = twMerge(
    "w-full rounded-md border-0 ring-1 ring-inset ring-primary text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-inset focus:ring-primary focus:border-1 text-sm py-2",
    prefix ? "pl-10" : "pl-2",
    customSuffix ? "pr-12" : "pr-2",
    inputClassName,
    displayError ? "ring-red-500" : ""
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
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={twMerge(baseClass, "resize-none h-32")}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            name={name}
            {...rest}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={customType}
            className={baseClass}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            name={name}
            {...rest}
          />
        )}

        {customSuffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {customSuffix}
          </div>
        )}
      </div>
      {(smallText || displayError) && (
        <small className={twMerge(displayError ? "text-red-500" : "text-gray-500")}>
          {displayError || smallText}
        </small>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;