/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
