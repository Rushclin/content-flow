/* eslint-disable react/display-name */
import { twMerge } from "tailwind-merge";
import React from "react";

export type FormCheckProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"div">;

function FormCheck(props: FormCheckProps) {
  return (
    <div {...props} className={twMerge(["flex items-center", props.className])}>
      {props.children}
    </div>
  );
}

export type LabelProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"label">;

FormCheck.Label = (props: LabelProps) => {
  return (
    <label
      {...props}
      className={twMerge(["ml-2 cursor-pointer", props.className])}
    >
      {props.children}
    </label>
  );
};

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  className?: React.ComponentPropsWithoutRef<"input">["className"];
  type: "radio" | "checkbox";
}

FormCheck.Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      {...props}
      className={twMerge([
        // Default
        "transition-all duration-100 ease-in-out",

        // Input type radio
        props.type == "radio" &&
          "cursor-pointer border-slate-300/80 shadow-sm focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:ring-offset-0",

        // Input type checkbox
        props.type == "checkbox" &&
          "cursor-pointer rounded border-slate-300/80 shadow-sm focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:ring-offset-0",

        // On checked
        "[&[type='radio']]:checked:border-primary/50 [&[type='radio']]:checked:border-opacity-10 [&[type='radio']]:checked:bg-primary/60",
        "[&[type='checkbox']]:checked:border-primary/50 [&[type='checkbox']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary/60",

        // On indeterminate
        "[&[type='checkbox']]:indeterminate:border-primary/50 [&[type='checkbox']]:indeterminate:border-opacity-10 [&[type='checkbox']]:indeterminate:bg-primary/60",
        "[&[type='checkbox']]:indeterminate:before:border-primary/50 [&[type='checkbox']]:indeterminate:before:border-opacity-10 [&[type='checkbox']]:indeterminate:before:bg-primary/60",

        // On checked and not disabled
        "[&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:bg-slate-100",

        // On checked and disabled
        "[&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:opacity-70",
        props.className,
      ])}
      ref={ref}
    />
  );
});

export default FormCheck;
