/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, variant, children, ...props }: any) {
  void variant;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
