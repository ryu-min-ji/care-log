import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-ink-green text-paper hover:bg-ink-green/90 disabled:bg-ink/20 disabled:text-ink/40",
  secondary:
    "border border-ink-green text-ink-green hover:bg-accent-soft disabled:border-ink/20 disabled:text-ink/40",
  ghost: "text-ink-green hover:bg-accent-soft disabled:text-ink/40",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-green disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
