/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export const Checkbox = React.forwardRef<HTMLInputElement, any>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        onCheckedChange?.(e.target.checked);
        onChange?.(e);
      }}
      className={cn("h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400", className)}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";
