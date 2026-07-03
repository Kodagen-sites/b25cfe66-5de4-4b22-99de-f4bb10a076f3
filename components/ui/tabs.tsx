/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const TabsCtx = React.createContext<{ value?: string; setValue: (v: string) => void }>({
  setValue: () => {},
});

export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }: any) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = value !== undefined ? value : internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsCtx.Provider value={{ value: current, setValue }}>
      <div className={className} {...props}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children, ...props }: any) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }: any) {
  const ctx = React.useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }: any) {
  const ctx = React.useContext(TabsCtx);
  if (ctx.value !== value) return null;
  return <div className={className} {...props}>{children}</div>;
}
