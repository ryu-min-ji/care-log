import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "attention";
}

export function Badge({ tone = "default", className = "", ...props }: BadgeProps) {
  const toneClass =
    tone === "attention"
      ? "bg-gold/15 text-gold"
      : "bg-accent-soft text-ink-green";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${toneClass} ${className}`}
      {...props}
    />
  );
}
