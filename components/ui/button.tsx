/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@/lib/cn";

export const Button = React.forwardRef<HTMLButtonElement, any>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    void variant; void size; void asChild;
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
