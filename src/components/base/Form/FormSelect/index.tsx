import React, { useContext } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";

interface FormSelectProps extends React.ComponentPropsWithoutRef<"select"> {
  formSelectSize?: "sm" | "lg";
}

function FormSelect(props: FormSelectProps) {
  const formInline = useContext(formInlineContext);
  const { formSelectSize, ...computedProps } = props;
  return (
    <select
      {...computedProps}
      className={
        "bg-[length:20px_auto] px-3 " +
        twMerge([
          "disabled:dark:bg-darkmode-800/50 disabled:cursor-not-allowed disabled:bg-slate-100",
          "[&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100",
          "bg-chevron-black w-full rounded-md border-slate-300/60 px-3 py-2 pr-8 text-sm shadow-sm transition duration-200 ease-in-out focus:border-transparent focus:outline-none focus:ring-1 focus:ring-primary",
          props.formSelectSize == "sm" && "py-1.5 pl-2 pr-8 text-xs",
          props.formSelectSize == "lg" && "py-1.5 pl-4 pr-8 text-lg",
          formInline && "flex-1",
          props.className,
        ])
      }
    >
      {props.children}
    </select>
  );
}

export default FormSelect;
