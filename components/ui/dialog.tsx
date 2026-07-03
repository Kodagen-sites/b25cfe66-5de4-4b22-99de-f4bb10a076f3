/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

export function DialogContent({ className, children, ...props }: any) {
  return (
    <div className={cn("rounded-lg bg-white p-6 shadow-xl", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogHeader({ className, children, ...props }: any) {
  return <div className={cn("mb-4 space-y-1", className)} {...props}>{children}</div>;
}

export function DialogFooter({ className, children, ...props }: any) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props}>{children}</div>;
}

export function DialogTitle({ className, children, ...props }: any) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props}>{children}</h2>;
}

export function DialogDescription({ className, children, ...props }: any) {
  return <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>;
}
