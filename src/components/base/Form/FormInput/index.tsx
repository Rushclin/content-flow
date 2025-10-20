/* eslint-disable react/display-name */
import React, { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
}

type FormInputRef = React.ComponentPropsWithRef<"input">["ref"];

const FormInput = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const formInline = useContext(formInlineContext);
  const inputGroup = useContext(inputGroupContext);
  const { formInputSize, rounded, ...computedProps } = props;
  return (
    <input
      {...computedProps}
      ref={ref}
      className={twMerge([
        "cursor-pointer p-2 px-4 text-sm disabled:cursor-not-allowed disabled:bg-slate-100",
        "[&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100",
        "w-full rounded-md border-slate-300/60 text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20",
        props.formInputSize == "sm" && "px-2 py-1.5 text-xs",
        props.formInputSize == "lg" && "px-4 py-1.5 text-lg",
        props.rounded && "rounded-full",
        formInline && "flex-1",
        inputGroup &&
          "z-10 rounded-none first:rounded-l last:rounded-r [&:not(:first-child)]:border-l-transparent",
        props.className,
      ])}
    />
  );
});

export default FormInput;
