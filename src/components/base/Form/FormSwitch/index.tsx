/* eslint-disable react/display-name */
import React from "react";
import FormCheck, { FormCheckProps, LabelProps } from "../FormCheck";
import { twMerge } from "tailwind-merge";

function FormSwitch(props: FormCheckProps) {
  return <FormCheck {...props}>{props.children}</FormCheck>;
}

FormSwitch.Label = (props: LabelProps) => {
  return <FormCheck.Label {...props}>{props.children}</FormCheck.Label>;
};

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  type: "checkbox";
}

FormSwitch.Input = (props: InputProps) => {
  return (
    <FormCheck.Input
      {...props}
      className={twMerge([
        // Default
        "relative h-[24px] w-[38px] rounded-full p-px",
        "before:dark:bg-darkmode-600 before:absolute before:inset-y-0 before:my-auto before:h-[20px] before:w-[20px] before:rounded-full before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:transition-[margin-left] before:duration-200 before:ease-in-out",

        // On checked
        "checked:border-primary checked:bg-primary checked:bg-none",
        "before:checked:ml-[14px] before:checked:bg-white",

        props.className,
      ])}
    />
  );
};

export default FormSwitch;
