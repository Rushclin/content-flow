import React, { createContext } from "react";
import { twMerge } from "tailwind-merge";

type FormInlineProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"div">;

export const formInlineContext = createContext(false);

function FormInline(props: FormInlineProps) {
  return (
    <formInlineContext.Provider value={true}>
      <div
        {...props}
        className={twMerge(["block items-center sm:flex", props.className])}
      >
        {props.children}
      </div>
    </formInlineContext.Provider>
  );
}

export default FormInline;
