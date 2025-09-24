import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  selectClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      onBlur,
      name,
      required = false,
      disabled = false,
      placeholder,
      error,
      className,
      selectClassName,
      ...rest
    },
    ref
  ) => {
    const baseClass = twMerge(
      "w-full rounded-md border border-slate-300 text-slate-900 bg-white text-sm " +
        "focus:border-primary focus:ring-0 focus:ring-primary focus:outline-none px-3 py-2.5 sm:py-3 transition-all duration-200 appearance-auto", // 🔴 retiré "appearance-none"
      selectClassName,
      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    );

    return (
      <div className={twMerge("flex flex-col text-left my-2", className)}>
        {label && (
          <label className="mb-1 text-gray-600 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <select
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={baseClass}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <small className="text-red-500 text-sm mt-1">{error}</small>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
