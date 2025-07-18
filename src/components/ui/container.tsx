import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
} 