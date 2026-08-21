import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-ink/10 bg-paper shadow-[0_1px_2px_rgba(30,42,32,0.06)] ${className}`}
      {...props}
    />
  );
}
