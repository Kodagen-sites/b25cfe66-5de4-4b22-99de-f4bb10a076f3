/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@/lib/cn";

export function Avatar({ className, children, ...props }: any) {
  return (
    <span
      className={cn("relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ className, alt = "", ...props }: any) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={cn("h-full w-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, children, ...props }: any) {
  return (
    <span className={cn("flex h-full w-full items-center justify-center text-sm font-medium text-gray-600", className)} {...props}>
      {children}
    </span>
  );
}
