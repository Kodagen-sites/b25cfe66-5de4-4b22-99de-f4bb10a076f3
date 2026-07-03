/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const DdCtx = React.createContext<{ open: boolean; setOpen: (o: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }: any) {
  const [open, setOpen] = React.useState(false);
  return (
    <DdCtx.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DdCtx.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, className, children, ...props }: any) {
  void asChild;
  const ctx = React.useContext(DdCtx);
  return (
    <span className={cn("inline-flex cursor-pointer", className)} onClick={() => ctx.setOpen(!ctx.open)} {...props}>
      {children}
    </span>
  );
}

export function DropdownMenuContent({ className, align, children, ...props }: any) {
  void align;
  const ctx = React.useContext(DdCtx);
  if (!ctx.open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)} />
      <div
        className={cn(
          "absolute right-0 z-50 mt-1 min-w-[10rem] rounded-md border border-gray-200 bg-white p-1 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function DropdownMenuItem({ className, onClick, children, ...props }: any) {
  const ctx = React.useContext(DdCtx);
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        ctx.setOpen(false);
      }}
      className={cn("flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className, ...props }: any) {
  return <div className={cn("my-1 h-px bg-gray-200", className)} {...props} />;
}

export function DropdownMenuLabel({ className, children, ...props }: any) {
  return <div className={cn("px-2 py-1.5 text-xs font-semibold text-gray-400", className)} {...props}>{children}</div>;
}
