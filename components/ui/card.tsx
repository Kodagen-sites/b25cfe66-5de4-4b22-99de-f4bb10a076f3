/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }: any) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: any) {
  return <div className={cn("p-4 border-b border-gray-100", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: any) {
  return <h3 className={cn("text-base font-semibold", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: any) {
  return <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: any) {
  return <div className={cn("p-4", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: any) {
  return <div className={cn("p-4 border-t border-gray-100", className)} {...props}>{children}</div>;
}
