import React from "react";
import { twMerge } from "tailwind-merge";

type FormHelpProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"div">;

function FormHelp(props: FormHelpProps) {
  return (
    <div
      {...props}
      className={twMerge(["mt-2 text-xs text-slate-500", props.className])}
    >
      {props.children}
    </div>
  );
}

export default FormHelp;
