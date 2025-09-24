import React, { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface RadioCardGroupProps {
  label?: string;
  name: string;
  options: Option[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  className,
}) => {
  return (
    <div className={twMerge("flex flex-col text-left my-2", className)}>
      {label && (
        <label className="mb-1 text-slate-500 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={twMerge(
              "relative flex items-center justify-center p-2 sm:p-3 border rounded-md cursor-pointer transition-all duration-200 text-sm sm:text-base",
              value === opt.value
                ? "border-primary bg-slate-50 text-slate-700"
                : "border-gray-200 hover:border-slate-300 text-gray-600"
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className="sr-only"
              required={required}
            />
            <span className="text-xs sm:text-sm font-medium capitalize flex items-center gap-1">
              {opt.icon} {opt.label}
            </span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default RadioCardGroup;
